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

  if (!(patternRe instanceof RegExp)) {
    patternRe = patternRegex();
  }

  var matches = str.match(patternRe) || [];
  var m = matches[0];

  switch(m) {
    case '\\,':
      return escapeCommas(str, arr);
    case '\\.':
      return escapeDots(str, arr);
    case '} {':
      return splitWhitespace(str, arr);
    case '{,}':
      return rangeify(str, options);
    case '{}':
      return emptyBraces(str, arr);
    case '\\{':
    case '\\}':
      return escapeBraces(str, arr);
    case '${':
      if (!/\{[^{]+\{/.test(str)) {
        return arr.concat(str);
      } else {
        es6 = true;
        str = tokens.before(str, es6Regex());
      }
  }

  if (!(braceRe instanceof RegExp)) {
    braceRe = braceRegex();
  }

  var match = braceRe.exec(str);
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
    if (/\{.+\}/.test(val)) {
      arr = braces(val, arr);
    } else if (val !== '') {
      if (options.nodupes && arr.indexOf(val) !== -1) {
        continue;
      }

      arr.push(es6 ? tokens.after(val) : val);
    }
  }

  if (options.strict) {
    return filter(arr, function (ele) {
      return ele !== '\\' && ele !== '' && ele != null;
    });
  }
  return arr;
}

/**
 * Handle empty braces: `{}`
 */

function emptyBraces(str, arr) {
  str = str.replace(/\{\}/g, '##');
  return map(braces(str, arr), function (ele) {
    return ele.replace(/##/g, '{}');
  });
}

/**
 * Handle patterns with whitespace
 */

function splitWhitespace(str, arr) {
  var res = braces(wrap(str.replace(' ', ','), arr));
  return arr.concat(res).sort();
}

/**
 * Handle escaped braces: `\\{foo,bar}`
 */

function escapeBraces(str, arr) {
  if (!/\{[^{]+\{/.test(str)) {
    return arr.concat(str.replace(/\\/g, ''));
  } else {
    str = str.replace(/\\{/g, '%#~');
    str = str.replace(/\\}/g, '~#%');
    return map(braces(str, arr), function (ele) {
      ele = ele.replace(/%#~/g, '{');
      return ele.replace(/~#%/g, '}');
    });
  }
}

/**
 * Handle escaped dots: `{1\\.2}`
 */

function escapeDots(str, arr) {
  if (!/[^\\]\..+\\\./.test(str)) {
    return arr.concat(str.replace(/\\/g, ''));
  } else {
    str = str.replace(/\\\./g, '%~~');
    return map(braces(str, arr), function (ele) {
      return ele.replace(/%~~/g, '.');
    });
  }
}

/**
 * Handle escaped commas: `{a\\,b}`
 */

function escapeCommas(str, arr) {
  if (!/\w,/.test(str)) {
    return arr.concat(str.replace(/\\/g, ''));
  } else {
    str = str.replace(/\\,/g, '%~%');
    return map(braces(str, arr), function (ele) {
      return ele.replace(/%~%/g, ',');
    });
  }
}

/**
 * Create and expand range patterns: `a{,}{,}`
 */

function rangeify(str, options) {
  options = options || {};
  var rep = str.replace(/\{,}/g, '0x27740x27000x2775');
  var res = braces(rep, options);
  var len = res.length;
  var i = 0;
  var arr = [];

  if (!(powRe instanceof RegExp)) {
    powRe = powRegex();
  }

  while (len--) {
    var ele = res[i++];
    var match = ele.match(powRe);
    if (match) {
      ele = ele.replace(powRe, '');
      if (options.nodupes && ele != '') {
        arr.push(ele);
      } else {
        var num = Math.pow(2, match.length);
        while (num--) {
          if (ele != '') arr.push(ele);
        }
      }
    } else {
      arr.push(ele);
    }
  }
  return arr;
}

/**
 * Regex for common patterns
 */

function patternRegex() {
  return /\$\{|} {|{}|{,}|\\,|\\\.|\\{|\\}/;
}

/**
 * Braces regex.
 */

function braceRegex() {
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

function powRegex() {
  return /0x27740x27000x2775/g;
}

/**
 * Regex caches
 */

var powRe;
var braceRe;
var patternRe;

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
  return str.substr(0, i) + replacement
    + str.substr(i + token.length);
}

/**
 * Faster array map
 */

function map(arr, fn) {
  if (arr == null) {
    return res;
  }

  var len = arr.length;
  var res = [];
  var i = -1;

  while (++i < len) {
    res[i] = fn(arr[i], i);
  }

  return res;
}
