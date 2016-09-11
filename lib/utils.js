'use strict';

exports.range = require('fill-range');
exports.define = require('define-property');
exports.extend = require('extend-shallow');
exports.unique = require('array-unique');

exports.expand = function(str) {
  var segs = str.split(',').filter(Boolean);
  var arr = segs.slice();

  if (segs.length > 1 && str.indexOf('..') !== -1) {
    return segs.join('|');
  }

  if (arr.length === 1) {
    arr = str.split('..');

    if (arr.length > 1) {
      arr.push({optimize: true});
      return exports.range.apply(null, arr);
    }
  }
  return segs.join('|');
};

exports.isValidRange = function() {

};

/**
 * Cast `val` to an array.
 * @param {*} `val`
 */

exports.arrayify = function(arr) {
  return arr ? (Array.isArray(arr) ? arr : [arr]) : [];
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
