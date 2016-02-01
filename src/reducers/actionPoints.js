import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

const baseActionPointsReducers = reduxCrud.reducersFor('action_points');

export default function (state = SI([]), action) {
    switch (action.type) {
        case 'ACTION_POINTS_FETCH_SUCCESS':
            return baseActionPointsReducers(SI([]), action);
        case 'ACTION_POINTS_FETCH_ERROR':
            return baseActionPointsReducers(SI([]), action);
        case 'ACTION_POINT_CREATE':
            return baseActionPointsReducers(SI([...state, action.point]), action);
        case 'ACTION_POINT_DELETE':
            state = state.filter((point) => {
                if (point.id !== action.point.id) {
                    return point;
                }
            });

            return baseActionPointsReducers(state, action);
        case 'ACTION_POINT_UPDATE':
            state = SI(_.map(state, (point) => {
                if (point.id === action.data.id) {
                    return action.data;
                }

                return point;
            }));
            return baseActionPointsReducers(state, action);
        default:
            return baseActionPointsReducers(state, action);
    }
}