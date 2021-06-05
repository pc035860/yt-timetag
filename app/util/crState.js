import orderBy from 'lodash/orderBy';
import compact from 'lodash/compact';
import get from 'lodash/get';
import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';
import each from 'lodash/each';
import debounce from 'es6-promise-debounce';
import LZUTF8 from 'lzutf8';

import { sync, local } from '_util/chromeStorage';
import getYTVideoId from '_util/getYTVideoId';

const getStorageKey = () => {
  const videoId = getYTVideoId();
  return `crState-${videoId}`;
};

const getRecentItems = (items, count) => {
  const itemValues = Object.values(mapValues(items, (v, k) => ({
    ...v,
    _key: k
  })));
  const trimmedValues = itemValues.filter(v => {
    return v.tags && v.tags.length > 0;
  });
  const orderedValues = orderBy(trimmedValues, v =>
    Number(get(v, 'info.lastUpdated', 0))
  );
  const recentItemKeys = orderedValues.slice(0, count).map(v => v._key);
  return pick(items, recentItemKeys);
};

// debounce storage syncing by 30 seconds
const syncDebounceDuration = 30 * 1000;
const syncStorage = debounce(() => {
  // get everything
  return local.getAll().then(items => {
    if (!items) {
      return Promise.resolve();
    }

    // get recently updated 100 items
    const recentItems = getRecentItems(items, 100);

    const promises = [];
    each(recentItems, (v, k) => {
      // compress
      const str = JSON.stringify(v);
      const p = new Promise(resolve => {
        LZUTF8.compressAsync(str, {
          outputEncoding: 'Base64'
        }, (result) => {
          // resolve as pair
          resolve([k, result]);
        });
      });
      promises.push(p);
    });

    return Promise.all(promises)
      .then((pairs) => {
        const compressedItems = Object.fromEntries(pairs);
        return sync.setAll(compressedItems);
      })
      .catch(error => {
        console.error(error);
      });
  });
}, syncDebounceDuration);

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
  const localPromise = local.set(getStorageKey(), state)
    .then(() => {
      syncStorage();
      return;
    });
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
