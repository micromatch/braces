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
 * expose `braces`
 */

module.exports = braces;

/**
 * Expand brace patterns in the given `string`.
 *
 * @param  {String} `string`
 * @param  {Function} `fn`
 * @return {Array}
 */

function braces(str, arr, fn) {
  if (typeof str !== 'string') {
    throw new TypeError('braces expects a string as the first argument.');
  }

  if (typeof arr === 'function') {
    fn = arr;
    arr = [];
  }

  arr = arr || [];

  // var matches = /\\|\$\{|[\\\/]\.|['"]|\.\./.exec(str);
  // if (matches) {
  //   mm = matches[0];
  //   var idx = matches.index;

  //   // if (mm === '\'' || mm === '"') {

  //   // // var commentRe = /^'([^'\\]*\\.)*[^']*'|"([^"\\]*\\.)*[^"]*"/;
  //   // // var comment = commentRe.exec(str);
  //   // // // console.log(comment)
  //   // // // if (comment !== -1) {
  //   // // //   str = replaceAll(str, comment, 1, '', '\\');
  //   // // //   return [str];
  //   // // // }

  //   // }

  //   // if (mm === '\\') {
  //   //   str = replaceAll(str, idx, 1, '', '\\');
  //   //   return [str];
  //   // }

  //   // if (mm === '${') {
  //   //   if (!/[^\$\\]\{/.test(str)) {
  //   //     return arr.concat(str);
  //   //   }
  //   // }

  //   // if (mm === '..') {
  //   //   paths = true;
  //   // }
  //   // if (mm === '/.') {

  //   // }
  // }

  var match = bracesRegex().exec(str);
  if (match == null) {
    return [str];
  }

  // console.log(match)
  var outter = match[1];
  var inner = match[3];
  // var olen = outter.length;
  var pos = match.index;
  var i = 0, val;
  var paths;

  // if (outter[olen - 1] === '$') {
  //   return arr.concat(str);
  // }

  // if (/\\/.test(inner)) {
  //   str = splice(str, '\\', '');
  //   return [str];
  // }

  // if `..` exists, pass to [expand-range]
  if (/[^\\\/]\.\./.test(inner)) {
    paths = expandRange(inner, fn);
  } else if (inner === '') {
    return [str];
  } else {
    paths = inner.split(',');
  }

  var len = paths.length;
  while (len--) {
    val = splice(str, match[2], paths[i++]);
    var idx = val.indexOf('{', pos + 1);

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
  return /(.*)[^\$]*(\{([^}]*)\})/;
}

/**
 * Faster alternative to `String.replace()`
 */

function splice(str, token, replacement, start) {
  var i = str.indexOf(token, start);
  if (i === -1) {
    return str;
  }

  return str.substr(0, i)
    + replacement
    + str.substr(i + token.length);
}

/**
 * Faster alternative to `String.replace()`
 */

// function splice(str, token, replacement) {
//   var i = str.indexOf(token);
//   return str.substr(0, i)
//     + replacement
//     + str.substr(i + token.length);
// }

/**
 * Faster alternative to `String.replace()`
 */

function replace(str, i, len, replacement) {
  return str.substr(0, i)
    + replacement
    + str.substr(i + len);
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
