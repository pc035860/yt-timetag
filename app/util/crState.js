import orderBy from 'lodash/orderBy';
import compact from 'lodash/compact';
import get from 'lodash/get';
import debounce from 'es6-promise-debounce';
import LZUTF8 from 'lzutf8';

import { sync, local } from '_util/chromeStorage';
import getYTVideoId from '_util/getYTVideoId';

const getStorageKey = () => {
  const videoId = getYTVideoId();
  return `crState-${videoId}`;
};

// debounce sync write by 1 second
const saveToSyncStorage = debounce(state => {
  return new Promise(resolve => {
    // compress
    const str = JSON.stringify(state);
    LZUTF8.compressAsync(str, {
      outputEncoding: 'Base64'
    }, (result) => {
      sync.set(getStorageKey(), result).then(() => {
        resolve();
      });
    });
  });
}, 1000);

const getFromSyncStorage = key => {
  return sync.get(key).then(str => {
    if (!str) {
      return str;
    }

    if (typeof str !== 'string') {
      // old version of sync data
      const obj = str;
      return obj;
    }

    // decompress
    return new Promise(resolve => {
      LZUTF8.decompressAsync(str, {
        inputEncoding: 'Base64'
      }, (result) => {
        resolve(JSON.parse(result));
      });
    });
  });
};

export const load = () => {
  const key = getStorageKey();
  return Promise.all([getFromSyncStorage(key), local.get(key)])
    .then(([syncRes, localRes]) => {
      // prefer one with closest update time
      const buf = orderBy(
        compact([syncRes, localRes]),
        v => get(v, 'info.lastUpdated', 0),
        'desc'
      );
      return buf[0];
    });
};

export const save = state => {
  const localPromise = local.set(getStorageKey(), state);
  saveToSyncStorage(state);
  return localPromise;
};

export const storeEnhancer = () =>
  next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    store.subscribe(() => {
      const state = store.getState();
      save(state);
    });
    return store;
  };
