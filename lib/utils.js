'use strict';

var utils = module.exports;

/**
 * Module dependencies
 */
utils.clone = require('clone-deep');
utils.define = require('define-property');
utils.extend = require('extend-shallow');
utils.flatten = require('arr-flatten');
utils.isObject = require('isobject');
utils.range = require('fill-range');
utils.repeat = require('repeat-element');
utils.unique = require('array-unique');
var Cache = require('fragment-cache');
var cache = new Cache();

/**
 * Create the key to use for memoization. The key is generated
 * by iterating over the options and concatenating key-value pairs
 * to the pattern string.
 */

utils.createKey = function(pattern, options) {
  var key = pattern;
  if (typeof options === 'undefined') {
    return key;
  }
  for (var prop in options) {
    if (options.hasOwnProperty(prop)) {
      key += ';' + prop + '=' + String(options[prop]);
    }
  }
  return key;
}

/**
 * Memoize a generated regex or function
 */

utils.memoize = function(type, pattern, options, fn) {
  var key = utils.createKey(type + pattern, options);

  if (cache.has(type, key)) {
    return cache.get(type, key);
  }

  var val = fn(pattern, options);
  if (options && options.cache === false) {
    return val;
  }

  cache.set(type, key, val);
  return val;
};

/**
 * Normalize options
 */

utils.createOptions = function(options) {
  var opts = utils.extend.apply(null, arguments);
  if (typeof opts.expand === 'boolean') {
    opts.optimize = !opts.expand;
  }
  if (typeof opts.optimize === 'boolean') {
    opts.expand = !opts.optimize;
  }
  if (opts.optimize === true) {
    opts.makeRe = true;
  }
  return opts;
};

/**
 * Join patterns in `a` to patterns in `b`
 */

utils.join = function(a, b, options) {
  options = options || {};
  a = utils.arrayify(a);
  b = utils.arrayify(b);
  if (!a.length) return b;
  if (!b.length) return a;

  var len = a.length;
  var idx = -1;
  var arr = [];

  while (++idx < len) {
    var str = a[idx];
    if (Array.isArray(str)) {
      str = str.map(function(ele) {
        return utils.join(ele, b);
      });
      arr.push(str);
      continue;
    }

    for (var i = 0; i < b.length; i++) {
      if (Array.isArray(b[i])) {
        arr.push(utils.join(str, b[i]));
      } else {
        arr.push(str + b[i]);
      }
    }
  }
  return arr;
};

/**
 * Split the given string on `,` if not escaped.
 */

utils.split = function(str) {
  var segs = str.split(',');
  var tok = {rest: ''};
  var res = [];

  while (segs.length) {
    var key = segs.shift();
    var next = segs[segs.length - 1];
    var quoted;

    while (key.slice(-1) === '\\' || (quoted = isQuote(key, next))) {
      if (quoted) tok.quoted = true;
      tok.escaped = true;
      var ch = segs.shift();
      key = key.slice(0, -1) + ',' + (quoted ? ch.slice(1) : ch);
    }
    res.push(key);
  }

  if (tok.quoted) {
    tok.val = res[0];
  }

  tok.segs = res;
  return tok;
};

function isDoubleQuote(key, next) {
  return key.slice(-1) === '"' && next.charAt(0) === '"';
}

function isSingleQuote(key, next) {
  return key.slice(-1) === "'" && next.charAt(0) === "'";
}

function isQuote(key, next) {
  return isDoubleQuote(key, next) || isSingleQuote(key, next);
}

/**
 * Expand ranges or sets in the given `pattern`.
 *
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object}
 */

utils.expand = function(str, options) {
  var opts = utils.extend({rangeLimit: 250}, options);
  var tok = utils.split(str);
  var segs = tok.segs;

  if (segs.length > 1) {
    if (opts.optimize === false) {
      tok.val = segs[0];
      return tok;
    }

    tok.segs = utils.stringify(tok.segs);
  } else if (segs.length === 1) {
    var arr = str.split('..');

    if (arr.length === 1) {
      tok.segs = [];
      tok.val = tok.val || str;
      return tok;
    }

    if (arr.length === 2 && arr[0] === arr[1]) {
      tok.escaped = true;
      tok.val = arr[0];
      tok.segs = [];
      return tok;
    }

    if (arr.length > 1) {
      if (opts.optimize !== false) {
        opts.optimize = true;
        delete opts.expand;
      }

      if (opts.optimize !== true) {
        var min = Math.min(arr[0], arr[1]);
        var max = Math.max(arr[0], arr[1]);
        var step = arr[2] || 1;
        if (((max - min) / step) >= opts.rangeLimit) {
          opts.optimize = true;
          tok.isOptimized = true;
          delete opts.expand;
        }
      }

      arr.push(opts);
      tok.segs = utils.range.apply(null, arr);

      if (!tok.segs.length) {
        tok.escaped = true;
        tok.val = str;
        return tok;
      }

      if (opts.optimize === true) {
        tok.segs = utils.stringify(tok.segs);
      }

      if (tok.segs === '') {
        tok.val = str;
      } else {
        tok.val = tok.segs[0];
      }
      return tok;
    }
  } else {
    tok.val = str;
  }
  return tok;
};

/**
 * Cast `val` to an array.
 * @param {*} `val`
 */

utils.stringify = function(arr) {
  return [utils.arrayify(arr).join('|')];
};

/**
 * Cast `val` to an array.
 * @param {*} `val`
 */

utils.arrayify = function(arr) {
  if (typeof arr === 'undefined') return [];
  return Array.isArray(arr) ? arr : [arr];
};

/**
 * Returns true if the given `str` is a non-empty string
 * @return {Boolean}
 */

utils.isString = function(str) {
  return str != null && typeof str === 'string';
};

/**
 * Get the last element from `array`
 * @param {Array} `array`
 * @return {*}
 */

utils.last = function(arr) {
  return arr[arr.length - 1];
};

utils.escapeRegex = function(str) {
  return str.replace(/\\?([!$^*?()\[\]{}+?/])/g, '\\$1');
};
