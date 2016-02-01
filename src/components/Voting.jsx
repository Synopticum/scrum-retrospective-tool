import React from 'react';
import actions from '../actions';

const PT = React.PropTypes;

class Comp extends React.Component {

    constructor (props, ctx) {
        super(props, ctx);
        this.state = this.getCleanState(props);
    }

    componentWillReceiveProps (nextProps) {
        this.setState(this.getCleanState(nextProps));
    }

    getCleanState (props) {
        return {
            text: '',
            isGood: true
        }
    }

    // need to refactor in the future
    isVoting () {
        return this.props.appState.isVoting[0] && this.props.appState.isVoting[0].isVoting;
    }

    toggleVoting () {
        const action = actions.toggleVoting(this.isVoting());
        const dispatch = this.props.dispatch;
        dispatch(action);
    }

    render () {
        return (
            <div className='button to-right form__button' onClick={this.toggleVoting.bind(this)}>
                {this.isVoting() ? 'Finish Retro' : 'Start Voting'}
            </div>
        )
    }
}

Comp.propTypes = {
    dispatch: PT.func.isRequired
};

export default Comp;
