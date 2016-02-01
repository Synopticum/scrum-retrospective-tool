import React from 'react';
import actions from '../actions';
import Form from './Form.jsx';

const PT = React.PropTypes;

class Comp extends React.Component {
    constructor (props, ctx) {
        super(props, ctx);
    }

    get dispatch() {
        return this.props.dispatch
    }

    onChangeSprint (event) {
        event.preventDefault();
        const sprintId = parseInt(event.target.value);
        const action = actions.fetchSprint(sprintId);
        this.dispatch(action);
    }

    render () {
        return (
            <div className="select-sprint">
                <select value={this.props.appState.selectedSprintId} onChange={this.onChangeSprint.bind(this)} className="select-sprint__select">
                    {_.map(this.props.appData.sprints, (sprint) => {
                        return <option value={sprint.id} key={sprint.id}>CMP-{sprint.id}{sprint.active ? ' (active)' : ''}</option>;
                    })}
                </select>
            </div>
        )
    }
}

Comp.propTypes = {
    selectedSprintId: PT.number.isRequired,
    activeSprintId: PT.number.isRequired,
    dispatch: PT.func.isRequired
};

export default Comp;
