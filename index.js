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

    if (/\\,/g.test(str)) {
      // if comma is escaped, return sans slashes
      return [str.replace(/\\/, '')];
    }
    // if no braces are found, return the string
    return [str];
  }

  if (/[ \t]/.test(str)) {
    var segs = str.split(' ');
    return segs.reduce(function (acc, ele) {
      acc = acc.concat(braces(ele))
      return acc
    }, []);
  }

  // return if it looks like a bash or es6 variable
  if (str.indexOf('${') === 0) {
    return [str];
  }

  // if brace is escaped, return sans slashes
  if (str.indexOf('\\') === 0) {
    return [str.slice(1)];
  }


  // var left = str.indexOf('{"');
  // var right = str.indexOf('"}');
  // if (left !== -1 && right !== -1) {
  //   str = splice(str, '"', '');
  //   str = splice(str, '"', '');
  //   str = '\\' + str;
  //   console.log(str);
  //   // var res = '{' + str.substr(left + 2, right - 3) + '}';
  //   // return braces(res + str.substr(right));
  // }

  if (typeof arr === 'function') {
    fn = arr;
    arr = [];
  }

  arr = arr || [];
  var paths;

  // if `..` exists, pass to [expand-range]
  if (/\.{2}/.test(match[2])) {
    paths = expand(match[2], fn);
    // return invalid paths on an object
    if (typeof paths === 'object' && !Array.isArray(paths)) {
      return paths.bad;
    }
  } else {
    if (match[2] === '') {
      return [str];
    }

    paths = match[2].split(',');
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
  var end = i + token.length;
  return str.substr(0, i)
    + replacement
    + str.substr(end, str.length);
}

// console.log(braces("{a,b}{{a,b},a,b}"))
