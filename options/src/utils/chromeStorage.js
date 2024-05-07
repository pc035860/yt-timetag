/* global chrome */

function factory(area) {
  return {
    getAll() {
      return chrome.storage[area].get().then(items => {
        if (chrome.runtime.lastError) {
          return;
        }
        return items;
      });
    },

    get(key) {
      return chrome.storage[area].get(key).then(item => {
        if (chrome.runtime.lastError) {
          console.debug(
            `[yt-timetag] get ${area} storage error`,
            chrome.runtime.lastError
          );
        }

        if (item && item[key]) {
          return item[key];
        }
      });
    },

    set(key, value) {
      let item;
      if (typeof key === 'object') {
        item = key;
      } else {
        item = {};
        item[key] = value;
      }

      return chrome.storage[area].set(item).then(() => {
        if (chrome.runtime.lastError) {
          console.debug(
            `[yt-timetag] set ${area} storage error`,
            chrome.runtime.lastError
          );
          throw new Error(chrome.runtime.lastError);
        }
      });
    },

    setAll(items) {
      return this.set(items);
    },

    remove(keys) {
      return chrome.storage[area].remove(keys).then(() => {
        if (chrome.runtime.lastError) {
          console.debug(
            `[yt-timetag] remove ${area} storage error`,
            chrome.runtime.lastError
          );
        }
      });
    },

    clear() {
      return chrome.storage[area].clear().then(() => {
        if (chrome.runtime.lastError) {
          console.debug(
            `[yt-timetag] clear ${area} storage error`,
            chrome.runtime.lastError
          );
          throw new Error(chrome.runtime.lastError);
        }
      });
    },

    onChange(callback) {
      const storageOnChanged = (changes, areaName) => {
        if (areaName === area) {
          callback(changes);
        }
      };
      chrome.storage.onChanged.addListener(storageOnChanged);
      return () => {
        chrome.storage.onChanged.removeListener(storageOnChanged);
      };
    },
  };
}

export const local = factory('local');
export const sync = factory('sync');
