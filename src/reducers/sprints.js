import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

const baseSprintReducers = reduxCrud.reducersFor('sprints');

export default function (state = SI([]), action) {
    switch (action.type) {
        default:
            return baseSprintReducers(state, action);
    }
}