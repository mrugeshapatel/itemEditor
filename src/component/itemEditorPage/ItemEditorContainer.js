import React from 'react';
import ItemEditor from '../itemEditor/ItemEditor';
import * as jsonData from '../../data/itemData.json';

class ItemEditorContainer extends React.Component {

    constructor(props) {
        super(props);
        console.log("jsonData.default",jsonData.default);
        this.state = {
            items: jsonData.default,
        }
    }

    onSave = (updatedItems) => {
        this.setState({
            items: updatedItems,
        });
    }

    ItemEditorPageJSX = () => {
        return (
            <ItemEditor items={this.state.items} title="Item Editor" onSave={this.onSave}/>
            );
    }

    render() {
        return(this.ItemEditorPageJSX())
    }
}
export default ItemEditorContainer;