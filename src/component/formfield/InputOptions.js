import React from 'react';
import PropTypes from 'prop-types';

class InputOptions extends React.Component {
    
    onValueChange = (event)=>{
        const { onValueChange, id } = this.props;
        onValueChange({id, value: event.target.value })
    }

    getInputOptionsJSX = () => {
        const { fieldName, id, fieldOptions, fieldValue } = this.props;
        return (
            <div className="item-field-container">
                <label key={`label_for_${id}`}>{fieldName}</label>
                <select key={`input_for_${id}`} id={id} value={fieldValue} onChange={this.onValueChange}>
                    {
                        fieldOptions.map( (optionItem) => {
                            const { optionName, optionValue } = optionItem;
                            return (<option value={optionValue}>{optionName}</option>)
                        })
                    }
                </select>
            </div>
        );
    }

    render() {
        return (this.getInputOptionsJSX());
    }
}
InputOptions.defaultProps = {
    id: '',
    fieldValue: '',
    onValueChange: () => {},
    fieldName: '',
    fieldOptions: [],
};
InputOptions.propsType = {
    id: PropTypes.string,
    fieldValue: PropTypes.oneOfType([
        PropTypes.string, PropTypes.number ]),
    onValueChange: PropTypes.func,
    fieldName: PropTypes.string,
    fieldOptions: PropTypes.arrayOf(PropTypes.shape({
        optionName: PropTypes.string,
        optionValue: PropTypes.number
    }))
}
export default InputOptions;
