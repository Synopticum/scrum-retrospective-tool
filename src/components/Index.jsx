import React from 'react';
import { connect } from 'react-redux';
import actions from '../actions';
import New from './New.jsx';
import List from './List.jsx';
import SelectSprint from './SelectSprint.jsx';
import SelectUser from './SelectUser.jsx';

const PT = React.PropTypes;

class Comp extends React.Component {
    componentDidMount () {
        this.getInitialData();
    }

    get dispatch () {
        return this.props.dispatch;
    }

    getInitialData () {
        const action = actions.getInitialData();
        this.dispatch(action);
    }

    render() {
        return (
            <div>
                <header className="header">
                    <div className="header__wrapper">
                        <img src="images/logo.png" alt=""/>
                        <SelectSprint { ...this.props }/>
                        <SelectUser { ...this.props } />
                    </div>
                </header>

                <section className="content">
                    <New { ...this.props } />
                    <List { ...this.props } />
                </section>
            </div>
        )
    }
}

Comp.propTypes = {
    dispatch: PT.func.isRequired
};

export default connect(state => state)(Comp);
