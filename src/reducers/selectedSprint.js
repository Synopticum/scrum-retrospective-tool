import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

export default function (state = SI(-1), action) {
    switch (action.type) {
        case 'SET_SELECTED_SPRINT':
            return SI(action.sprintId);
        default:
            return state;
    }
}