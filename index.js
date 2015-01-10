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

  if (!Array.isArray(arr)) {
    options = arr;
    arr = [];
  }

  options = options || {};
  var fn = options.fn;

  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  arr = arr || [];

  var matches = str.match(patternRe()) || [];
  var m = matches[0];
  var es6, comma;

  if (m === '$') {
    if (!/\{[^{]*\{/.test(str)) {
      return arr.concat(str);
    } else {
      es6 = true;
      str = tokens.before(str, es6Regex());
    }
  }

  if (m === '\\,') {
    // var escBraceRe = /\\*\{([^,.]*)\\,([^}]*)\\*\}/g;
    var parts = braces(str.replace(/\\*\{([^,.]*)\\,([^}]*)\\*\}/g, '\\{$1__^__$2}'));
    return parts.map(function (ele) {
      return ele.replace(/__\^__/g, ',');
    });
    console.log(parts)

    //   console.log(str)
    // var res = braces(tokens.before(str, escBraceRe), arr);
    // return res.map(function (ele) {
    //   return tokens.after(ele).replace(/\\/g, '');
    // });
  }

  if (m === '\\{' || m === '\\}' || m === '\\.') {
    var escBraceRe = /\\\{[^{}]+?\}|\{[^{}]+?\\\}|\\\./g;
    var res = braces(tokens.before(str, escBraceRe), arr);
    return res.map(function (ele) {
      // console.log(ele)
      return tokens.after(ele).replace(/\\/g, '');
    });
  }

  // if (m === '\\{' || m === '\\}' || m === '\\,' || m === '\\.') {
  //   var escBraceRe = /\\\{[^{}]+?\}|\{[^{}]+?\\\}|\\[,.]/g;
  //   // var escBraceRe = /\\\{[^{}]+?\}|\{[^{}]+?\\\}|\{[^,.]*\\[,.][^}]*\}/g;
  //   var res = braces(tokens.before(str, escBraceRe), arr);
  //   return res.map(function (ele) {
  //     console.log(ele)
  //     return tokens.after(ele).replace(/\\/g, '');
  //   });
  // }

  // if (m === '\\{' || m === '\\}' || m === '\\,' || m === '\\.') {
  //   var escBraceRe = /\\\{[^{}]+?\}|\{[^{}]+?\\\}|\\[,.]/g;
  //   str = str.replace(/\\?\{(.*\\[,.].*)\}/g, '\\{$1}');
  //   str = str.replace(/\{(.*\\[,.].*)\\?\}/g, '\\{$1}');

  //   str = braces(tokens.before(str, escBraceRe), arr);
  //   return str.map(function (ele) {
  //     return tokens.after(ele).replace(/\\/g, '');
  //   });
  // }
  // if (m === '\\{' || m === '\\}' || m === '\\,' || m === '\\.') {
  //   var escBraceRe = /\\\{[^{}]+?\}|\{[^{}]+?\\\}|\{()\}|\\\./g;
  //   var matches = str.match(escBraceRe);
  //   console.log(matches)
  //   str = braces(tokens.before(str, escBraceRe), arr);
  //   return str.map(function (ele) {
  //     return tokens.after(ele).replace(/\\/g, '');
  //   });
  // }

  if (m === '} {') {
    return arr.concat(braces(wrap(str.replace(' ', ','), arr)).sort());
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
    } else if (arr.indexOf(val) === -1) {
      if (es6) {
        val = tokens.after(val);
      }
      arr.push(val);
    }
  }

  if (options.strict) {
    arr = arr.filter(function (ele) {
      return ele !== '\\';
    }).filter(Boolean);
  }

  return arr;
}

/**
 * Escape commented patterns.
 */

function escapeComment(str) {
  var comment = commentRe().exec(str);
  return splice(str, wrap(comment[0]), '\\' + wrap(comment[2]));
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
  return /\$|\}[ \t]\{|\{['"]|\\\{|\\\}|\\,|\\\./;
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
