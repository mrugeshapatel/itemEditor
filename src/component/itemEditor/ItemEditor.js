import React from 'react';
import PropTypes from 'prop-types';
import PanelHeader from '../header/PanelHeader';
import InputText from '../formfield/InputText';
import InputToggle from '../formfield/InputToggle';
import InputOptions from '../formfield/InputOptions';
import DeepCopy from '../utils/DataUtils';

class ItemEditor extends React.Component {
    constructor(props) {
        super(props);
        const { items } = props;
        this.state = {
            items: (items !== undefined)? DeepCopy(items) : [],
            selectedItemIndex: (items !== undefined && items.length > 0) ? 0 : -1,
            performedActions: [],
            revertedActions: [],
        };
        this.debouceID = {};
        this.appLevelOperationBtns = [
            <button type="button" id="undo" onClick={() => this.performAction('undo') }> Undo </button>,
            <button type="button" id="redo" onClick={() => this.performAction('redo') }>Redo</button>,
            <button type="button" id="save" onClick={() => this.performAction('save') }>Save</button>,
            <button type="button" id="cancel" onClick={() => this.performAction('cancel') } >Cancel</button>,
        ];
        
    }
    
    onActivePageRegister = (pageRef) => {
        this.activePage = pageRef;
    }
    
    performAction = (actionType) => {
        if(this.activePage === null || this.activePage === undefined) {
            return;
        }
        this.activePage.performAction(actionType);
    }

    performAction = (actionType) => {
        switch(actionType) {
            case "save":
                this.saveData();
                break;
            case "cancel":
                this.cancelData();
                break;
            case "redo":
                this.redo();
                break;
            case "undo":
                this.undo();
                break;
            default:
                break;
        }
    }

    saveData = () => {
        const { onSave } = this.props;
        const {items} = this.state;
        onSave(DeepCopy(items));
        this.setState({
            performedActions: [],
            revertedActions: [],
        });
    }

    cancelData = () => {
        const { items } = this.props;
        this.setState({
            items: DeepCopy(items),
            performedActions: [],
            revertedActions: [],
        });
    }

    saveAction = (actionObject) => {
        const { performedActions } = this.state;
        this.setState({
            performedActions: [...performedActions, actionObject],
            revertedActions: [],
        });
    }

    redo = () => {
        const { performedActions, revertedActions, items } = this.state;
        if(revertedActions.length > 0) {
            const dpRevertedActions = DeepCopy(revertedActions);
            const dpItems = DeepCopy(items);
            const lastItem = dpRevertedActions.pop();
            switch(lastItem.actionType){
                case 'itemSelectionChange':
                    this.setState(
                        {
                            performedActions: [...performedActions, lastItem],
                            revertedActions: dpRevertedActions,
                            selectedItemIndex: lastItem.newSelectedItemIndex,
                        }
                    );
                    break;
                case 'itemValueChange':
                    const { fields } = dpItems[lastItem.index] || [];
                    for(let i = fields.length-1; i>=0; i--){
                        if(fields[i].id === lastItem.fieldID) {
                            fields[i].fieldValue = lastItem.newValue;
                        }
                    }
                    dpItems[lastItem.index].fields = fields;
                    this.setState(
                        {
                            items: dpItems,
                            performedActions: [...performedActions, lastItem],
                            revertedActions: dpRevertedActions,
                        }
                    );
                    break;
                default:
                    break;
            }
        }
    }

    undo = () => {
        const { performedActions, revertedActions, items } = this.state;
        if(performedActions.length > 0) {
            const dpPerformedActions = DeepCopy(performedActions);
            const dpItems = DeepCopy(items);
            const lastItem = dpPerformedActions.pop();
            switch(lastItem.actionType){
                case 'itemSelectionChange':
                    this.setState(
                        {
                            performedActions: dpPerformedActions,
                            revertedActions: [...revertedActions, lastItem],
                            selectedItemIndex: lastItem.oldSelectedIndex,
                        }
                    );
                    break;
                case 'itemValueChange':
                    const { fields } = dpItems[lastItem.index] || [];
                    for(let i = fields.length-1; i>=0; i--){
                        if(fields[i].id === lastItem.fieldID) {
                            fields[i].fieldValue = lastItem.oldValue;
                        }
                    }
                    dpItems[lastItem.index].fields = fields;
                    this.setState(
                        {
                            items: dpItems,
                            performedActions: dpPerformedActions,
                            revertedActions: [...revertedActions, lastItem],
                        }
                    );
                default:
                    break;
            }
        }
    }

    onItemClick = ( index, id) => {
        const { selectedItemIndex, items, performedActions } = this.state;
        if(selectedItemIndex !== index) {
            const actionObject = {actionType: 'itemSelectionChange', oldSelectedIndex: selectedItemIndex,  newSelectedItemIndex: index};
            if(items[index].id === id){
                this.setState({
                    selectedItemIndex: index,
                    performedActions: [...performedActions, actionObject],
                    revertedActions: [],
                })
            }
        }
    }

    initDebiuneProcess = (bounceIDKey, actionObj) => {
        let oldValue = null;
        if(this.debouceID[bounceIDKey] !== null && this.debouceID[bounceIDKey] !== undefined){
            clearTimeout(this.debouceID[bounceIDKey].timerID);
            oldValue = this.debouceID[bounceIDKey].actionObj.oldValue;
            this.debouceID[bounceIDKey].actionObj = {...actionObj, oldValue};
        } else {
            this.debouceID[bounceIDKey] = {};
            this.debouceID[bounceIDKey].actionObj = {...actionObj};
        }
        this.debouceID[bounceIDKey].timerID = setTimeout(()=>{
            const finalActionObj = this.debouceID[bounceIDKey].actionObj;
            this.saveAction(finalActionObj);
            delete this.debouceID[bounceIDKey];
        }, 500);
    }

    onValueChange = (newValue) => {
        const { selectedItemIndex, items } = this.state;
        const itemForUpdate = DeepCopy(items);
        const { id, value } = newValue;
        const {fields} = itemForUpdate[selectedItemIndex];
        let needToUpdateState = false;
        for(let i = fields.length-1; i>=0;i--){
            if(fields[i].id === id) {
                const oldValue = fields[i].fieldValue;
                fields[i].fieldValue = value;
                needToUpdateState = true;
                const boundID = `value_${selectedItemIndex}_${id}`;
                this.initDebiuneProcess(boundID,
                {
                    actionType: 'itemValueChange',
                    index: selectedItemIndex,
                    fieldID: id,
                    oldValue: oldValue,
                    newValue: value, boundID
                });
                break;
            }
        }

        if(needToUpdateState) {
            itemForUpdate[selectedItemIndex].fields = fields;
            this.setState({
                items: itemForUpdate,
            })
        }
    }

    getSelectedItemFieldsJSX = (fields) => {
        if(fields === null || fields === undefined) {
            <section className="field-content"></section>
        }

        const filedJSX = fields.map( (fieldItem, index) => { 
            const { fieldType } = fieldItem;
            switch(fieldType) {
                case 'text':
                    return <InputText {...fieldItem} onValueChange={this.onValueChange}/>
                case 'toggle':
                    return <InputToggle {...fieldItem} onValueChange={this.onValueChange}/>
                case 'option':
                    return <InputOptions {...fieldItem} onValueChange={this.onValueChange}/>
                default:
                    return (<></>);
            }
        });

        return (
            <section className="field-content">
                    <div className="item-container">
                        {filedJSX}
                    </div>
            </section>
        );
    }

    getItemEditorMainContentJSX = ()  => {
        const { items, selectedItemIndex } = this.state;
        let selectedItemFields = null;
        const sideBarListItemJSX = items.map( (child, index) => {
            const { id, name, fields } = child;
            if(selectedItemIndex === index) {
                selectedItemFields = fields;
                return (<li key={id} data-mode="active" onClick={ () => this.onItemClick(index, id) }>{name}</li>);
            }
            return (<li key={id} onClick={ () => this.onItemClick(index, id) }>{name}</li>);
        })
        return (
            <main className="main-content">
                <aside className="item-list">
                    <ul>
                        {sideBarListItemJSX}
                    </ul>
                </aside>
                {this.getSelectedItemFieldsJSX(selectedItemFields)}
            </main>
        )
    }

    getItemListJSX = () => {
        const { title } = this.props;
        return (
            <div>
                <PanelHeader appTitle={title} appCommandList={this.appLevelOperationBtns} />
                {this.getItemEditorMainContentJSX()}
            </div>
        );
    }

    render() {
        console.log(this.state);
        return (this.getItemListJSX());
    }

}
ItemEditor.defaultValue = {
    items: [],
    onSave: ()=>{},
    title: 'Item Editor',
};
ItemEditor.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        fields: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            fieldName: PropTypes.string,
            fieldType: PropTypes.oneOf([ 'text', 'option', 'toggle' ]),
            fieldValue: PropTypes.oneOfType([
                PropTypes.string, PropTypes.number, PropTypes.bool ]),
            fieldOptions: PropTypes.arrayOf(PropTypes.shape({
                optionName: PropTypes.string,
                optionValue: PropTypes.number
            }))
        }))
    })),
    onSave: PropTypes.func,
    title: PropTypes.string,
};
export default ItemEditor;