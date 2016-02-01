import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

const basePointsReducers = reduxCrud.reducersFor('points');

export default function (state = SI([]), action) {
    switch (action.type) {
        case 'POINTS_FETCH_SUCCESS':
            return basePointsReducers(SI([]), action);
        case 'POINTS_FETCH_ERROR':
            return basePointsReducers(SI([]), action);
        case 'POINT_CREATE':
            return basePointsReducers(SI([...state, action.point]), action);
        case 'POINT_DELETE':
            state = state.filter((point) => {
                if (point.id !== action.point.id) {
                    return point;
                }
            });

            return basePointsReducers(state, action);
        case 'POINT_VOTED':
            state = SI(_.map(state, (point) => {
                if (point.id === action.point.id) {
                    return point.merge(action.point);
                }

                return point;
            }));

            return basePointsReducers(state, action);
        default:
            return basePointsReducers(state, action);
    }
}