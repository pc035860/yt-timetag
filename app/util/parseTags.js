import { toSeconds } from '_util/ytTime';
import trim from 'lodash/trim';
import sortBy from 'lodash/sortBy';

function _output(tagSeconds, descriptions) {
  return sortBy(
    tagSeconds.map((tagSecond, i) => ({
      seconds: toSeconds(tagSecond),
      description: trim(descriptions[i]),
    })),
    ['seconds']
  );
}

function _parseChapterTags(str) {
  const lines = str.split('\n').map((s) => trim(s));

  const t = [];
  const d = [];

  lines.forEach((line) => {
    if (/(\d{1,2}:\d{2}:\d{2})|(\d{1,2}:\d{2})/.test(line)) {
      const m = line.match(
        /\s*((\d{1,2}:\d{2}:\d{2})|(\d{1,2}:\d{2}))+?\s*｜?/
      );
      if (m) {
        const matchedTag = m[1] || m[2];
        t.push(matchedTag);

        // 如果 tag 不是在該列的開頭，置換時補一個空白
        const replacementSpace = m.index !== 0 ? ' ' : '';
        d.push(trim(line.replace(m[0], replacementSpace)));
      }
    }
  });

  return _output(t, d);
}

export default function parseTags(str, { chapterMode = false } = {}) {
  if (chapterMode) {
    return _parseChapterTags(str);
  }

  const re = /(\d{1,2}:\d{2}:\d{2})|(\d{1,2}:\d{2})/gm;

  const t = []; // temporary tags list
  const d = []; // temporary descriptions list

  let result = null;
  let lastMatchStart = null;

  /* eslint-disable */
  while ((result = re.exec(str)) !== null) {
    if (lastMatchStart !== null) {
      d.push(str.substring(lastMatchStart, result.index));
    }
    t.push(result[0]);
    lastMatchStart = re.lastIndex;
  }
  /* eslint-enable */

  // possible last description
  if (lastMatchStart < str.length) {
    d.push(str.substring(lastMatchStart));
  }

  return _output(t, d);
}
