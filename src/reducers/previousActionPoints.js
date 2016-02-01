import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

const basePreviousActionPointsReducers = reduxCrud.reducersFor('previous_action_points');

export default function (state = SI([]), action) {
    switch (action.type) {
        case 'PREVIOUS_ACTION_POINTS_FETCH_SUCCESS':
            return basePreviousActionPointsReducers(SI([]), action);
        case 'PREVIOUS_ACTION_POINTS_FETCH_ERROR':
            return basePreviousActionPointsReducers(SI([]), action);
        default:
            return basePreviousActionPointsReducers(state, action);
    }
}