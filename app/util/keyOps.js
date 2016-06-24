import ee from 'event-emitter';
import Mousetrap from 'mousetrap';

import forEach from 'lodash/forEach';

const _emitter = ee({});

function isFocusOnVideo() {
  return document.activeElement.id === 'movie_player';
}

export const bind = () => {
  const config = {
    a: () => {
      _emitter.emit('add tag');
      return false;
    },
    '/': () => {
      _emitter.emit('focus description');
      return false;
    },
    left: () => {
      if (isFocusOnVideo()) {
        return true;
      }
      _emitter.emit('sub 5');
      return false;
    },
    right: () => {
      if (isFocusOnVideo()) {
        return true;
      }
      _emitter.emit('add 5');
      return false;
    },
    'alt+left': () => {
      _emitter.emit('sub 1');
      return false;
    },
    'alt+right': () => {
      _emitter.emit('add 1');
      return false;
    },
    esc: () => {
      _emitter.emit('clear active');
      return false;
    },
    space: () => {
      if (isFocusOnVideo()) {
        return true;
      }
      _emitter.emit('pause or play');
      return false;
    }
  };

  forEach(config, (fn, key) => {
    Mousetrap.bind(key, fn);
  });
};

export const emitter = () => _emitter;
