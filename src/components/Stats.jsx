import React from 'react';
import actions from '../actions';

class Comp extends React.Component {
    constructor (props, ctx) {
        super(props, ctx);
    }

    get dispatch() {
        return this.props.dispatch
    }

    render () {
        return (
            <ul className="stats">
                {_.map(this.props.appState.votingStats, (vote, index) => {
                    return <li className={localStorage.getItem('loggedAs') === index ? "stats__item stats__item--current-user" : "stats__item"} key={index}>
                        <div className="stats__item__count">{vote}</div>
                        <div className="stats__item__user">{index}</div>
                    </li>
                })}
            </ul>
        )
    }
}

export default Comp;
