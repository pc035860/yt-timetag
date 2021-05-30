import get from 'lodash/get';
import sumBy from 'lodash/sumBy';
import queryString from 'query-string';

const API_KEY = process.env.YOUTUBE_API_KEY;
const API_ENDPOINT = 'https://www.googleapis.com/youtube/v3';

const defaultOnProgress = (progress) => null;

const fetchTotalCount = (videoId) => {
  const query = queryString.stringify({
    key: API_KEY,
    id: videoId,
    part: 'statistics',
  });
  const url = `${API_ENDPOINT}/videos?${query}`;
  return fetch(url)
    .then((response) => response.json())
    .then((res) => {
      const totalCount = get(res, 'items[0].statistics.commentCount');
      return totalCount;
    });
};

const fetchCommentThreads = (videoId, { pageToken } = {}) => {
  const query = queryString.stringify({
    key: API_KEY,
    videoId,
    pageToken,
    part: 'snippet',
    order: 'relevance',
    maxResults: 100,
  });
  const url = `${API_ENDPOINT}/commentThreads?${query}`;
  return fetch(url)
    .then((response) => response.json())
    .then((res) => {
      const items = res.items.map((item) => ({
        id: item.id,
        text: get(item, 'snippet.topLevelComment.snippet.textOriginal'),
        replyCount: get(item, 'snippet.totalReplyCount'),
      }));

      return {
        threads: items,
        threadCount: sumBy(items, (item) => item.replyCount + 1),
        nextPageToken: get(res, 'nextPageToken'),
      };
    });
};

export default function fetchYTCommentThreads(
  videoId,
  { onProgress = defaultOnProgress } = {}
) {
  return fetchTotalCount(videoId).then(
    (totalCount) =>
      new Promise((resolve) => {
        let progressCount = 0;
        let threads = [];

        let promise = Promise.resolve();

        const _loop = (nextPageToken) => {
          promise = promise.then(() =>
            fetchCommentThreads(videoId, { pageToken: nextPageToken }).then(
              (res) => {
                progressCount += res.threadCount;
                threads = threads.concat(res.threads);

                onProgress(progressCount / totalCount, threads);

                if (res.nextPageToken) {
                  _loop(res.nextPageToken);
                  return;
                }

                resolve({
                  threads,
                  totalCount,
                });
              }
            )
          );
        };

        _loop();
      })
  );
}
