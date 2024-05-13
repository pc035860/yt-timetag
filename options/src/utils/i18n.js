/* global chrome */
export function ct(...args) {
  if (chrome && chrome.i18n) {
    return chrome.i18n.getMessage(...args);
  }

  return args[0];
}
