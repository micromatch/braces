'use strict';

var debug = require('debug')('braces');
var compilers = require('./lib/compilers');
var parsers = require('./lib/parsers');
var Braces = require('./lib/braces');
var utils = require('./lib/utils');
var makeReCache = {};
var cache = {};

/**
 * Convert the given `braces` pattern into a regex-compatible string.
 *
 * ```js
 * var braces = require('braces');
 * var str = braces('*.!(*a)');
 * console.log(str);
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

function braces(str, options) {
  var res = braces.compile(str, options);
  // console.log(res.braces)
  return utils.unique(res.braces);
}


braces.compile = function(str, options) {
  var matcher = new Braces(options);
  var ast = matcher.parse(str, options);
  return matcher.compile(ast, options);
};

/**
 * Takes an array of strings and an braces pattern and returns a new
 * array that contains only the strings that match the pattern.
 *
 * ```js
 * var braces = require('braces');
 * console.log(braces.match(['a.a', 'a.b', 'a.c'], '*.!(*a)'));
 * //=> ['a.b', 'a.c']
 * ```
 * @param {Array} `arr` Array of strings to match
 * @param {String} `pattern` Braces pattern
 * @param {Object} `options`
 * @return {Array}
 * @api public
 */

braces.match = function(arr, pattern, options) {
  arr = utils.arrayify(arr);
  options = options || {};

  var isMatch = braces.matcher(pattern, options);
  var len = arr.length;
  var idx = -1;
  var res = [];

  while (++idx < len) {
    var ele = arr[idx];
    if (isMatch(ele)) {
      res.push(ele);
    }
  }

  if (res.length === 0) {
    if (options.failglob === true) {
      throw new Error('no matches found for "' + pattern + '"');
    }
    if (options.nonull === true || options.nullglob === true) {
      return [pattern.split('\\').join('')];
    }
  }
  return res;
};

/**
 * Returns true if the specified `string` matches the given
 * braces `pattern`.
 *
 * ```js
 * var braces = require('braces');
 *
 * console.log(braces.isMatch('a.a', '*.!(*a)'));
 * //=> false
 * console.log(braces.isMatch('a.b', '*.!(*a)'));
 * //=> true
 * ```
 * @param {String} `string` String to match
 * @param {String} `pattern` Braces pattern
 * @param {String} `options`
 * @return {Boolean}
 * @api public
 */

braces.isMatch = function(str, pattern, options) {
  var key = pattern;
  var regex;

  if (options) {
    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        key += ';' + prop + '=' + String(options[prop]);
      }
    }
  }

  if (cache.hasOwnProperty(key)) {
    regex = cache[key];
  } else {
    regex = cache[key] = braces.makeRe(pattern, options);
  }
  return regex.test(str);
};

/**
 * Takes an braces pattern and returns a matcher function. The returned
 * function takes the string to match as its only argument.
 *
 * ```js
 * var braces = require('braces');
 * var isMatch = braces.matcher('*.!(*a)');
 *
 * console.log(isMatch('a.a'));
 * //=> false
 * console.log(isMatch('a.b'));
 * //=> true
 * ```
 * @param {String} `pattern` Braces pattern
 * @param {String} `options`
 * @return {Boolean}
 * @api public
 */

braces.matcher = function(pattern, options) {
  var re = braces.makeRe(pattern, options);
  return function(str) {
    return re.test(str);
  };
};

/**
 * Create a regular expression from the given string `pattern`.
 *
 * ```js
 * var braces = require('braces');
 * var re = braces.makeRe('*.!(*a)');
 * console.log(re);
 * //=> /^[^\/]*?\.(?![^\/]*?a)[^\/]*?$/
 * ```
 * @param {String} `pattern` The pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

braces.makeRe = function(pattern, options) {
  var key = pattern;
  var regex;

  if (options) {
    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        key += ';' + prop + '=' + String(options[prop]);
      }
    }
  }

  options = options || {};
  if (options.cache !== false && makeReCache.hasOwnProperty(key)) {
    return makeReCache[key];
  }

  regex = makeReCache[key] = new Braces(options).makeRe(pattern);
  return regex;
};

/**
 * Expose `braces`
 * @type {Function}
 */

module.exports = braces;

/**
 * Expose `Braces` constructor
 * @type {Function}
 */

module.exports.Braces = Braces;
module.exports.compilers = compilers;
module.exports.parsers = parsers;
