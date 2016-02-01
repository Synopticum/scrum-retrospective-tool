import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

const baseActiveSprintReducers = reduxCrud.reducersFor('active_sprint');

export default function (state = SI(-1), action) {
    switch (action.type) {
        case 'SET_ACTIVE_SPRINT':
            return baseActiveSprintReducers(SI(action.sprintId), action);
        default:
            return baseActiveSprintReducers(state, action);
    }
}