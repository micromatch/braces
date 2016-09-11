'use strict';

exports.range = require('fill-range');
exports.define = require('define-property');
exports.extend = require('extend-shallow');
exports.unique = require('array-unique');

exports.expand = function(str) {
  var segs = exports.split(str);
  if (segs.length > 1) {
    return segs.join('|');
  }

  if (segs.length === 1) {
    var arr = str.split('..');

    if (arr.length > 1) {
      arr.push({optimize: true});
      var res = exports.stringify(exports.range.apply(null, arr));
      if (res === '') {
        return str;
      }
      return res;
    }
  }
  return str;
};

exports.split = function(str) {
  var segs = str.split(',');
  var res = [];

  while (segs.length) {
    var key = segs.shift();
    while (key.slice(-1) === '\\') {
      key = key.slice(0, -1) + ',' + segs.shift();
    }
    res.push(key);
  };
  return res;
};

/**
 * Cast `val` to an array.
 * @param {*} `val`
 */

exports.arrayify = function(arr) {
  return arr ? (Array.isArray(arr) ? arr : [arr]) : [];
};

/**
 * Cast `val` to an array.
 * @param {*} `val`
 */

exports.stringify = function(arr) {
  return exports.arrayify(arr).join('|');
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
