import './sass/contentscript.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import assign from 'lodash/assign';
import requestInterval from 'request-interval';

import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import App from '_containers/App';
import {
  MSG_CHECK_LOADED_REQUEST,
  MSG_CHECK_LOADED_RESPONSE
} from './constants/Messages';

import ytPlayer from '_util/ytPlayer';
import { load as loadCrState } from '_util/crState';
import { bind as bindKeyOps, getEmitter as getKeyOpsEmitter } from '_util/keyOps';
import getYTVideoId from '_util/getYTVideoId';
import is2017NewDesign from '_util/is2017NewDesign';

const appRootId = 'yttt-app';
const sidebarId = is2017NewDesign() ? 'related' : 'watch7-sidebar-contents';

function renderApp(videoId) {
  const sidebarElm = document.getElementById(sidebarId);

  if (!sidebarElm) {
    throw new Error('sidebar element not found');
  }

  let appElm = document.getElementById(appRootId);

  if (!appElm) {
    // 準備 react app root elemennt
    appElm = document.createElement('div');
    assign(appElm, {
      id: appRootId,
      className: appRootId
    });
    sidebarElm.insertBefore(appElm, sidebarElm.firstChild);
  }

  if (appElm.dataset.videoId === videoId) {
    return;
  }

  appElm.dataset.videoId = videoId;

  loadCrState().then(state_ => {
    const state = state_;

    if (state) {
      // ignore activeTag state
      state.activeTag = '';
    }

    const store = state ? configureStore(state) : configureStore();

    ReactDOM.render(
      <Provider store={store}>
        <App
          videoId={videoId}
          keyOpsEmitter={getKeyOpsEmitter(videoId)} />
      </Provider>,
      appElm
    );
  });
}

function unmountApp() {
  const appElm = document.getElementById(appRootId);
  if (appElm) {
    ReactDOM.unmountComponentAtNode(appElm);
    delete appElm.dataset.videoId;
  }
}


// 回應 injection check
chrome.runtime.onMessage.addListener((res, sender, sendResponse) => {
  if (res === MSG_CHECK_LOADED_REQUEST) {
    sendResponse(MSG_CHECK_LOADED_RESPONSE);

    if (!document.getElementById(appRootId) || is2017NewDesign()) {
      renderApp(getYTVideoId());
    }
  }
});

bindKeyOps();
renderApp(getYTVideoId());

if (is2017NewDesign()) {
  /**
   * 新版 YouTube 不會在切換影片的時候清空 sidebar
   * 所以這邊需要我們主動偵測並 unmount app
   */

  let lastVideoId;
  requestInterval(500, () => {
    const videoId = getYTVideoId();
    if (lastVideoId && lastVideoId !== videoId) {
      unmountApp();

      // auto update with videoId ?
      // renderApp(videoId);
    }
    lastVideoId = videoId;
  });
}

if (process.env.NODE_ENV !== 'production') {
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
}
