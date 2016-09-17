'use strict';

exports.flatten = require('arr-flatten');
exports.range = require('fill-range');
exports.define = require('define-property');
exports.extend = require('extend-shallow');
exports.unique = require('array-unique');
exports.nc = require('noncharacters');

exports.join = function(a, b) {
  a = exports.arrayify(a);
  b = exports.arrayify(b);
  if (!a.length) return b;
  if (!b.length) return a;

  var len = a.length;
  var idx = -1;
  var arr = [];
  while (++idx < len) {
    var str = a[idx];
    for (var i = 0; i < b.length; i++) {
      if (Array.isArray(b[i])) {
        arr.push(exports.join(str, b[i]));
      } else {
        var val = str + b[i];
        if (arr.indexOf(val) === -1) {
          arr.push(val);
        }
      }
    }
  }
  return arr;
};

exports.expand = function(str, options) {
  options = normalize(options);
  var tok = exports.split(str);
  var segs = tok.segs;

  if (segs.length > 1) {
    if (options.toRegex === false) {
      tok.val = segs;
      return tok;
    }
    tok.val = segs.join('|');

  } else if (segs.length === 1) {
    var arr = str.split('..');

    if (arr.length > 1) {
      if (options.toRegex !== false) {
        options.toRegex = true;
      }

      arr.push(options);
      tok.segs = exports.range.apply(null, arr);
      if (options.stringify !== false) {
        tok.segs = exports.stringify(tok.segs);
      }
      if (tok.segs === '') {
        tok.val = str;
      } else {
        tok.val = tok.segs;
      }
      return tok;
    }
  } else {
    tok.val = str;
  }
  return tok;
};

exports.split = function(str) {
  var segs = str.split(',');
  var tok = {rest: ''};
  var res = [];

  while (segs.length) {
    var key = segs.shift();
    while (key.slice(-1) === '\\') {
      tok.escaped = true;
      key = key.slice(0, -1) + ',' + segs.shift();
    }
    res.push(key);
  }

  tok.segs = res;
  return tok;
};

function normalize(options) {
  var opts = exports.extend({}, options);
  if (typeof opts.toRegex === 'boolean') {
    opts.makeRe = opts.toRegex;
  }
  if (typeof opts.optimize === 'boolean') {
    opts.makeRe = opts.toRegex;
  }
  if (opts.makeRe === false) {
    opts.stringify = false;
  }
  return opts;
}

exports.escape = function(str, options) {
  var opts = exports.extend({}, options);
  if (!opts.expand) return str;
  str = str.replace(/(\$\{([^{}]+?)\})/g, function(m, $1, $2) {
    return exports.nc[0] + $2 + exports.nc[2];
  });
  str = str.replace(/(\{)([^{,.}]+?)(\})/g, function(m, $1, $2, $3) {
    return exports.nc[1] + $2 + exports.nc[2];
  });
  str = str.replace(/\\\{|\{(?!.*\})/g, exports.nc[1]);
  str = str.replace(/\\\}/g, exports.nc[2]);
  str = str.replace(/\\\,/g, exports.nc[3]);
  if (!/\{/.test(str)) {
    return str.replace(/\}/g, exports.nc[2]);
  }
  return str;
};

exports.unescape = function(str, options) {
  var opts = exports.extend({}, options);
  if (!opts.expand) return str;
  var pre = opts.noescape ? '' : '\\';
  str = str.split(exports.nc[0]).join(pre ? '\\$\\{' : '${');
  str = str.split(exports.nc[1]).join(pre + '{');
  str = str.split(exports.nc[2]).join(pre + '}');
  str = str.split(exports.nc[3]).join(',');
  return str.replace(/\\+/g, '\\');
};

/**
 * Cast `val` to an array.
 * @param {*} `val`
 */

exports.arrayify = function(arr) {
  if (typeof arr === 'undefined') return [];
  return Array.isArray(arr) ? arr : [arr];
};

/**
 * Cast `val` to an array.
 * @param {*} `val`
 */

exports.stringify = function(arr) {
  return exports.arrayify(arr).join('|');
};

/**
 * Returns true if the given `str` is a non-empty string
 * @return {Boolean}
 */

exports.isString = function(str) {
  return str && typeof str === 'string';
};

/**
 * Create a negation regex from the given string
 * @param {String} `str`
 * @return {RegExp}
 */

exports.not = function(str) {
  return '^((?!(?:' + str + ')).)+';
};

/**
 * Get the last element from `array`
 * @param {Array} `array`
 * @return {*}
 */

exports.last = function(arr) {
  return arr[arr.length - 1];
};

exports.escapeRegex = function(str) {
  return str.replace(/\\?([!$^*?()\[\]{}+?/])/g, '\\$1');
};
