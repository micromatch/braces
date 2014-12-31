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
 * Expand brace patterns in the given `string`.
 *
 * @param  {String} `string`
 * @param  {Function} `fn`
 * @return {Array}
 */

module.exports = function braces(str, arr, fn) {
  if (typeof str !== 'string') {
    throw new TypeError('braces expects a string as the first argument.');
  }

  var matches = /\\|\$\{|(?:[\\\/]\.)|['"]|\.\./.exec(str);
  if (matches) {
    var first = matches[0];
    var idx = matches.index;

    if (first === '\'' || first === '"') {

    }
    if (first === '\\') {
      str = replaceAll(str, idx, 1, '', '\\');
      return [str];
    }
    if (first === '${') {
      return [str];
  // console.log(matches)
    }
    if (first === '/.') {

    }
  }

  // if brace is escaped, return without slashes
  // var slashes = str.indexOf('\\');
  // if (slashes !== -1) {
  //   str = replaceAll(str, slashes, 1, '', '\\');
  //   return [str];
  // }

  var match = str.match(bracesRegex());
  // if (match == null || /\$\{/.test(match[0])) {
  if (match == null) {
    return [str];
  }

  // var commentRe = /^'([^'\\]*\\.)*[^']*'|"([^"\\]*\\.)*[^"]*"/;
  // var comment = commentRe.exec(str);
  // // console.log(comment)
  // // if (comment !== -1) {
  // //   str = replaceAll(str, comment, 1, '', '\\');
  // //   return [str];
  // // }

  if (typeof arr === 'function') {
    fn = arr;
    arr = [];
  }

  arr = arr || [];
  var paths;
  var inner = match[2];
  var dots = inner.indexOf('..');

  // if `..` exists, pass to [expand-range]
  if (dots !== -1 && !/[\\\/]\./.test(inner)) {
    paths = expandRange(inner, fn);
  } else if (inner === '') {
    return [str];
  } else {
    paths = inner.split(',');
  }

  // return invalid paths on an object
  if (typeof paths === 'object' && !Array.isArray(paths)) {
    return paths.bad;
  }

  var len = paths.length;
  var i = 0, val, idx;

  while (len--) {
    val = splice(str, match[1], paths[i++]);
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
};

/**
 * Braces regex.
 */

function bracesRegex() {
  return /^.*(\{([^}]*)\})/;
}

/**
 * Expand brace patterns with spaces. In command line
 * applications, like Bash, spaces are used as parameter
 * separators. But in file paths we can't make the same
 * assumption.
 *
 * @param {String} `str`
 * @return {Array} Array of expanded strings
 */

function expandSpaces(str, options) {
  // var segments = str.split(/[ \t]/);
  // if (segments.length) {
  //   var len = segments.length;
  //   var i = 0;

  //   while (len--) {
  //     var segment = segments[i++];
  //     arr = arr.concat(braces(segment, arr));
  //   }
  //   return arr;
  //   // return expandSpaces(segments);
  // }
  console.log(str)

  return str.split(' ')
    .reduce(function (acc, ele) {
      console.log(arguments)
      acc = acc.concat(braces(ele, arr))
      return acc
    }, []);
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
