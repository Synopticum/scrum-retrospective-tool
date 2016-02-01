import _ from 'lodash';
import axios from 'axios';
import bows from 'bows';
import reduxCrud from 'redux-crud';
import cuid from 'cuid';
import io from 'socket.io-client';

import { socket } from './init';
import pointsActionCreators from './points';

const baseActionCreators = reduxCrud.actionCreatorsFor('sprints');

export default {
    _setActiveSprint (sprintId) {
        return function (dispatch) {
            const action = {
                type: 'SET_ACTIVE_SPRINT',
                sprintId
            };

            dispatch(action);
        }
    },

    _setSelectedSprint (sprintId) {
        return function (dispatch, getState) {
            const action = {
                type: 'SET_SELECTED_SPRINT',
                sprintId
            };

            dispatch(action);
        }
    },

    _checkIsSprintActive () {
        return function (dispatch, getState) {
            const state = getState();
            const action = {
                type: 'CHECK_IS_SPRINT_ACTIVE',
                sprints: state.appData.sprints,
                selectedSprintId: state.appState.selectedSprintId
            };
            dispatch(action);
        }
    },

    _checkIsSprintLatest () {
        return function (dispatch, getState) {
            const state = getState();
            const action = {
                type: 'CHECK_IS_SPRINT_LATEST',
                sprints: state.appData.sprints,
                selectedSprintId: state.appState.selectedSprintId
            };
            console.log(action);
            dispatch(action);
        }
    },

    changeActiveSprint () {
        var that = this;

        return function (dispatch, getState) {
            const state = getState();

            const promise1 = that.changeSprintActivity(dispatch, state.appState.activeSprintId, false);
            const promise2 = that.changeSprintActivity(dispatch, state.appState.selectedSprintId, true);

            return axios.all([promise1, promise2])
                .then(function () {
                    const setActiveAction = that._setActiveSprint(state.appState.selectedSprintId);
                    dispatch(setActiveAction);

                    const checkIsSprintActiveAction = that._checkIsSprintActive();
                    dispatch(checkIsSprintActiveAction);

                    const checkIsSprintLatestAction = that._checkIsSprintLatest();
                    dispatch(checkIsSprintLatestAction);

                    socket.emit('client:active-sprint-changed', state.appState.selectedSprintId);
                });
        }
    },

    changeSprintActivity (dispatch, sprintId, isActive) {
        const data = {id: sprintId, active: isActive};

        const promise = axios({
            url: `/sprints/${sprintId}`,
            method: 'PATCH',
            data
        });

        const optimisticAction1 = baseActionCreators.updateStart(data);
        dispatch(optimisticAction1);

        promise
            .then(function (response) {
                const returned = response.data;
                const successAction = baseActionCreators.updateSuccess(returned);
                dispatch(successAction);
            }, function (response) {
                const errorAction = baseActionCreators.updateError(response, data);
                dispatch(errorAction);
            })
            .catch(function (err) {
                console.error(err.toString());
            });

        return promise;
    },

    createSprint () {
        var that = this;

        return function (dispatch, getState) {
            const state = getState();
            const id = getNewSprintId();
            const sprint = { id, active: false };

            function getNewSprintId () {
                let maxId = _.max(_.map(state.appData.sprints, (sprint) => {
                    return sprint.id;
                }));

                maxId++;

                return maxId;
            }

            const optimisticAction = baseActionCreators.createStart(sprint);
            dispatch(optimisticAction);

            const url = '/sprints';
            const promise = axios({
                url: url,
                method: 'POST',
                data: sprint
            });

            promise
                .then(function (response) {
                    // dispatch the success action
                    const returned = response.data;
                    const successAction = baseActionCreators.createSuccess(returned, sprint);
                    dispatch(successAction);

                    const checkIsSprintLatestAction = that._checkIsSprintLatest();
                    dispatch(checkIsSprintLatestAction);
                }, function (response) {
                    // rejection
                    // dispatch the error action
                    const errorAction = baseActionCreators.createError(response, sprint);
                    dispatch(errorAction);
                })
                .catch(function (err) {
                    console.error(err.toString())
                });

            return promise;
        }
    },

    fetchSprints () {
        var that = this;

        return function (dispatch) {
            const action = baseActionCreators.fetchStart();
            dispatch(action);

            // send the request
            const url = '/sprints/';
            const promise = axios({
                url: url
            });

            promise
                .then(function (response) {
                    // dispatch the success action
                    const returned = response.data;
                    const successAction = baseActionCreators.fetchSuccess(returned);
                    dispatch(successAction);

                    return response;
                }, function (response) {
                    const errorAction = baseActionCreators.fetchError(response);
                    dispatch(errorAction);
                })
                .then(function (response) {
                    // set active and selected sprint
                    const activeSprintId = response.data.filter((sprint) => {
                        return sprint.active === true
                    })[0].id;

                    const setActiveAction = that._setActiveSprint(activeSprintId);
                    dispatch(setActiveAction);

                    return activeSprintId;
                }, function (e) {
                    console.error(e);
                })
                .then(function (activeSprintId) {
                    // fetch a points of selected sprint
                    const action = pointsActionCreators.fetchSprint(activeSprintId);
                    dispatch(action);
                }, function (e) {
                    console.error(e);
                })
                .catch(function (err) {
                    console.error(err.toString());
                });

            return promise;
        }
    }
};