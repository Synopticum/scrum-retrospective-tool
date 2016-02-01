/* @flow */
import _ from 'lodash';

import sprintsActionCreators from './actions/sprints';
import pointsActionCreators from './actions/points';
import actionPointsActionCreators from './actions/actionPoints';
import previousActionPointsActionCreators from './actions/previousActionPoints';
import availableUsersActionCreators from './actions/availableUsers';
import votingActionCreators from './actions/voting';
import initActionCreators from './actions/init';

let actionCreators = {};

actionCreators = _.extend(
    sprintsActionCreators,
    pointsActionCreators,
    actionPointsActionCreators,
    previousActionPointsActionCreators,
    votingActionCreators,
    availableUsersActionCreators,
    initActionCreators
);

export default actionCreators;
