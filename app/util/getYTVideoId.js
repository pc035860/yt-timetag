import urlParser from 'js-video-url-parser';

let _lastUrl;
let _lastVideoId;

export default function getYTVideoId() {
  const url = location.href;
  if (!_lastUrl || url !== _lastUrl) {
    _lastUrl = url;
    const videoId = urlParser.parse(url).id;
    _lastVideoId = videoId;
  }
  return _lastVideoId;
}
