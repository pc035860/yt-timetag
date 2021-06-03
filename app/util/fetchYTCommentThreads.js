import get from 'lodash/get';
import sumBy from 'lodash/sumBy';
import queryString from 'query-string';

const API_ENDPOINT = 'https://yt-timetag.pymaster.tw';
const API_ENDPOINT_RAW = 'https://us-central1-yt-timetag.cloudfunctions.net';

const defaultOnProgress = (progress) => null;

const fetchTotalCount = (videoId, { signal }) => {
  const query = queryString.stringify({
    id: videoId,
    part: 'statistics',
  });
  const url = `${API_ENDPOINT}/videos?${query}`;
  return fetch(url, { signal })
    .then((response) => response.json())
    .then((res) => {
      const totalCount = get(res, 'items[0].statistics.commentCount');
      return totalCount;
    });
};

const fetchCommentThreads = (
  videoId,
  { pageToken, signal, rawEndpoint = false } = {}
) => {
  const query = queryString.stringify({
    videoId,
    pageToken,
    part: 'snippet',
    order: 'relevance',
    maxResults: 100,
  });
  const url = `${
    rawEndpoint ? API_ENDPOINT_RAW : API_ENDPOINT
  }/commentThreads?${query}`;

  const parseResponse = (res, raw = false) => {
    const items = res.items.map((item) => ({
      id: item.id,
      text: get(item, 'snippet.topLevelComment.snippet.textOriginal'),
      replyCount: get(item, 'snippet.totalReplyCount'),
    }));

    return {
      threads: items,
      threadCount: sumBy(items, (item) => item.replyCount + 1),
      nextPageToken: get(res, 'nextPageToken'),
      raw,
    };
  };

  return fetch(url, { signal })
    .then((response) => response.json())
    .then((res) => parseResponse(res))
    .catch((error) => {
      if (rawEndpoint) {
        return Promise.reject(error);
      }
      const rawUrl = `${API_ENDPOINT_RAW}/commentThreads?${query}`;
      return fetch(rawUrl, { signal })
        .then((response) => response.json())
        .then((res) => parseResponse(res, /* raw */ true));
    });
};

export default function fetchYTCommentThreads(
  videoId,
  { onProgress = defaultOnProgress, signal } = {}
) {
  return fetchTotalCount(videoId, { signal })
    .then(
      (totalCount) =>
        new Promise((resolve) => {
          let progressCount = 0;
          let threads = [];

          let promise = Promise.resolve();
          let rawEndpoint = false;

          const _loop = (nextPageToken) => {
            promise = promise.then(() =>
              fetchCommentThreads(videoId, {
                pageToken: nextPageToken,
                signal,
                rawEndpoint,
              })
                .then((res) => {
                  progressCount += res.threadCount;
                  threads = threads.concat(res.threads);

                  onProgress(progressCount / totalCount, threads);

                  if (res.raw) {
                    // switch to raw endpoint when max request size hit
                    rawEndpoint = true;
                  }

                  if (res.nextPageToken) {
                    _loop(res.nextPageToken);
                    return;
                  }

                  resolve({
                    threads,
                    totalCount,
                  });
                })
                .catch((error) => {
                  resolve({
                    threads,
                    totalCount,
                    error,
                  });
                })
            );
          };

          _loop();
        })
    )
    .catch((error) => ({
      threads: [],
      totalCount: 0,
      error,
    }));
}
