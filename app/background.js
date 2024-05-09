import urlParser from 'js-video-url-parser';
import {
  MSG_CHECK_LOADED_REQUEST,
  MSG_CHECK_LOADED_RESPONSE,
} from '_constants/Messages';

chrome.action.onClicked.addListener((tab) => {
  const parsed = urlParser.parse(tab.url);
  if (parsed && parsed.provider === 'youtube' && parsed.mediaType === 'video') {
    chrome.tabs.sendMessage(tab.id, MSG_CHECK_LOADED_REQUEST, (res) => {
      // check lastError
      if (chrome.runtime.lastError) {
        console.debug('last error', chrome.runtime.lastError);
      }

      if (res === MSG_CHECK_LOADED_RESPONSE) {
        return;
      }

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['contentscript.js'],
      });
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['contentscript.css'],
      });
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse('from background');
  return true;
});
