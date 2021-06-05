import Q from 'q';

function factory(area) {
  return {
    getAll() {
      return Q.Promise(resolve => {
        chrome.storage[area].get(null, items => {
          if (chrome.runtime.lastError) {
            resolve();
            return;
          }
          resolve(items);
        });
      });
    },

    get(key) {
      return Q.Promise(resolve => {
        chrome.storage[area].get(key, item => {
          if (chrome.runtime.lastError) {
            console.debug(
              `[yt-timetag] get ${area} storage error`,
              chrome.runtime.lastError
            );
          }

          if (item && item[key]) {
            resolve(item[key]);
          }
          else {
            resolve();
          }
        });
      });
    },

    set(key, value) {
      let item;
      return Q.Promise(resolve => {
        if (typeof key === 'object') {
          item = key;
        }
        else {
          item = {};
          item[key] = value;
        }

        chrome.storage[area].set(item, () => {
          if (chrome.runtime.lastError) {
            console.debug(
              `[yt-timetag] set ${area} storage error`,
              chrome.runtime.lastError
            );
          }
          resolve();
        });
      });
    },

    setAll(items) {
      return this.set(items);
    },

    remove(keys) {
      return Q.Promise(resolve => {
        chrome.storage[area].remove(keys, () => {
          if (chrome.runtime.lastError) {
            console.debug(
              `[yt-timetag] remove ${area} storage error`,
              chrome.runtime.lastError
            );
          }
          resolve();
        });
      });
    },

    clear() {
      return Q.Promise(resolve => {
        chrome.storage[area].clear(() => {
          if (chrome.runtime.lastError) {
            console.debug(
              `[yt-timetag] clear ${area} storage error`,
              chrome.runtime.lastError
            );
          }
          resolve();
        });
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
    }
  };
}

export const local = factory('local');
export const sync = factory('sync');
