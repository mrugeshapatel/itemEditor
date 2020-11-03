import React from 'react';

class PanelHeader extends React.Component {
    getHeaderJSX = () => {
        const { appTitle, appCommandList } = this.props;
        return (
            <header className="App-header flex-between">
                <div key="appTitle" className="display-flex flex-left title-text">{appTitle}</div>
                <div key="appCmdBtns" className="display-flex flex-right">
                    <ul key="appCmdBtnsLst">
                    {
                        appCommandList.map( item => { 
                            return (<li key={item.props.id}>{item}</li>); 
                            }
                        )
                    }
                    </ul>
                </div>
          </header>
        )
    }

    render() {
        return(this.getHeaderJSX())
    }
}
export default PanelHeader;