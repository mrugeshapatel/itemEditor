import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


class index extends React.Component {
  render() {
    return (
      <App appStore={this.store} key='myApp' />
    );
  }
}
export default index;
ReactDOM.render(React.createElement(index, null), document.getElementById('root'));