import urlParser from 'js-video-url-parser';
import {
  MSG_CHECK_LOADED_REQUEST,
  MSG_CHECK_LOADED_RESPONSE
} from '_constants/Messages';

chrome.browserAction.onClicked.addListener(tab => {
  const parsed = urlParser.parse(tab.url);
  if (parsed && parsed.provider === 'youtube') {
    chrome.tabs.sendMessage(tab.id, MSG_CHECK_LOADED_REQUEST, res => {
      if (res === MSG_CHECK_LOADED_RESPONSE) {
        return;
      }

      chrome.tabs.executeScript(tab.id, {
        file: 'contentscript.js',
        runAt: 'document_end'
      });
      chrome.tabs.insertCSS(tab.id, {
        file: 'contentscript.css',
        runAt: 'document_end'
      });
    });
  }
});
