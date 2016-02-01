import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

export default function (state = SI(false), action) {
    switch (action.type) {
        case 'CHECK_IS_SPRINT_ACTIVE':
            state = action.sprints.some((sprint) => {
                return sprint.active && sprint.id === action.selectedSprintId;
            });

            return state;
        default:
            return state;
    }
}