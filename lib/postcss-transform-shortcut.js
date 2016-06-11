var postcss = require('postcss');

module.exports = postcss.plugin('postcss-transform-shortcut', function (opts) {
  opts = opts || {};

  var defaults = {
    rotate:    ['0deg', 0, 0, 1],
    scale:     [1, 1, 1],
    translate: ['0px', '0px', '0px']
  };

  var splice = Array.prototype.splice,
      slice = Array.prototype.slice;

  return function (css) {
    css.walkRules(function (rule) {
      var transform;
      var transformValues = [];
      var index = -1;
      var node;

      while (node = rule.nodes[++index]) {
        if (!transform && node.prop === 'transform') {
          transform = node;

          transformValues = postcss.list.space(node.value);
        } else if (/^(rotate|scale|translate)$/.test(node.prop)) {
          transform = transform || node.cloneBefore({
            prop: 'transform'
          });

          var oldValues = postcss.list.space(node.value);
          var newValues;

          switch (node.prop) {
            case 'rotate':
              newValues = defaults[node.prop].slice(0);
              splice.apply(newValues, [0, oldValues.length].concat(oldValues));

              if (oldValues.length === 1) {
                transformValues.push('rotate(' + oldValues[0] + ')');
              }
              else {
                transformValues.push('rotate3d(' + newValues.join(',') + ')');
              }

              break;
            default:
              var transformFnName;

              newValues = defaults[node.prop].slice(0, oldValues.length);
              splice.apply(newValues, [0, oldValues.length].concat(oldValues));

              transformFnName = node.prop + (oldValues.length < 3 ? '' : '3d');

              transformValues.push(transformFnName + '(' + newValues.join(',') + ')');

              break;
          }

          node.remove();

          --index;
        }
      }

      if (transform) {
        transform.value = transformValues.join(' ');
      }
    });
  };
});
