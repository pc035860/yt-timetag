export const LINK = {
  CHROME_WEB_STORE:
    'https://chrome.google.com/webstore/detail/hpbmedimnlknflpbgfbllklgelbnelef',
  FIREFOX_ADDONS:
    'https://addons.mozilla.org/firefox/addon/timetags-for-youtube/',
  GITHUB_REPOSITORY: 'https://github.com/pc035860/yt-timetag',
  GITHUB_USER: 'https://github.com/pc035860',
  EXPLORER: 'https://cloud.pymaster.tw/yt-timetag-explorer/',
};

export const KEY_STORAGE_SHORTCUTS_SETTINGS = 'shortcutsSettings';

export const DEFAULT_SHORTCUTS = {
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

export const DEFAULT_SHORTCUTS_SETTINGS = {
  isEnabled: true,
  shortcuts: DEFAULT_SHORTCUTS,
};
