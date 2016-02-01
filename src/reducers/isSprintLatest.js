import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

export default function (state = SI(false), action) {
    switch (action.type) {
        case 'CHECK_IS_SPRINT_LATEST':
            state = (action.selectedSprintId === _.max(_.map(action.sprints, (sprint) => { return sprint.id; })));

            return state;
        default:
            return state;
    }
}