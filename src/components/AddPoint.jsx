import React from 'react';
import actions from '../actions';

const PT = React.PropTypes;

class Comp extends React.Component {

    constructor(props, ctx) {
        super(props, ctx);
        this.state = this.getCleanState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getCleanState(nextProps));
    }

    getCleanState (props) {
        return {
            text: '',
            isGood: true
        }
    }

    textChanged (event) {
        const { value } = event.target;
        this.setState({
            text: value,
            name: localStorage.getItem('loggedAs')
        })
    }

    preventEnterKeyPress (event) {
        if (event.nativeEvent.keyCode === 13) {
            event.preventDefault();
        }
    }

    onStatusChanged (event) {
        const isGood = !!parseInt(event.target.value);
        this.setState({ isGood });
    }

    createPoint () {
        if (this.state.text) {
            let point = this.props.point;
            point = point.merge(this.state);

            this.props.onCommit(point);
        }
    }

    render() {
        return (
            <div className="to-left">
                <input type='text' value={this.state.text} onChange={this.textChanged.bind(this)} onKeyPress={this.preventEnterKeyPress.bind(this)} className='textbox'/>

                <div className="boolean-radio form__boolean-radio">
                    <input type="radio" name="radio-point" className="boolean-radio__input" id="r1" value="1" onChange={ this.onStatusChanged.bind(this) } checked={this.state.isGood ? 'checked' : ''} /> <label htmlFor="r1" className="boolean-radio__label">Good</label>
                    <input type="radio" name="radio-point" className="boolean-radio__input" id="r2" value="0" onChange={ this.onStatusChanged.bind(this) } checked={this.state.isGood ? '' : 'checked'} /> <label htmlFor="r2" className="boolean-radio__label">Not so good</label>
                </div>

                <div className='button form__button' onClick={this.createPoint.bind(this)}>Add Point</div>
            </div>
        )
    }
}

Comp.propTypes = {
    dispatch: PT.func.isRequired
};

export default Comp;
