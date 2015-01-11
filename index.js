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

var filter = require('arr-filter');
var expandRange = require('expand-range');
var tokens = require('preserve');

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

  if (str === '') {
    return [];
  }

  if (!Array.isArray(arr)) {
    options = arr;
    arr = [];
  }

  options = options || {};
  arr = arr || [];

  if (typeof options.nodupes === 'undefined') {
    options.nodupes = true;
  }

  var fn = options.fn;
  var es6;

  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  var matches = str.match(patternRe()) || [];
  var m = matches[0];

  if (m === '{,}') {
    return rangeify(str, options);
  }

  if (m === '{}') {
    return emptyBraces(str, arr);
  }

  if (m === '\\,') {
    return escapeCommas(str, arr);
  }

  if (m === '\\.') {
    return escapeDots(str, arr);
  }

  if (m === '\\{' || m === '\\}') {
    return escapeBraces(str, arr);
  }

  if (m === '} {') {
    return splitWhitespace(str, arr);
  }

  if (m === '${') {
    if (!/\{[^{]*\{/.test(str)) {
      return arr.concat(str);
    } else {
      es6 = true;
      str = tokens.before(str, es6Regex());
    }
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
      paths = expandRange(inner, fn || options.makeRe);
    } catch(err) {
      if (/,/.test(str)) {
        return str.replace(/\{|\}/g, '').split(',');
      }
      return [str];
    }
  } else if (inner === '') {
    return [str];
  } else if (inner[0] === '"' || inner[0] === '\'') {
    return arr.concat(str.replace(/['"]/g, ''));
  } else {
    paths = inner.split(',');
  }

  var len = paths.length;
  var i = 0, val;

  while (len--) {
    var path = paths[i++];

    if (/\.[^.\\\/]/.test(path)) {
      return [str];
    }

    val = splice(str, outter, path);

    if (/\{.*\}/.test(val)) {
      arr = braces(val, arr);
    } else if (val !== '') {
      if (options.nodupes && arr.indexOf(val) !== -1) {
        continue;
      }

      if (es6) {
        val = tokens.after(val);
      }
      arr.push(val);
    }
  }

  if (options.strict) {
    return filter(arr, function (ele) {
      return ele !== '\\' && ele !== '' && ele != null;
    });
  }
  return arr;
}

function emptyBraces(str, arr) {
  str = str.replace(/\{\}/g, '##');
  return braces(str, arr).map(function (ele) {
    return ele.replace(/##/g, '{}');
  });
}

function splitWhitespace(str, arr) {
  var res = braces(wrap(str.replace(' ', ','), arr));
  return arr.concat(res).sort();
}

function escapeBraces(str, arr) {
  if (!/\{[^{]*\{/.test(str)) {
    return arr.concat(str.replace(/\\/g, ''));
  } else {
    str = str.replace(/\\{/g, '%#');
    str = str.replace(/\\}/g, '#%');

    return braces(str, arr).map(function (ele) {
      ele = ele.replace(/%#/g, '{');
      ele = ele.replace(/#%/g, '}');
      return ele;
    });
  }
}

function escapeDots(str, arr) {
  if (!/[^\\]\..*\\\./.test(str)) {
    return arr.concat(str.replace(/\\/g, ''));
  } else {
    str = str.replace(/\\\./g, '%~');
    return braces(str, arr).map(function (ele) {
      return ele.replace(/%~/g, '.');
    });
  }
}

function escapeCommas(str, arr) {
  if (!/\w,/.test(str)) {
    return arr.concat(str.replace(/\\/g, ''));
  } else {
    str = str.replace(/\\,/g, '%%');
    return braces(str, arr).map(function (ele) {
      return ele.replace(/%%/g, ',');
    });
  }
}

function makeRange(str, num) {
  return '{' + str + '..' + num + '..+}';
}

function rangeify(str, options) {
  options = options || {};
  var rep = str.replace(/\{,}/g, '0x27740x27000x2775');
  var res = braces(rep, options);
  var len = res.length;
  var i = 0;
  var re = powRe();
  var arr = [];

  while (len--) {
    var ele = res[i++];
    var match = ele.match(re);
    if (match) {
      var num = Math.pow(2, match.length);
      ele = makeRange(ele.replace(re, ''), num);
      arr.push.apply(arr, braces(ele, options));
    } else {
      arr.push(ele);
    }
  }
  return arr;
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
  return /\$\{|} {|{}|{,}|\\,|\\\.|\\{|\\}/;
}

/**
 * Braces regex.
 */

function regex() {
  return /.*(\{([^}]+)\})/;
}

/**
 * es6 delimiter regex.
 */

function es6Regex() {
  return /\$\{([^}]+)\}/;
}

/**
 * Regex for exponent Power syntax
 */

function powRe() {
  return /0x27740x27000x2775/g;
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
