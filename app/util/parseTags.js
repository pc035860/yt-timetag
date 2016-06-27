import { toSeconds } from '_util/ytTime';

export default function parseTags(str) {
  const re = /(\d{1,2}:\d{2}:\d{2})|(\d{1,2}:\d{2})/gm;

  const t = [];  // temporary tags list
  const d = [];  // temporary descriptions list

  let result;
  let lastMatchStart;

  /* eslint-disable */
  while ((result = re.exec(str)) !== null) {
    if (lastMatchStart !== null) {
      d.push(str.substring(lastMatchStart, result.index));
    }
    t.push(result[0]);
  }
  /* eslint-enable */

  // possible last description
  if (lastMatchStart < str.length) {
    d.push(str.substring(lastMatchStart));
  }

  return t.map((tag, i) => ({
    seconds: toSeconds(tag),
    description: d[i]
  }));
}
