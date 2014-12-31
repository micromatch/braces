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

var expandRange = require('expand-range');

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
  if (typeof str !== 'string') {
    throw new Error('braces expects a string');
  }

  arr = arr || [];

  var matches = str.match(/\$\\\{|\$\{|\\\{|['"]|[\\\/]\.{1,2}|\.\.|\\,|,/) || [];
  var m = matches[0];
  var ii = matches.index;

  if (m === '\\,') {
    return [replaceAll(str, ii, 1, '', '\\')];
  }

  if (m === '$\\{') {
    return arr.concat(str.slice(0, ii) + '$' + str.slice(ii + 2));
  }

  if (m === '\\{') {
    return arr.concat(str.slice(1));
  }

  if (m === '${') {
    var res = str.replace(/\$\{/g, '$\\{');
    return arr.concat(braces(res, arr));
  }

  var match = regex().exec(str);
  if (match == null) {
    return [str];
  }

  if (typeof arr === 'function') {
    fn = arr;
    arr = [];
  }

  var outter = match[2];
  var inner = match[3];
  var paths;

  if (/[^\\\/]\.\./.test(inner)) {
    paths = expandRange(inner, fn);
  } else if (inner === '') {
    return [str];
  } else if (inner[0] === '"' || inner[0] === '\'') {
    var re = /^'(?:[^'\\]*\\.)*([^']*)'|"(?:[^"\\]*\\.)*([^"]*)"/;
    var comment = re.exec(str);
    str = splice(str, wrap(comment[0]), '\\' + wrap(comment[2]));
    return braces(str, arr);
  } else {
    paths = inner.split(',');
  }

  var len = paths.length;
  var i = 0, val, idx;

  while (len--) {
    val = splice(str, outter, paths[i++]);
    idx = val.indexOf('{');
    var right = val.indexOf('}', idx + 1);
    var es6 = val[idx - 1];

    if (idx !== -1 && es6 !== '$') {
      if (right === -1) {
        arr = arr.concat(val);
        // var msg = '[braces] imbalanced braces. Cannot expand `' + str + '`.';
        // throw new Error(msg);
      } else {
        arr = braces(val, arr);
      }
    } else if (arr.indexOf(val) === -1) {
      arr.push(val);
    }
  }
  return arr;
}

/**
 * Braces regex.
 */

function regex() {
  return /(.*)(\{([^\\}]*)\})/g;
}

/**
 * Wrap the given string with braces.
 */

function wrap(str) {
  return '{' + str + '}';
}

/**
 * Braces regex.
 */

function escape(str, outter) {
  return str.replace(outter, '__^' + outter + '^__');
}

/**
 * Braces regex.
 */

function unescape(val) {
  val = splice(val, '__^', '{');
  val = splice(val, '^__', '}');
  return val
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
    + str.substr(end, str.length);
}

/**
 * Faster alternative to `String.replace()`
 */

function replace(str, i, len, replacement) {
  var end = i + len;
  return str.substr(0, i)
    + replacement
    + str.substr(end);
}

/**
 * Faster alternative to `String.replace()`
 */

function replaceAll(str, i, len, replacement, token) {
  str = replace(str, i, len, replacement);
  i = str.indexOf(token);
  if (i !== -1) {
    return replaceAll(str, i, len, replacement, token);
  }
  return str;
}
