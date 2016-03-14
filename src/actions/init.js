import _ from 'lodash';
import axios from 'axios';
import bows from 'bows';
import reduxCrud from 'redux-crud';
import cuid from 'cuid';
import io from 'socket.io-client';

import availableUsersActionCreators from './availableUsers';
import sprintsActionCreators from './sprints';

const socket = io('http://localhost:4003');

function broadcastData (dispatch, getState) {
    socket.on('server:active-sprint-changed', () => {
        const action = sprintsActionCreators.fetchSprints();
        dispatch(action);
    });

    socket.on('server:point-added', (point) => {
        const state = getState();

        if (point.sprintId === state.appState.selectedSprintId) {
            console.log('get2');
            const action = { type: 'POINT_CREATE', point };
            dispatch(action);
        }
    });

    socket.on('server:point-deleted', (point) => {
        const state = getState();

        if (point.sprintId === state.appState.selectedSprintId) {
            const action = { type: 'POINT_DELETE', point };
            dispatch(action);
        }
    });

    socket.on('server:toggled-voting', (isVoting) => {
        const action = { type: 'TOGGLE_VOTING', isVoting };
        dispatch(action);
    });

    socket.on('server:action-point-added', (point) => {
        const action = { type: 'ACTION_POINT_CREATE', point };
        dispatch(action);
    });

    socket.on('server:action-point-deleted', (point) => {
        const action = { type: 'ACTION_POINT_DELETE', point };
        dispatch(action);
    });

    socket.on('server:voted', (point) => {
        const action = { type: 'POINT_VOTED', point };
        dispatch(action);
    });

    socket.on('server:votes-count-updated', (votesCount) => {
        const action = { type: 'VOTES_COUNT_UPDATED', votesCount };
        dispatch(action);
    });

    socket.on('server:action-point-updated', (data) => {
        const action = { type: 'ACTION_POINT_UPDATE', data };
        dispatch(action);
    });

    socket.on('server:votes-stat-updated', (state) => {
        console.log(state);
        const action = { type: 'VOTING_STAT_UPDATED', state };
        dispatch(action);
    });

    socket.on('disconnect', function(){});
}

export default {
    socket,

    getInitialData () {
        return function (dispatch, getState) {
            const checkIsScrumMasterAction = { type: 'CHECK_IS_SCRUM_MASTER' };
            dispatch(checkIsScrumMasterAction);

            // get users list
            const fetchAvailableUsersAction = availableUsersActionCreators.fetchAvailableUsers();
            dispatch(fetchAvailableUsersAction);

            // get sprints list
            const fetchSprintsAction = sprintsActionCreators.fetchSprints();
            dispatch(fetchSprintsAction);

            // start broadcasting by WebSocket
            broadcastData(dispatch, getState);
        }
    },

    changeActiveUser (selectedUser) {
        return function (dispatch) {
            const changeActiveUserAction = { type: 'CHANGE_ACTIVE_USER', selectedUser };
            dispatch(changeActiveUserAction);

            const setIsLoggedAction = { type: 'SET_IS_LOGGED' };
            dispatch(setIsLoggedAction);

            const checkIsScrumMasterAction = { type: 'CHECK_IS_SCRUM_MASTER' };
            dispatch(checkIsScrumMasterAction);
        }
    }
};