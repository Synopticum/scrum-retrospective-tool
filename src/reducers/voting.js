import SI from 'seamless-immutable';
import reduxCrud from 'redux-crud';
import bows from 'bows';

const baseVotingReducers = reduxCrud.reducersFor('isVoting');

export default function (state = SI(false), action) {
    switch (action.type) {
        case 'TOGGLE_VOTING':
            return baseVotingReducers(SI([{ id: 1, isVoting: action.isVoting }]), action);
        default:
            return baseVotingReducers(state, action);
    }
}