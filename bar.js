/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module dependencies
 */

var expand = require('expand-range');

/**
 * Expose `braces`
 */

module.exports = function (str, fn) {
  return braces(str, fn);
};

/**
 * Expand `{braces,bar}` or `{1..5}` braces in the
 * given `string`.
 *
 * @param  {String} `str`
 * @param  {Array} `arr`
 * @return {Array}
 */

function braces(str, arr, fn) {
  if (typeof str !== 'string') {
    throw new TypeError('expand-range expects a string.');
  }

  var match = regex().exec(str);
  if (!match) {
    return [str.replace(/\\,/g, ',')];
  }

  // return if it looks like a bash or es6 variable
  if (str.indexOf('${') === 0) {
    return arr.concat([str]);
  }

  if (typeof arr === 'function') {
    fn = arr;
    arr = [];
  }

  arr = arr || [];
  var outter = match[1];
  var inner = match[2];
  var paths;

  // if `..` exists, pass to [expand-range]
  if (/[^\\\/]\.{2}/.test(inner)) {
    paths = expand(inner, fn);
  } else {
    if (inner === '') {
      return [str];
    }
    paths = inner.split(',');
  }


  var len = paths.length;
  var i = 0, val, idx;

  while (len--) {
    val = splice(str, outter, paths[i++]);
    idx = val.indexOf('{');

    if (idx !== -1) {
      arr = braces(val, arr);
    } else {
      // push into the array, but avoid duplicates
      if (arr.indexOf(val) === -1) {
        arr.push(val);
      }
    }
  }

  return arr;
}

var cache;

/**
 * Braces regex.
 */

function regex() {
  return /.*(\{([^}\\]*)\})/g;
}

/**
 * Faster alternative to `String.replace()`
 */

function splice(str, token, replacement) {
  var i = str.indexOf(token);
  var end = i + token.length;
  return str.substr(0, i)
    + replacement
    + str.substr(end);
}
