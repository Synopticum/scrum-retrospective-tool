import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

export default function (state = SI({}), action) {
    switch (action.type) {
        case 'VOTING_STAT_UPDATED':
            return action.state;
        default:
            return state;
    }
}