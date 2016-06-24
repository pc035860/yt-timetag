import padStart from 'lodash/padStart';

function pad(number) {
  return padStart(number, 2, '0');
}

export const toTag = (seconds) => {
  let left = seconds;
  const h = (left / 3600) >>> 0;
  left -= h * 3600;
  const m = (left / 60) >>> 0;
  left -= m * 60;
  const s = left >>> 0;

  let output = `${pad(s)}`;

  if (m || h) {
    let seg;

    if (!m) {
      seg = '00';
    }
    else {
      if (h) {
        seg = pad(m);
      }
      else {
        seg = m;
      }
    }

    output = `${seg}:${output}`;
  }

  if (h) {
    output = `${h}:${output}`;
  }

  if (!m && !h) {
    output = `00:${output}`;
  }

  return output;
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
