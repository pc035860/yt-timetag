import {
  MSG_PLAYER_API_RESULT,
  MSG_PLAYER_API,
  MSG_PLAYER_STATE_CHANGE
} from '_constants/Messages';

import Q from 'q';
import ee from 'event-emitter';

const playerState = {
  '-1': 'unstared',
  0 : 'ended',
  1 : 'playing',
  2 : 'paused',
  3 : 'buffering',
  5 : 'cued'
};

// message deferred pool
const _messageDfd = {};
// message uniq id
let _messageId = 0;

/**
 * 傳送非同步 YouTube API 給頁面
 * @param {boolean} needResult 是否需要取得返回的結果
 * @param {mixed}              參見原 API 文件
 *                             https://developers.google.com/youtube/js_api_reference
 */
const _player = (...args) => {
  let needResult;
  let dfd;

  if (typeof args[0] === 'boolean') {
    needResult = args.shift();
  }

  _messageId++;

  if (needResult) {
    dfd = Q.defer();
    _messageDfd[_messageId] = dfd;
  }

  sendMessage(MSG_PLAYER_API, {
    $id: _messageId,
    name: args[0],
    args: args.slice(1)
  });

  if (needResult) {
    return dfd.promise;
  }
  return null;
};
// makes player event emitter
const player = ee(_player);

function sendMessage(message, more) {
  let data = { message };

  if (Object.prototype.toString.call(more) === '[object Object]') {
    data = { ...data, ...more };
  }

  const json = JSON.stringify(data);
  window.postMessage(json, '*');
}

function onMessagePlayerApiResult(data) {
  if (data.$id && _messageDfd[data.$id]) {
    _messageDfd[data.$id].resolve(data.result);
    delete _messageDfd[data.$id];
  }
}

function onMessagePlayerStateChange(data) {
  if (!data || !data.state) {
    return;
  }

  const state = data.state;

  player.state = state;

  const evt = playerState[`${data.state}`];
  if (evt) {
    player.emit(evt);
  }
}

window.addEventListener('message', (evt) => {
  let data;

  try {
    data = JSON.parse(evt.data);
  }
  catch (e) { /* nothing */ }

  if (data && data.message) {
    switch (data.message) {
      case MSG_PLAYER_API_RESULT:
        onMessagePlayerApiResult(data);
        break;
      case MSG_PLAYER_STATE_CHANGE:
        onMessagePlayerStateChange(data);
        break;
      default:
        break;
    }
  }
});

export default player;
