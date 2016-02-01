import React from 'react';
import SI from 'seamless-immutable';
import actions from '../actions';
import Form from './Form.jsx';

const PT = React.PropTypes;

class Comp extends React.Component {

    constructor (props, ctx) {
        super(props, ctx);
        this.state = this.getCleanState();
    }

    getCleanState () {
        return {
            point: SI({
                sprintId: this.props.appState.activeSprintId,
                name: 'Default Name',
                text: '',
                isGood: true,
                notes: [],
                votes: 0
            })
        }
    }

    onCommit (point) {
        const sprintId = this.props.appState.selectedSprintId;
        const action = actions.createPoint(point, sprintId);
        const dispatch = this.props.dispatch;
        dispatch(action);
        this.setState(this.getCleanState());
    }

    render () {
        return (
            <section>
                <Form { ...this.props } point={ this.state.point } onCommit={this.onCommit.bind(this)}/>
            </section>
        )
    }
}

Comp.propTypes = {
    dispatch: PT.func.isRequired
};

export default Comp;
