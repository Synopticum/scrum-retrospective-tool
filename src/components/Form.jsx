import React from 'react';
import actions from '../actions';
import AddPoint from './AddPoint.jsx'
import Voting from './Voting.jsx'

const PT = React.PropTypes;

class Comp extends React.Component {

    constructor(props, ctx) {
        super(props, ctx);
    }

    createSprint () {
        const action = actions.createSprint();
        const dispatch = this.props.dispatch;
        dispatch(action);
    }

    changeActiveSprint () {
        const action = actions.changeActiveSprint();
        const dispatch = this.props.dispatch;
        dispatch(action);
    }

    render() {
        return (
            <section className="form">
                <form>
                    {this.props.appState.isSprintActive && this.props.appState.isLogged ? <AddPoint {...this.props}/> : ''}
                    {this.props.appState.isSprintActive && this.props.appState.isScrumMaster ? <Voting {...this.props}/> : ''}
                    {!this.props.appState.isSprintActive && this.props.appState.isScrumMaster ? <div className='button to-right form__button' onClick={this.changeActiveSprint.bind(this)}>Set Sprint as active</div> : ''}
                    {this.props.appState.isSprintLatest && this.props.appState.isScrumMaster ? <div className='button to-right form__button' onClick={this.createSprint.bind(this)}>Create New Sprint</div> : ''}
                </form>
            </section>
        )
    }
}

Comp.propTypes = {
    dispatch: PT.func.isRequired,
    onCommit: PT.func.isRequired,
    isSprintActive: PT.bool.isRequired,
    isSprintLatest: PT.bool.isRequired,
    point: PT.object.isRequired
};

export default Comp;
