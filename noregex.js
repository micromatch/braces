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
 * Expand `{foo,bar}` or `{1..5}` braces in the
 * given `string`.
 *
 * @param  {String} `str`
 * @param  {Array} `arr`
 * @return {Array}
 */

function braces(str, arr, fn) {
  var inner = matchBrace(str);
  if (inner == null) {
    return [str];
  }

  var whole = '{' + inner + '}';
  if (typeof str !== 'string') {
    throw new Error('braces expects a string');
  }

  if (typeof arr === 'function') {
    fn = arr;
    arr = [];
  }

  arr = arr || [];
  var paths;

  if (/\.{2}/.test(inner)) {
    paths = expand(inner, fn);
  } else {
    paths = inner.split(',');
  }

  var len = paths.length;
  var i = 0, val, idx;

  while (len--) {
    val = splice(str, whole, paths[i++]);
    idx = val.indexOf('{');

    if (idx !== -1) {
      arr = braces(val, arr);
    } else if (arr.indexOf(val) === -1) {
      arr.push(val);
    }
  }

  return arr;
}

/**
 * Braces regex.
 */

function matchBrace(str) {
  var open = '{';
  var close = '}';
  var matches = [];

  var a = str.indexOf(open);
  var b;
  var i = 0;
  var match;

  function peek() {
    return str.charAt(a + 1);
  }

  while (a !== -1) {
    var ch = str.charAt(i++);
    if (!ch && !peek()) {
      return str;
    }

    a = ch === open ? i : a;
    if (ch === close) {
      b = i - 1;
      match = str.slice(a, b);
      return match;
    }
  }
  return null;
}

/**
 * Faster alternative to `String.replace()`
 */

function splice(str, token, replacement) {
  var i = str.indexOf(token);
  if (i === -1) {
    return str;
  }

  var end = i + token.length;
  return str.substr(0, i)
    + replacement
    + str.substr(end);
}
