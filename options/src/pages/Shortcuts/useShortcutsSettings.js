import { useCallback, useEffect, useState } from 'react';

import _ from 'lodash';
import { produce } from 'immer';

import { local } from '../../utils/chromeStorage';

import {
  DEFAULT_SHORTCUTS,
  DEFAULT_SHORTCUTS_SETTINGS,
  KEY_STORAGE_SHORTCUTS_SETTINGS,
} from '../../constants';

/**
 * settings structure
 * {
 *   isEnabled: boolean,
 *   shortcuts: {
 *     addTag: string[],
 *     focusDescription: string[],
 *     removeTag: string[],
 *     backward: string[],
 *     forward: string[],
 *     backwardMinor: string[],
 *     forwardMinor: string[],
 *     clearActive: string[],
 *     playPause: string[],
 *   }
 * }
 */

export default function useShortcutsSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    // load shortcuts from chrome storage
    local.get(KEY_STORAGE_SHORTCUTS_SETTINGS).then(data => {
      setSettings(data || DEFAULT_SHORTCUTS_SETTINGS);
    });
  }, []);

  useEffect(() => {
    if (settings) {
      local.set({ [KEY_STORAGE_SHORTCUTS_SETTINGS]: settings });
    }
  }, [settings]);

  const updateShortcut = useCallback((shortcutKey, keys) => {
    setSettings(prev =>
      produce(prev, draft => {
        draft.shortcuts[shortcutKey] = keys;
      })
    );
  }, []);
  const resetShortcuts = useCallback(() => {
    setSettings(prev =>
      produce(prev, draft => {
        draft.shortcuts = DEFAULT_SHORTCUTS;
      })
    );
  }, []);
  const shortcuts = _.get(settings, 'shortcuts', null);

  const toggleEnabled = useCallback(onOff => {
    if (typeof onOff !== 'undefined') {
      setSettings(prev =>
        produce(prev, draft => {
          draft.isEnabled = !!onOff;
        })
      );
      return;
    }
    setSettings(prev =>
      produce(prev, draft => {
        draft.isEnabled = !draft.isEnabled;
      })
    );
  }, []);
  const isEnabled = _.get(settings, 'isEnabled', false);

  return {
    shortcuts,
    updateShortcut,
    resetShortcuts,
    isEnabled,
    toggleEnabled,
  };
}
