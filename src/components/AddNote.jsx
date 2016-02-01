import React from 'react';
import SI from 'seamless-immutable';
import actions from '../actions';

const PT = React.PropTypes;

class Comp extends React.Component {
    constructor (props, ctx) {
        super(props, ctx);
        this.state = this.getCleanState();
    }

    getCleanState () {
        return SI({
            value: ''
        })
    }

    get dispatch () {
        return this.props.dispatch
    }

    textChanged (event) {
        const { value } = event.target;
        this.setState({ value })
    }

    preventEnterKeyPress (event) {
        if (event.nativeEvent.keyCode === 13) {
            event.preventDefault();
        }
    }

    addNote (point) {
        const sprintId = this.props.appState.selectedSprintId;

        // if field is no empty
        if (this.state.value) {
            const action = actions.updateActionPoint(point, sprintId, this.state.value);
            const dispatch = this.props.dispatch;
            dispatch(action);
            this.setState(this.getCleanState());
        } else {
            console.log('Please Enter Note');
        }
    }

    render () {
        return (
            <div className="point__notes__nav">
                <input type="text" value={this.state.value} onKeyPress={this.preventEnterKeyPress.bind(this)} onChange={this.textChanged.bind(this)} className="textbox point__notes__nav__textbox" />
                <div onClick={this.addNote.bind(this, this.props.point)} className='button point__notes__nav__button'>Add Note</div>
            </div>
        )
    }
}

Comp.propTypes = {
    //selectedSprintId: PT.number.isRequired,
    dispatch: PT.func.isRequired
};

export default Comp;
