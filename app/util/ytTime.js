import padStart from 'lodash/padStart';

export const toTag = (seconds) => {
  let left = seconds;
  const h = (left / 3600) >>> 0;
  left -= h * 3600;
  const m = (left / 60) >>> 0;
  left -= m * 60;
  const s = left >>> 0;

  return [h, m, s]
  .filter(v => v)
  .map((v, i) => (i !== 0 ? padStart(v, 2, '0') : v))
  .join(':');
};

export const toSeconds = (tagStr) => {
  const buf = tagStr.split(/:/);

  let h = 0;
  let m = 0;
  let s = 0;

  if (buf.length === 3) {
    h = Number(buf[0]);
    m = Number(buf[1]);
    s = Number(buf[2]);
  }
  else if (buf.length === 2) {
    m = Number(buf[0]);
    s = Number(buf[1]);
  }
  else if (buf.length === 1) {
    s = Number(buf[0]);
  }

  return h * 3600 + m * 60 + s;
};
