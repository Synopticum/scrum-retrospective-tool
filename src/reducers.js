import sprintsReducer from './reducers/sprints';
import pointsReducer from './reducers/points';
import actionPointsReducer from './reducers/actionPoints';
import previousActionPointsReducer from './reducers/previousActionPoints';
import activeSprintReducer from './reducers/activeSprint';
import selectedSprintReducer from './reducers/selectedSprint';
import votingReducer from './reducers/voting';
import availableUsersReducer from './reducers/availableUsers';
import loggedAsReducer from './reducers/loggedAs';
import isLoggedReducer from './reducers/isLogged';
import isScrumMasterReducer from './reducers/isScrumMaster';
import isSprintActiveReducer from './reducers/isSprintActive';
import isSprintLatestReducer from './reducers/isSprintLatest';

export default {
    sprintsReducer,
    pointsReducer,
    actionPointsReducer,
    previousActionPointsReducer,
    activeSprintReducer,
    selectedSprintReducer,
    votingReducer,
    availableUsersReducer,
    loggedAsReducer,
    isLoggedReducer,
    isScrumMasterReducer,
    isSprintActiveReducer,
    isSprintLatestReducer
};
