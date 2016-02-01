import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

const baseAvailableUsersReducers = reduxCrud.reducersFor('available_users');

export default function (state = SI([]), action) {
    switch (action.type) {
        default:
            return baseAvailableUsersReducers(state, action);
    }
}