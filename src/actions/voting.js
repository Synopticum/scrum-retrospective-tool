import _ from 'lodash';
import axios from 'axios';
import bows from 'bows';
import reduxCrud from 'redux-crud';
import cuid from 'cuid';
import io from 'socket.io-client';

import { socket } from './init';
const baseActionCreators = reduxCrud.actionCreatorsFor('isVoting');

export default {
    fetchVoting () {
        return function (dispatch, getState) {
            const { isVoting } = getState();
            const action = baseActionCreators.fetchStart();
            dispatch(action);

            // send the request
            const url = `/isVoting/1`;
            const promise = axios({
                url: url
            });

            promise
                .then(function (response) {
                    const returned = response.data;

                    const successAction = baseActionCreators.fetchSuccess(returned);
                    dispatch(successAction);
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

    toggleVoting (isVoting) {
        return function (dispatch, getState) {
            const data = {
                id: 1,
                isVoting: !isVoting
            };

            const optimisticAction = baseActionCreators.updateStart(data);
            dispatch(optimisticAction);

            const url = `/isVoting/1`;
            const promise = axios({
                url: url,
                method: 'PATCH',
                data: data
            });

            promise.then(function (response) {
                // dispatch the success action
                const returned = response.data;
                const successAction = baseActionCreators.updateSuccess(returned);
                dispatch(successAction);

                socket.emit('client:toggled-voting', !isVoting);
            }, function (response) {
                // rejection
                // dispatch the error action
                const errorAction = baseActionCreators.updateError(response, data);
                dispatch(errorAction)
            }).catch(function (err) {
                console.error(err.toString());
            });

            return promise;
        }
    }
};