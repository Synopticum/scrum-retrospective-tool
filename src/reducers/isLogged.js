import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

export default function (state = SI(localStorage.getItem('loggedAs')), action) {
    switch (action.type) {
        case 'SET_IS_LOGGED':
            return true;
        default:
            return Boolean(state);
    }
}