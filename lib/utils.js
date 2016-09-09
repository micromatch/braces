'use strict';

exports.define = require('define-property');
exports.extend = require('extend-shallow');
exports.unique = require('array-unique');

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
  return '^((?!(?:' + str + ')).)*';
};

/**
 * Get the last element from `array`
 * @param {Array} `array`
 * @return {*}
 */

exports.last = function(arr) {
  return arr[arr.length - 1];
};
