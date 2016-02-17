import React from 'react';
import { connect } from 'react-redux';
import actions from '../actions';
import AddNote from './AddNote.jsx';

const PT = React.PropTypes;

class Comp extends React.Component {

    get dispatch() {
        return this.props.dispatch
    }

    deletePoint (point, sprintId, event) {
        event.preventDefault();
        const action = actions.deletePoint(point, sprintId);
        this.dispatch(action);
    }

    setActionPoint (point) {
        const sprintId = this.props.appState.selectedSprintId;
        const action = actions.createActionPoint(point, sprintId);
        this.dispatch(action);
    }

    removeActionPoint (point) {
        const sprintId = this.props.appState.selectedSprintId;
        const deleteAction = actions.deleteActionPoint(point, sprintId);
        this.dispatch(deleteAction);
    }

    removeNote (note, point, sprintId) {
        const action = actions.removeNote(note, point, sprintId);
        this.dispatch(action);
    }

    votePoint (point, sprintId) {
        const action = actions.votePoint(point, sprintId);
        this.dispatch(action);
    }

    undoVotePoint (point, sprintId) {
        const action = actions.undoVotePoint(point, sprintId);
        this.dispatch(action);
    }

    // need to refactor in the future
    isVoting () {
        return this.props.appState.isVoting[0] && this.props.appState.isVoting[0].isVoting;
    }

    renderCheck (point) {
        const sprintId = this.props.appState.selectedSprintId;
        const userCanRemovePoints = this.props.appState.isScrumMaster || (this.props.appState.isSprintActive && point.name === localStorage.getItem('loggedAs'));
        const alreadyVoted = _.contains(point.votes, localStorage.getItem('loggedAs'));

        return (
            <div>
                {alreadyVoted && !point.isGood && this.props.appState.isSprintActive && this.isVoting() && this.props.appState.isLogged ? <span className='link voting-undo-vote' onClick={this.undoVotePoint.bind(this, point, sprintId)}>Undo vote</span> : ''}
                {!alreadyVoted && !point.isGood && this.props.appState.isSprintActive && this.isVoting() && this.props.appState.isLogged ? <span className='link voting-vote' onClick={this.votePoint.bind(this, point, sprintId)}>Vote</span> : ''}

                {userCanRemovePoints && this.props.appState.isSprintActive ? <span className='link' onClick={this.deletePoint.bind(this, point, sprintId)}>Remove Point</span> : ''}
                {!point.isGood && this.props.appState.isSprintActive && this.isVoting() && this.props.appState.isScrumMaster ?
                    <span className='link to-right' onClick={this.setActionPoint.bind(this, point, sprintId)}>Set as Action Point</span> : ''}

                {!point.isGood && !_.isEmpty(point.votes) && this.props.appState.isSprintActive && this.isVoting() ? <ul className='voting-counter'>{_.map(point.votes, (name) => { return <li key={name} className="voting-counter__li">{name}</li> } )}</ul> : ''}
            </div>
        );
    }

    renderPoints (value) {
        return _.map(this.props.appData.points, (point) => {
            if (point.isGood === value) {
                return (
                    <li className="point" key={point.id}>
                        <div className="point__text">{ point.text }</div>
                        <div className="point__name">by { point.name }</div>
                        <div className="point__nav">{ this.renderCheck(point) }</div>
                    </li>
                )
            } else {
                return '';
            }
        })
    }

    renderActionPoints () {
        const sprintId = this.props.appState.selectedSprintId;

        return _.map(this.props.appData.actionPoints, (point) => {
            return (
                <li className="point" key={point.id}>
                    <div className="point__text">{ point.text }</div>
                    <div className="point__name">by { point.name }</div>
                    <div className="point__notes">
                        <ul className="point__notes__list">
                            {_.map(point.notes, (note, index) => {
                                return <li className="point__notes__list__item" key={index}>
                                    {note}
                                    {this.props.appState.isSprintActive && this.isVoting() && this.props.appState.isScrumMaster ? <span className="link remove-note" onClick={this.removeNote.bind(this, note, point, sprintId)}>Remove Note</span> : ''}
                                </li>
                            })}
                        </ul>

                        {this.props.appState.isSprintActive && this.isVoting() && this.props.appState.isScrumMaster ? <AddNote {...this.props} point={point}/> : ''}
                    </div>
                    <div className="point__nav">
                        {this.props.appState.isSprintActive && this.isVoting() && this.props.appState.isScrumMaster ?
                            <span onClick={this.removeActionPoint.bind(this, point)} className='link'>Remove Action Point</span> : ''}
                    </div>
                </li>
            )
        })
    }

    renderPreviousActionPoints () {
        const sprintId = this.props.appState.selectedSprintId;

        return _.map(this.props.appData.previousActionPoints, (point) => {
            return (
                <li className="point" key={point.id}>
                    <div className="point__text">{ point.text }</div>
                    <div className="point__name">by { point.name }</div>
                    <div className="point__notes">
                        <ul className="point__notes__list">
                            {_.map(point.notes, (note, index) => {
                                return <li className="point__notes__list__item" key={index}>{note}</li>
                            })}
                        </ul>
                    </div>
                    <div className="point__nav">
                        {!point.isGood && this.props.appState.isSprintActive && this.isVoting() && this.props.appState.isScrumMaster ?
                            <span className='link to-right' onClick={this.setActionPoint.bind(this, point, sprintId)}>Set as Action Point Again</span> : ''}
                    </div>
                </li>
            )
        })
    }

    render () {
        return (
            <div>
                <section className="points">
                    <div className="points__column points__column--good">
                        <h2 className="points__column__h">Good Points:</h2>

                        <ul>
                            {_.isEmpty(this.props.appData.points) ? <li className="point point--none">There are no points yet</li> : this.renderPoints(true)}
                        </ul>
                    </div>

                    <div className="points__column points__column--improve">
                        <h2 className="points__column__h">Points to Improve:</h2>

                        <ul>
                            {_.isEmpty(this.props.appData.points) ? <li className="point point--none">There are no points yet</li> : this.renderPoints(false)}
                        </ul>
                    </div>
                </section>

                <section className="points">
                    <div className="points__column points__column--previous">
                        <h2 className="points__column__h">Previous Sprint Action Points:</h2>

                        <ul>
                            {_.isEmpty(this.props.appData.previousActionPoints) ? <li className="point point--none">There are no previous action points yet</li> : this.renderPreviousActionPoints()}
                        </ul>
                    </div>

                    <div className="points__column points__column--action-points">
                        <h2 className="points__column__h">This Sprint Action Points:</h2>

                        <ul>
                            {_.isEmpty(this.props.appData.actionPoints) ? <li className="point point--none">There are no action points yet</li> : this.renderActionPoints()}
                        </ul>
                    </div>
                </section>
            </div>
        )
    }
}

Comp.propTypes = {
    sprints: PT.array.isRequired,
    points: PT.array.isRequired,
    actionPoints: PT.array.isRequired,
    previousActionPoints: PT.array.isRequired,
    dispatch: PT.func.isRequired
};

export default Comp;
