import _ from 'lodash';
import axios from 'axios';
import bows from 'bows';
import reduxCrud from 'redux-crud';
import cuid from 'cuid';
import io from 'socket.io-client';

import { socket } from './init';
const baseActionCreators = reduxCrud.actionCreatorsFor('available_users');

export default {
    fetchAvailableUsers () {
        return function (dispatch) {

            const action = baseActionCreators.fetchStart();
            dispatch(action);

            // send the request
            const url = '/available_users/';
            const promise = axios({
                url: url
            });

            promise
                .then(function (response) {
                    const returned = response.data;
                    const successAction = baseActionCreators.fetchSuccess(returned);
                    dispatch(successAction);

                    return response;
                }, function (response) {
                    const errorAction = baseActionCreators.fetchError(response);
                    dispatch(errorAction);
                })
                .catch(function (err) {
                    console.error(err.toString());
                });

            return promise;
        }
    }
};