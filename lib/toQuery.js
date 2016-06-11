function toQuery(params) {
  var l = [],
      __toString = Object.prototype.toString,
      k, v;
  for (k in params) {
    v = params[k];

    if (__toString.call(v) === '[object Array]') {
      v.forEach(function (p) {
        l.push(k + '[]=' + p);
      });
    }
    else if (typeof v === 'boolean') {
      if (v) {
        l.push(k);
      }
    }
    else {
      l.push(k + '=' + v);
    }
  }
  return l.join('&');
}

module.exports = toQuery;
