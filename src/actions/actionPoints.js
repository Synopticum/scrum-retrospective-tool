import _ from 'lodash';
import axios from 'axios';
import bows from 'bows';
import reduxCrud from 'redux-crud';
import cuid from 'cuid';
import io from 'socket.io-client';

import { socket } from './init';
import sprintsActionCreators from './sprints';

const baseActionCreators = reduxCrud.actionCreatorsFor('action_points');

export default {
    fetchActionPoints (sprintId) {
        return function (dispatch) {
            const action = baseActionCreators.fetchStart();
            dispatch(action);

            // send the request
            const url = `/sprints/${sprintId}/action_points`;
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
                    const action = sprintsActionCreators._setSelectedSprint(sprintId);
                    dispatch(action);
                }, errorHandler)
                .then(function () {
                    const action = sprintsActionCreators._checkIsSprintActive();
                    dispatch(action);
                }, errorHandler)
                .then(function () {
                    const action = sprintsActionCreators._checkIsSprintLatest();
                    dispatch(action);
                }, errorHandler)
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

    createActionPoint (point, sprintId) {
        return function (dispatch) {
            const cid = cuid();
            point = point.merge({ id: cid, sprintId });
            // log('point', point)
            const optimisticAction = baseActionCreators.createStart(point);
            dispatch(optimisticAction);

            const url = `/sprints/${sprintId}/action_points`;
            const promise = axios({
                url: url,
                method: 'POST',
                data: point
            });

            promise.then(function (response) {
                const returned = response.data;
                const successAction = baseActionCreators.createSuccess(returned, cid);
                dispatch(successAction);

                socket.emit('client:action-point-added', point);
            }, function (response) {
                const errorAction = baseActionCreators.createError(response, point);
                dispatch(errorAction);
            }).catch(function (err) {
                console.error(err.toString())
            });

            return promise;
        }
    },

    deleteActionPoint (point, sprintId) {
        return function (dispatch) {
            const optimisticAction = baseActionCreators.deleteStart(point);
            dispatch(optimisticAction);

            const url = `/sprints/${sprintId}/action_points/${point.id}`;
            const promise = axios({
                url: url,
                method: 'DELETE'
            });

            promise.then(function () {
                const successAction = baseActionCreators.deleteSuccess(point);
                dispatch(successAction);

                socket.emit('client:action-point-deleted', point);
            }, function (response) {
                const errorAction = baseActionCreators.deleteError(response, point);
                dispatch(errorAction)
            }).catch(function (err) {
                console.error(err.toString())
            });

            return promise;
        }
    },

    updateActionPoint (point, sprintId, note) {
        return function (dispatch) {
            const notes = [...point.notes, note];
            const data = point.merge({ notes });

            const promise = axios({
                url: `/sprints/${sprintId}/action_points/${point.id}`,
                method: 'PATCH',
                data
            });

            const optimisticAction = baseActionCreators.updateStart(data);
            dispatch(optimisticAction);

            promise
                .then(function (response) {
                    const returned = response.data;
                    const successAction = baseActionCreators.updateSuccess(returned);
                    dispatch(successAction);

                    socket.emit('client:action-point-updated', data);
                }, function (response) {
                    const errorAction = baseActionCreators.updateError(response, data);
                    dispatch(errorAction);
                })
                .catch(function (err) {
                    console.error(err.toString());
                });

            return promise;
        }
    },

    removeNote (noteShouldRemove, point, sprintId) {
        return function (dispatch) {

            const notes = _.filter(point.notes, (note) => {
                if (note !== noteShouldRemove) {
                    return note;
                }
            });

            point = point.merge({
                notes
            });

            const optimisticAction = baseActionCreators.updateStart(point);
            dispatch(optimisticAction);

            const url = `/sprints/${sprintId}/action_points/${point.id}`;
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

                socket.emit('client:action-point-updated', point);
            }, function (response) {
                const errorAction = baseActionCreators.updateError(response, point);
                dispatch(errorAction)
            }).catch(function (err) {
                console.error(err.toString());
            });

            return promise;
        }
    }
};