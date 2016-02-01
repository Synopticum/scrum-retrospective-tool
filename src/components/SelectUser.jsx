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

    onChangeUser (event) {
        event.preventDefault();
        const selectedUser = event.target.value;
        const action = actions.changeActiveUser(selectedUser);
        this.dispatch(action);
    }

    render () {
        return (
            <div className="select-user">
                <select value={this.props.appState.isLogged ? localStorage.getItem('loggedAs') : -1} className="select-user__select" onChange={this.onChangeUser.bind(this)}>
                    {this.props.appState.isLogged ? '' : <option value="-1" disabled>Select your name</option>}

                    {_.map(this.props.appData.availableUsers, (user) => {
                        return <option value={user.name} key={user.name}>{user.name}</option>;
                    })}
                </select>
            </div>
        )
    }
}

Comp.propTypes = {
    dispatch: PT.func.isRequired
};

export default Comp;
