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
import { load as loadCrState } from '_util/crState';

const appRootId = 'yttt-app';

function renderApp() {
  const sidebarId = 'watch7-sidebar-contents';
  const sidebarElm = document.getElementById(sidebarId);

  if (!sidebarElm) {
    throw new Error('sidebar element not found');
  }

  // 準備 react app root elemennt
  const appElm = document.createElement('div');
  assign(appElm, {
    id: appRootId,
    className: appRootId
  });
  sidebarElm.insertBefore(appElm, sidebarElm.firstChild);

  loadCrState().then(state_ => {
    const state = state_;

    if (state) {
      // ignore activeTag state
      state.activeTag = -1;
    }

    const store = state ? configureStore(state) : configureStore();

    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      appElm
    );
  });
}


// 回應 injection check
chrome.runtime.onMessage.addListener((res, sender, sendResponse) => {
  if (res === MSG_CHECK_LOADED_REQUEST) {
    sendResponse(MSG_CHECK_LOADED_RESPONSE);

    if (!document.getElementById(appRootId)) {
      renderApp();
    }
  }
});

renderApp();

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
