import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

export default function (state = SI(false), action) {
    switch (action.type) {
        case 'CHECK_IS_SCRUM_MASTER':
            state = localStorage.getItem('loggedAs') === 'Bill Gates';
            return state;
        default:
            return state;
    }
}