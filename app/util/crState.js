import { sync } from '_util/chromeStorage';
import getYTVideoId from '_util/getYTVideoId';

function getStorageKey() {
  const videoId = getYTVideoId();
  return `crState-${videoId}`;
}

export const load = () => sync.get(getStorageKey());

export const save = state => sync.set(getStorageKey(), state);

export const storeEnhancer = () =>
  next => (reducer, initialState) => {
    const store = next(reducer, initialState);
    store.subscribe(() => {
      const state = store.getState();
      save(state);
    });
    return store;
  };
