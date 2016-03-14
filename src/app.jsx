import bows                              from 'bows'
import React                             from 'react'
import thunkMiddleware                   from 'redux-thunk'
import loggerMiddleware                  from 'redux-logger'
import { compose }                       from 'redux'
import { applyMiddleware }               from 'redux'
import { combineReducers }               from 'redux'
import { createStore }                   from 'redux'
import { Provider }                      from 'react-redux'
import reduxCrud                         from 'redux-crud'
import reducers                          from './reducers'
import Index                             from './components/Index.jsx'

const log = bows('app');

const finalCreateStore = compose(
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
)(createStore);

const allReducers = combineReducers({
    appData: combineReducers({
        sprints:              reducers.sprintsReducer,
        points:               reducers.pointsReducer,
        actionPoints:         reducers.actionPointsReducer,
        previousActionPoints: reducers.previousActionPointsReducer,
        availableUsers:       reducers.availableUsersReducer
    }),
    appState: combineReducers({
        loggedAs:             reducers.loggedAsReducer,
        selectedSprintId:     reducers.selectedSprintReducer,
        activeSprintId:       reducers.activeSprintReducer,
        isVoting:             reducers.votingReducer,
        isLogged:             reducers.isLoggedReducer,
        isScrumMaster:        reducers.isScrumMasterReducer,
        isSprintActive:       reducers.isSprintActiveReducer,
        isSprintLatest:       reducers.isSprintLatestReducer,
        votingStats:          reducers.votingStatsReducer
    })
});

const store = finalCreateStore(allReducers);

class AppComponent extends React.Component {
    render () {
        return (
            <section className='container clearfix'>
                <Index />
            </section>
        )
    }
}

const mountNode = document.getElementById('app');
React.render(
    <div>
        <Provider store={store}>
            {() => <AppComponent /> }
        </Provider>
    </div>,
    mountNode
);
