import _ from 'lodash';
import axios from 'axios';
import bows from 'bows';
import reduxCrud from 'redux-crud';
import cuid from 'cuid';
import io from 'socket.io-client';

import { socket } from './init';
import actionPointsActionCreators from './actionPoints';
import previousActionPointsActionCreators from './previousActionPoints';
import votingActionCreators from './voting';

const baseActionCreators = reduxCrud.actionCreatorsFor('points');

export default {
    fetchSprint (sprintId) {
        return function (dispatch) {
            const action = baseActionCreators.fetchStart();
            dispatch(action);

            // send the request
            const url = `/sprints/${sprintId}/points`;
            const promise = axios({
                url: url
            });

            promise
                .then(function (response) {
                    const returned = response.data;

                    const successAction = baseActionCreators.fetchSuccess(returned);
                    dispatch(successAction);

                    return response;
                }, errorHandler)
                .then(function () {
                    // fetch a points of selected sprint
                    const action = actionPointsActionCreators.fetchActionPoints(sprintId);
                    dispatch(action);
                }, function (e) {
                    console.error(e);
                })
                .then(function () {
                    // fetch a points of selected sprint
                    const action = previousActionPointsActionCreators.fetchPreviousActionPoints(sprintId);
                    dispatch(action);
                }, function (e) {
                    console.error(e);
                })
                .then(function () {
                    // check if is it voting
                    const action = votingActionCreators.fetchVoting();
                    dispatch(action);
                }, function (e) {
                    console.error(e);
                })
                .catch(function (err) {
                    console.error(err.toString());
                });

            function errorHandler (response) {
                const errorAction = baseActionCreators.fetchError(response);
                dispatch(errorAction);
            }

            return promise;
        }
    },

    createPoint (point, sprintId) {
        return function (dispatch) {
            const cid = cuid();
            point = point.merge({ id: cid, sprintId });
            // log('point', point)
            const optimisticAction = baseActionCreators.createStart(point);
            dispatch(optimisticAction);

            const url = `/sprints/${sprintId}/points`;
            const promise = axios({
                url: url,
                method: 'POST',
                data: point
            });

            promise.then(function (response) {
                const returned = response.data;
                const successAction = baseActionCreators.createSuccess(returned, cid);
                dispatch(successAction);

                socket.emit('client:point-added', point);
                console.log(socket);
            }, function (response) {
                const errorAction = baseActionCreators.createError(response, point);
                dispatch(errorAction);
            }).catch(function (err) {
                console.error(err.toString())
            });

            return promise;
        }
    },

    deletePoint (point, sprintId) {
        return function (dispatch) {
            const optimisticAction = baseActionCreators.deleteStart(point);
            dispatch(optimisticAction);

            const url = `/sprints/${sprintId}/points/${point.id}`;
            const promise = axios({
                url: url,
                method: 'DELETE'
            });

            promise.then(function () {
                const successAction = baseActionCreators.deleteSuccess(point);
                dispatch(successAction);

                socket.emit('client:point-deleted', point);
            }, function (response) {
                const errorAction = baseActionCreators.deleteError(response, point);
                dispatch(errorAction)
            }).catch(function (err) {
                console.error(err.toString())
            });

            return promise;
        }
    },

    votePoint (point, sprintId) {
        return function (dispatch, getState) {
            const alreadyVoted = _.contains(point.votes, localStorage.getItem('loggedAs'));

            if (!alreadyVoted) {
                point = point.merge({
                    id: point.id,
                    votes: [...point.votes, localStorage.getItem('loggedAs')]
                });

                const optimisticAction = baseActionCreators.updateStart(point);
                dispatch(optimisticAction);

                const url = `/sprints/${sprintId}/points/${point.id}`;
                const promise = axios({
                    url: url,
                    method: 'PUT',
                    data: point
                });

                promise.then(function (response) {
                    // dispatch the success action
                    const returned = response.data;
                    const successAction = baseActionCreators.updateSuccess(returned);
                    dispatch(successAction);

                    socket.emit('client:voted', point);
                    socket.emit('client:votes-stat-updated', { user: localStorage.getItem('loggedAs'), undo: false });
                }, function (response) {
                    // rejection
                    // dispatch the error action
                    const errorAction = baseActionCreators.updateError(response, point);
                    dispatch(errorAction)
                }).catch(function (err) {
                    console.error(err.toString());
                });

                return promise;
            } else {
                console.log('You are already voted');
            }
        }
    },

    undoVotePoint (point, sprintId) {
        return function (dispatch) {
            const alreadyVoted = _.contains(point.votes, localStorage.getItem('loggedAs'));
            const votes = _.filter(point.votes, (item) => {
                if (item !== localStorage.getItem('loggedAs')) {
                    return item;
                }
            });

            if (alreadyVoted) {
                point = point.merge({
                    id: point.id,
                    votes
                });

                const optimisticAction = baseActionCreators.updateStart(point);
                dispatch(optimisticAction);

                const url = `/sprints/${sprintId}/points/${point.id}`;
                const promise = axios({
                    url: url,
                    method: 'PUT',
                    data: point
                });

                promise.then(function (response) {
                    // dispatch the success action
                    const returned = response.data;
                    const successAction = baseActionCreators.updateSuccess(returned);
                    dispatch(successAction);

                    socket.emit('client:voted', point);
                    socket.emit('client:votes-stat-updated', { user: localStorage.getItem('loggedAs'), undo: true });
                }, function (response) {
                    // rejection
                    // dispatch the error action
                    const errorAction = baseActionCreators.updateError(response, point);
                    dispatch(errorAction)
                }).catch(function (err) {
                    console.error(err.toString());
                });

                return promise;
            } else {
                console.log('You are already undo');
            }
        }
    }
};