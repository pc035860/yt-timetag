import './sass/contentscript.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import assign from 'lodash/assign';

import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import App from '_containers/App';
import {
  MSG_CHECK_LOADED_REQUEST,
  MSG_CHECK_LOADED_RESPONSE
} from './constants/Messages';

import ytPlayer from '_util/ytPlayer';

const sidebarId = 'watch7-sidebar-contents';
const sidebarElm = document.getElementById(sidebarId);

if (!sidebarElm) {
  throw new Error('sidebar element not found');
}

// 準備 react app root elemennt
const appElm = document.createElement('div');
assign(appElm, {
  id: 'yttt-app',
  className: 'yttt-app'
});
sidebarElm.insertBefore(appElm, sidebarElm.firstChild);

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  appElm
);

// 回應 injection check
chrome.runtime.onMessage.addListener((res, sender, sendResponse) => {
  if (res === MSG_CHECK_LOADED_REQUEST) {
    sendResponse(MSG_CHECK_LOADED_RESPONSE);
  }
});

setTimeout(() => {
  ytPlayer.on('playing', () => {
    ytPlayer(true, 'getCurrentTime').then((t) => {
      console.debug('playing t', t);
    });
  });

  ytPlayer.on('paused', () => {
    ytPlayer(true, 'getCurrentTime').then((t) => {
      console.debug('paused t', t);
    });
  });
}, 500);
