'use strict';

/**
 * Session cache
 */

exports.cache = {};

/**
 * Module dependencies
 */

exports.define = require('define-property');
exports.extend = require('extend-shallow');
exports.flatten = require('arr-flatten');
exports.isObject = require('isobject');
exports.range = require('fill-range');
exports.repeat = require('repeat-element');
exports.unique = require('array-unique');

/**
 * Normalize options
 */

exports.createOptions = function(options) {
  var opts = exports.extend.apply(null, arguments);
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
    if (Array.isArray(str)) {
      str = str.map(function(ele) {
        return exports.join(ele, b);
      });
      arr.push(str);
      continue;
    }

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

/**
 * Split the given string on `,` if not escaped.
 */

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

/**
 * Expand ranges or sets in the given `pattern`.
 *
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object}
 */

exports.expand = function(str, options) {
  var opts = exports.extend({limit: 100}, options);
  var tok = exports.split(str);
  var segs = tok.segs;

  if (segs.length > 1) {
    if (opts.optimize === false) {
      tok.val = segs[0];
      return tok;
    }

    tok.segs = exports.stringify(tok.segs);
  } else if (segs.length === 1) {
    var arr = str.split('..');

    if (arr.length === 1) {
      tok.segs = [];
      tok.val = str;
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
      }

      if (opts.optimize !== true) {
        var min = Math.min(arr[0], arr[1]);
        var max = Math.max(arr[0], arr[1]);
        var step = arr[2] || 1;
        if (((max - min) / step) >= opts.limit) {
          opts.optimize = true;
        }
      }

      arr.push(opts);
      tok.segs = exports.range.apply(null, arr);

      if (!tok.segs.length) {
        tok.escaped = true;
        tok.val = str;
        return tok;
      }

      if (opts.optimize === true) {
        tok.segs = exports.stringify(tok.segs);
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

exports.stringify = function(arr) {
  return [exports.arrayify(arr).join('|')];
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
 * Returns true if the given `str` is a non-empty string
 * @return {Boolean}
 */

exports.isString = function(str) {
  return str != null && typeof str === 'string';
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
