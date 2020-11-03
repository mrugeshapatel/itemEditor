import React from 'react';
import PropTypes from 'prop-types';

class InputText extends React.Component {
    onValueChange = (event)=>{
        const { onValueChange, id } = this.props;
        onValueChange({id, value: event.target.value});
    }

    getInputTextJSX = () => {
        const { fieldName, id, fieldValue } = this.props;
        return (
            <div className="item-field-container">
                <label key={`label_for_${id}`}>{fieldName}</label>
                <input key={`input_for_${id}`} id={id} onChange={this.onValueChange} value={fieldValue} type="text"/>
            </div>
        );
    }

    render() {
        return (this.getInputTextJSX());
    }
}
InputText.defaultProps = {
    id: '',
    fieldValue: '',
    onValueChange: () => {},
    fieldName: '',
};
InputText.propsType = {
    id: PropTypes.string,
    fieldValue: PropTypes.oneOfType([
        PropTypes.string, PropTypes.number ]),
    onValueChange: PropTypes.func,
    fieldName: PropTypes.string,
}
export default InputText;
