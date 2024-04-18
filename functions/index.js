const functions = require('firebase-functions');
const { defineString } = require('firebase-functions/params');
const cors = require('cors');
const axios = require('axios');
const queryString = require('query-string');

const API_KEY = defineString('YOUTUBE_APIKEY');

// cache for a week
const maxAge = 86400 * 7;

const corsOptions = {
  origin: '*',
  exposedHeaders: ['Date'],
  maxAge,
};

function createYoutubeAPIProxy(resourcePath, { region = 'us-central1' } = {}) {
  const func = functions.region(region);
  return func.https.onRequest((req, res) => {
    if (req.method !== 'GET') {
      res.status(403).end();
      return;
    }

    cors(corsOptions)(req, res, () => {
      const query = queryString.stringify({
        key: API_KEY.value(),
        ...req.query,
      });
      const url = `https://www.googleapis.com/youtube/v3/${resourcePath}?${query}`;
      const timeout = 5000;

      return axios.get(url, { timeout }).then(({ data }) => {
        res
          .status(200)
          .set({
            'Cache-Control': `public, max-age=${maxAge}`,
          })
          .json(data);
      });
    });
  });
}

exports.videos = createYoutubeAPIProxy('videos');
exports.commentThreads = createYoutubeAPIProxy('commentThreads');
