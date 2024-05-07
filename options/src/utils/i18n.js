/* global chrome */
export function t(...args) {
  return chrome.i18n.getMessage(...args);
}
