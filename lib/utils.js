'use strict';

exports.flatten = require('arr-flatten');
exports.range = require('fill-range');
exports.define = require('define-property');
exports.extend = require('extend-shallow');
exports.unique = require('array-unique');

exports.expand = function(str, options) {
  options = options || {};
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
      var res = exports.range.apply(null, arr);
      if (options.stringify !== false) {
        res = exports.stringify(res);
      }
      if (res === '') {
        tok.val = str;
      } else {
        tok.val = res;
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

    if (key.slice(0, 2) === '\\{') {
      tok.escaped = true;
      tok.rest = [key].concat(segs).join(',');
      segs = [];
      break;
    }
    res.push(key);
  };

  tok.segs = res;
  return tok;
};

/**
 * Cast `val` to an array.
 * @param {*} `val`
 */

exports.arrayify = function(arr) {
  if (typeof arr === 'undefined') {
    return [];
  }
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
