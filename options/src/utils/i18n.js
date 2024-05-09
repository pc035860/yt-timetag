/* global chrome */
export function t(...args) {
  if (chrome && chrome.i18n) {
    return chrome.i18n.getMessage(...args);
  }

  return args[0];
}
