import './sass/contentscript.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import assign from 'lodash/assign';

import App from '_containers/App';
import {
  MSG_CHECK_LOADED_REQUEST,
  MSG_CHECK_LOADED_RESPONSE
} from './constants/Messages';

const sidebarId = 'watch7-sidebar-contents';
const sidebarElm = document.getElementById(sidebarId);

if (!sidebarElm) {
  throw new Error('sidebar element not found');
}

const appElm = document.createElement('div');
assign(appElm, {
  id: 'yttt-app',
  className: 'yttt-app'
});
sidebarElm.insertBefore(appElm, sidebarElm.firstChild);

ReactDOM.render(<App />, appElm);


chrome.runtime.onMessage.addListener((res, sender, sendResponse) => {
  if (res === MSG_CHECK_LOADED_REQUEST) {
    sendResponse(MSG_CHECK_LOADED_RESPONSE);
  }
});
