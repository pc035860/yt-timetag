export function ct(...args) {
  if (window.chrome && window.chrome.i18n) {
    return window.chrome.i18n.getMessage(...args);
  }

  return args[0];
}
