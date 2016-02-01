import _ from 'lodash';
import axios from 'axios';
import bows from 'bows';
import reduxCrud from 'redux-crud';
import cuid from 'cuid';
import io from 'socket.io-client';

import { socket } from './init';
const baseActionCreators = reduxCrud.actionCreatorsFor('previous_action_points');

export default {
    fetchPreviousActionPoints (sprintId) {
        sprintId--;

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
                .catch(function (err) {
                    console.error(err.toString());
                });

            function errorHandler (response) {
                const errorAction = baseActionCreators.fetchError(response);
                dispatch(errorAction);
            }

            return promise;
        }
    }
};