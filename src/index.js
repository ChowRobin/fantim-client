import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-app-polyfill/ie9';
import registerServiceWorker from './registerServiceWorker';
import store from './utils/Store';
import ChatApp from './components/ChatApp';


ReactDOM.render(<ChatApp store={store}/>, document.getElementById('root'));
registerServiceWorker();
