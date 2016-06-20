import urlParser from 'js-video-url-parser';

import { local } from '_util/chromeStorage';

const _videoId = urlParser.parse(location.href).id;
const _key = `${_videoId}-crState`;

export const load = () => local.get(_key);

export const save = state => local.set(_key, state);

export const storeEnhancer = () =>
  next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    store.subscribe(() => {
      const state = store.getState();
      save(state);
    });
    return store;
  };
