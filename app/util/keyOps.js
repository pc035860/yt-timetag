import ee from 'event-emitter';
import allOff from 'event-emitter/all-off';
import Mousetrap from 'mousetrap';

import forEach from 'lodash/forEach';

import getYTVideoId from '_util/getYTVideoId';
import { local } from '_util/chromeStorage';

const DEFAULT_SHORTCUTS = {
  // editable
  addTag: ['a'],
  focusDescription: ['d'],

  // non-editable
  removeTag: ['del', 'backspace'],
  backward: ['left'],
  forward: ['right'],
  backwardMinor: ['alt+left'],
  forwardMinor: ['alt+right'],
  clearActive: ['esc'],
  playPause: ['space'],
};

const KEY_STORAGE_SHORTCUTS_SETTINGS = 'shortcutsSettings';

const _pool = {};

function isFocusOnVideo() {
  return document.activeElement.id === 'movie_player';
}

export const getEmitter = (id) => {
  if (_pool[id]) {
    return _pool[id];
  }

  // clear all
  forEach(_pool, (emtr, k) => {
    delete _pool[k];
    allOff(emtr);
  });

  _pool[id] = ee({ id });
  return _pool[id];
};

const _boundKeys = [];
const _bind = (shortcuts = DEFAULT_SHORTCUTS) => {
  const emtr = () => getEmitter(getYTVideoId());

  const shortcutKeyToMousetrapFn = {
    addTag: () => {
      emtr().emit('add tag');
      return false;
    },
    focusDescription: () => {
      emtr().emit('focus description');
      return false;
    },
    backward: () => {
      if (isFocusOnVideo()) {
        return true;
      }
      emtr().emit('backward 5');
      emtr().emit('tag sub 5');
      return false;
    },
    forward: () => {
      if (isFocusOnVideo()) {
        return true;
      }
      emtr().emit('forward 5');
      emtr().emit('tag add 5');
      return false;
    },
    backwardMinor: () => {
      emtr().emit('backward 1');
      emtr().emit('tag sub 1');
      return false;
    },
    forwardMinor: () => {
      emtr().emit('forward 1');
      emtr().emit('tag add 1');
      return false;
    },
    clearActive: () => {
      emtr().emit('clear active');
      return false;
    },
    playPause: () => true,
    removeTag: () => {
      emtr().emit('tag remove');
      return false;
    },
  };

  _boundKeys.length = 0;
  forEach(shortcuts, (keys, shortcutKey) => {
    const fn = shortcutKeyToMousetrapFn[shortcutKey];
    if (!fn) {
      return;
    }

    forEach(keys, (key) => {
      Mousetrap.bind(key, fn);
      _boundKeys.push(key);
    });
  });
};

const _unbind = () => {
  forEach(_boundKeys, (key) => {
    Mousetrap.unbind(key);
  });
};

export const bind = () => {
  const handleShortcutsSettings = (shortcutsSettings) => {
    if (shortcutsSettings) {
      const { isEnabled, shortcuts } = shortcutsSettings;
      _unbind();
      if (isEnabled) {
        _bind(shortcuts);
      }
    } else {
      _bind();
    }
  };

  local.get(KEY_STORAGE_SHORTCUTS_SETTINGS).then(handleShortcutsSettings);

  local.onChange((changes) => {
    const settingsChange = changes[KEY_STORAGE_SHORTCUTS_SETTINGS];
    if (settingsChange) {
      handleShortcutsSettings(settingsChange.newValue);
    }
  });
};
