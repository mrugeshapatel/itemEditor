import React from 'react';
import PropTypes from 'prop-types';

class InputToggle extends React.Component {
    onValueChange = (event)=>{
        const { onValueChange, id } = this.props;
        onValueChange({id, value: event.target.checked });
    }

    getInputToggleJSX = () => {
        const { fieldName, id, fieldValue } = this.props;
        return (
            <div className="item-field-container" type="checkbox">
                <input key={`input_for_${id}`} id={id} checked={fieldValue} onChange={this.onValueChange} type="checkbox"/>
                <label key={`label_for_${id}`}>{fieldName}</label>
            </div>
        );
    }

    render() {
        return (this.getInputToggleJSX());
    }
}
InputToggle.defaultProps = {
    id: '',
    fieldValue: true,
    onValueChange: () => {},
    fieldName: '',
};
InputToggle.propsType = {
    id: PropTypes.string,
    fieldValue: PropTypes.bool,
    onValueChange: PropTypes.func,
    fieldName: PropTypes.string,
}
export default InputToggle;