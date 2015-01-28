/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module dependencies
 */

var typeOf = require('kind-of');
var filter = require('arr-filter');
var expand = require('expand-range');
var tokens = require('preserve');

/**
 * Expose `braces`
 */

module.exports = function (str, options, fn) {
  if (typeof str !== 'string') {
    throw new Error('braces expects a string');
  }
  return braces(str, options, fn);
};

/**
 * Expand `{foo,bar}` or `{1..5}` braces in the
 * given `string`.
 *
 * @param  {String} `str`
 * @param  {Array} `arr`
 * @param  {Object} `options`
 * @return {Array}
 */

function braces(str, opts, fn, arr) {
  if (str === '') { return []; }

  if (typeOf(opts) !== 'object') {
    arr = fn; fn = opts; opts = {};
  }

  if (typeOf(fn) !== 'function') {
    arr = fn; fn = null;
  }

  opts = opts || {};
  arr = arr || [];
  fn = fn || opts.fn;
  var es6;

  if (typeof opts.nodupes === 'undefined') {
    opts.nodupes = true;
  }

  if (!(patternRe instanceof RegExp)) {
    patternRe = patternRegex();
  }

  var matches = str.match(patternRe) || [];
  var m = matches[0];

  switch(m) {
    case '\\,':
      return escapeCommas(str, opts, arr);
    case '\\.':
      return escapeDots(str, opts, arr);
    case '} {':
      return splitWhitespace(str, opts, arr);
    case '{,}':
      return rangeify(str, opts, arr);
    case '{}':
      return emptyBraces(str, opts, arr);
    case '\\{':
    case '\\}':
      return escapeBraces(str, opts, arr);
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
  if (inner === '') {
    return [str];
  }

  var paths;

  if (/[^\\\/]\.{2}/.test(inner)) {
    paths = expand(inner, opts, fn) || inner.split(',');
  } else if (inner[0] === '"' || inner[0] === '\'') {
    return arr.concat(str.replace(/['"]/g, ''));
  } else {
    paths = inner.split(',');
    if (opts.makeRe) {
      var res = wrap(paths, '|');
      return braces(str.replace(outter, res), opts);
    }
  }

  var len = paths.length;
  var i = 0, val;

  while (len--) {
    var path = paths[i++];

    if (/\.[^.\\\/]/.test(path)) {
      if (paths.length > 1) {
        return paths;
      }
      return [str];
    }

    val = splice(str, outter, path);

    if (/\{.+\}/.test(val)) {
      arr = braces(val, opts, arr);
    } else if (val !== '') {

      if (opts.nodupes && arr.indexOf(val) !== -1) { continue; }
      arr.push(es6 ? tokens.after(val) : val);
    }
  }

  if (opts.strict) {
    return filter(arr, function (ele) {
      return ele !== '\\' && ele !== '' && ele != null;
    });
  }
  return arr;
}

function wrap(arr, sep) {
  if (sep === '|') {
    return '(' + arr.join(sep) + ')';
  }
  if (sep === ',') {
    return '{' + arr.join(sep) + '}';
  }
  if (sep === '-') {
    return '[' + arr.join(sep) + ']';
  }
}

/**
 * Expand ranges
 */

function tryExpand(paths, inner, opts, fn) {
  try {
    paths = expand(inner, opts, fn);
    if (paths.length === 1 && paths[0] === inner) {
      return null;
    }
    return paths;
  } catch(err) {}
  return null;
}

/**
 * Handle empty braces: `{}`
 */

function emptyBraces(str, opts, arr) {
  return braces(str.replace(/\{}/g, '\\{\\}'), arr, opts);
}

/**
 * Handle patterns with whitespace
 */

function splitWhitespace(str, opts, arr) {
  var paths = str.split(' ');
  var len = paths.length;
  var res = [];
  var i = 0;

  while (len--) {
    res.push.apply(res, braces(paths[i++]));
  }

  return res;
}

/**
 * Handle escaped braces: `\\{foo,bar}`
 */

function escapeBraces(str, opts, arr) {
  if (!/\{[^{]+\{/.test(str)) {
    return arr.concat(str.replace(/\\/g, ''));
  } else {
    str = str.replace(/\\{/g, '__LT_BRACE__');
    str = str.replace(/\\}/g, '__RT_BRACE__');
    return map(braces(str, opts, arr), function (ele) {
      ele = ele.replace(/__LT_BRACE__/g, '{');
      return ele.replace(/__RT_BRACE__/g, '}');
    });
  }
}

/**
 * Handle escaped dots: `{1\\.2}`
 */

function escapeDots(str, opts, arr) {
  if (!/[^\\]\..+\\\./.test(str)) {
    return arr.concat(str.replace(/\\/g, ''));
  } else {
    str = str.replace(/\\\./g, '__ESC_DOT__');
    return map(braces(str, opts, arr), function (ele) {
      return ele.replace(/__ESC_DOT__/g, '.');
    });
  }
}

/**
 * Handle escaped commas: `{a\\,b}`
 */

function escapeCommas(str, opts, arr) {
  if (!/\w,/.test(str)) {
    return arr.concat(str.replace(/\\/g, ''));
  } else {
    str = str.replace(/\\,/g, '__ESC_COMMA__');
    return map(braces(str, opts, arr), function (ele) {
      return ele.replace(/__ESC_COMMA__/g, ',');
    });
  }
}

/**
 * Create and expand range patterns: `a{,}{,}`
 */

function rangeify(str, options) {
  var opts = options || {};
  var rep = str.replace(/\{,}/g, '__ESC_EXP__');
  var res = braces(rep, opts);
  var len = res.length;
  var i = 0;
  var arr = [];

  while (len--) {
    var ele = res[i++];
    var match = ele.match(powRegex());
    if (match) {
      ele = ele.replace(powRegex(), '');
      if (opts.nodupes && ele != '') {
        arr.push(ele);
      } else {
        var num = Math.pow(2, match.length);
        while (num--) {
          if (ele != '') { arr.push(ele); }
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
  return /.*(\\?\{([^}]+)\})/;
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
  return /__ESC_EXP__/g;
}

/**
 * Regex caches
 */

var powRe;
var braceRe;
var patternRe;

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
    return [];
  }

  var len = arr.length;
  var res = [];
  var i = -1;

  while (++i < len) {
    res[i] = fn(arr[i], i);
  }

  return res;
}
