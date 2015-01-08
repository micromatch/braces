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

  var matches = str.match(/\$|\}[ \t]\{|\\\{|['"]|[\\\/]\.\.|\\,/) || [];
  // var matches = str.match(/\$| |\\\{|['"]|[\\\/]\.\.|\\,/) || [];
  var m = matches[0];
  var range = false;
  var cache = {};
  var c = 0;

  if (m === '$') {
    if (!/\{[^{]*\{/.test(str)) {
      return arr.concat(str);
    } else {
      var match = es6Regex().exec(str);
      cache[c] = match;
      // replace variable with a heuristic
      str = str.replace(match[0], '__ID' + c + '__');
      c++;
    }
  }

  if (m === '\\{') {
    return arr.concat(str.slice(1));
  }

  if (m === '} {') {
    return arr.concat(braces(wrap(str.replace(' ', ','), arr)).sort());
  }

  // if (m === ' ') {
  //   return arr.concat(expandSpaces(str, arr));
  // }

  if (m === '\\,') {
    return [replaceAll(str, matches.index, 1, '', '\\')];
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
    try {
      paths = expandRange(inner, fn);
    } catch(err) {
      return [str];
    }
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
  var i = 0, val;

  while (len--) {
    var path = paths[i++];
    val = splice(str, outter, path);

    if (/\{.*\}/.test(val)) {
      arr = braces(val, arr);
    } else if (arr.indexOf(val) === -1) {
      var id = val.match(/__ID(\d*)/);
      if (id) {
        var re = new RegExp('__ID' + id[1] + '__', 'g');
        val = val.replace(re, cache[id[1]][0]);
      }
      arr.push(val);
    }
  }
  return arr;
}

function expandSpaces(str, arr) {
  var segments = str.split(/[ \t]/);
  if (segments.length) {
    var len = segments.length;
    var i = 0;

    while (len--) {
      var segment = segments[i++];
      arr = arr.concat(braces(segment, arr));
    }
  console.log(arr)
    return arr;
    // return expandSpaces(segments);
  }

  // return str.split(' ')
  //   .reduce(function (acc, ele) {
  //     return acc.concat(braces(ele, acc))
  //   }, []);
}

/**
 * Braces regex.
 */

function regex() {
  return /(.*)(\{([^{}]*)\})/;
}

/**
 * Braces regex.
 */

function es6Regex() {
  return /\$\{([^\\}]*)\}/;
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
