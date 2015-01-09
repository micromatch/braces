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
  var match = regex().exec(str);

  if (match == null) {
    // if comma is escaped, return sans slashes
    return [str.replace(/,\\/, ',')];
  }

  // return if it looks like a bash or es6 variable
  // if (str.indexOf('${') === 0) {
  //   return arr.concat([str]);
  // }

  // if brace is escaped, return sans slashes
  if (str.indexOf('\\') === 0) {
    return [str.slice(1)];
  }

  if (typeof arr === 'function') {
    fn = arr;
    arr = [];
  }

  arr = arr || [];
  var paths;

  // if `..` exists, pass to [expand-range]
  if (/[^\\\/]\.{2}/.test(match[2])) {
    paths = expand(match[2], fn);
  } else {
    if (match[2] === '') {
      return [str];
    }
    paths = match[2].split(',');
  }

  var len = paths.length;
  var i = 0, val, idx;

  while (len--) {
    var path = paths[i++];
    val = splice(str, match[1], path);
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

/**
 * Braces regex.
 */

function regex() {
  return /.*(\{([^\\}]*)\})/g;
}

/**
 * Faster alternative to `String.replace()`
 */

function splice(str, token, replacement) {
  var i = str.indexOf(token);
  if (i === -1) {
    return i;
  }

  var end = i + token.length;
  return str.substr(0, i)
    + replacement
    + str.substr(end);
}
