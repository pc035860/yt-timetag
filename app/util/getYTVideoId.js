import urlParser from 'js-video-url-parser';

let _lastUrl;
let _lastVideoId;

export default function getYTVideoId() {
  const url = location.href;
  if (!_lastUrl || url !== _lastUrl) {
    _lastUrl = url;

    const parsed = urlParser.parse(url);
    if (parsed) {
      const videoId = parsed.id;
      _lastVideoId = videoId;
    } else {
      _lastVideoId = undefined;
    }
  }
  return _lastVideoId;
}
