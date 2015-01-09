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

module.exports = function (str, options) {
  return braces(str, options);
};

/**
 * Expand `{foo,bar}` or `{1..5}` braces in the
 * given `string`.
 *
 * @param  {String} `str`
 * @param  {Array} `arr`
 * @return {Array}
 */

function braces(str, arr, options) {
  if (typeof str !== 'string') {
    throw new Error('braces expects a string');
  }

  if (!Array.isArray(arr)) {
    options = arr;
    arr = [];
  }

  var fn = typeof options === 'function'
    ? options
    : options && options.fn;

  options = options || {};
  arr = arr || [];

  var matches = str.match(patternRe()) || [];
  var m = matches[0];
  var cache = null;
  var c = 0;

  if (m === '$') {
    if (!/\{[^{]*\{/.test(str)) {
      return arr.concat(str);
    } else {
      // str = makeId(str, cache, c);
      var mm = es6Regex().exec(str);
      cache = cache || {};
      cache[c] = mm;
      str = str.replace(mm[0], '__ID' + c + '__');
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

  var outter = match[1];
  var inner = match[2];
  var paths;

  if (/[^\\\/]\.{2}/.test(inner)) {
    try {
      paths = expandRange(inner, options);
    } catch(err) {
      return [str];
    }
  } else if (inner === '') {
    return [str];
  } else if (inner[0] === '"' || inner[0] === '\'') {
    return braces(escapeComment(str), arr);
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
      if (cache) {
        val = replaceId(val, cache);
      }
      arr.push(val);
    }
  }

  if (options.strict) {
    arr = arr.filter(function (ele) {
      return ele !== '\\';
    }).filter(Boolean);
  }

  // if (options.regexString) {
  //   return '(' + arr.join('|') + ')';
  // }

  return arr;
}

/**
 * Expand spaces into brace expressions.
 */

function expandSpaces(str, arr) {
  var segments = str.split(/[ \t]/);
  if (segments.length) {
    var len = segments.length;
    var i = 0;

    while (len--) {
      var segment = segments[i++];
      arr = arr.concat(braces(segment, arr));
    }
    return arr;
  }
}

/**
 * Escape commented patterns.
 */

function escapeComment(str) {
  var comment = commentRe().exec(str);
  return splice(str, wrap(comment[0]), '\\' + wrap(comment[2]));
}

/**
 * Create a heuristic ID to temporarily replace
 * the variable
 */

function makeId(str, cache, c) {
  var mm = es6Regex().exec(str);
  cache = cache || {};
  cache[c] = mm;
  return str.replace(mm[0], '__ID' + c + '__');
}

/**
 * Replace heuristics with the original brace string.
 */

function replaceId(val, cache) {
  var id = val.match(/__ID(\d*)/);
  if (id) {
    var idRegex = new RegExp('__ID' + id[1] + '__', 'g');
    val = val.replace(idRegex, cache[id[1]][0]);
  }
  return val;
}

/**
 * Regex for common patterns
 */

function commentRe() {
  return /^'(?:[^'\\]*\\.)*([^']*)'|"(?:[^"\\]*\\.)*([^"]*)"/;
}

/**
 * Regex for common patterns
 */

function patternRe() {
  return /\$|\}[ \t]\{|\{['"]|\\\{|\\,/;
}

/**
 * Braces regex.
 */

function regex() {
  return /.*(\{([^}]*)\})/;
}

/**
 * es6 delimiter regex.
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
 * Faster alternative to `String.replace()` when the
 * index of the token to be replaces can't be supplied
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
 * Faster alternative to `String.replace()` when the
 * index of the string can be supplied.
 */

function replace(str, i, len, replacement) {
  var end = i + len;
  return str.substr(0, i)
    + replacement
    + str.substr(end);
}

/**
 * Faster alternative to `String.replace()` with `g` flag
 */

function replaceAll(str, i, len, replacement, token) {
  str = replace(str, i, len, replacement);
  i = str.indexOf(token);
  if (i !== -1) {
    return replaceAll(str, i, len, replacement, token);
  }
  return str;
}
