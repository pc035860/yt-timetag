import { toSeconds } from '_util/ytTime';
import trim from 'lodash/trim';
import sortBy from 'lodash/sortBy';

export default function parseTags(str) {
  const re = /(\d{1,2}:\d{2}:\d{2})|(\d{1,2}:\d{2})/gm;

  const t = [];  // temporary tags list
  const d = [];  // temporary descriptions list

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

  return sortBy(t.map((tag, i) => ({
    seconds: toSeconds(tag),
    description: trim(d[i])
  })), ['seconds']);
}
