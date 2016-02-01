import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

const baseUserReducers = reduxCrud.reducersFor('user');

export default function (state = localStorage.getItem('loggedAs'), action) {
    switch (action.type) {
        case 'CHANGE_ACTIVE_USER':
            localStorage.setItem('loggedAs', action.selectedUser);
            return baseUserReducers(SI(action.selectedUser), action);
        default:
            return baseUserReducers(state, action);
    }
}