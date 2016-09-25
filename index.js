'use strict';

var debug = require('debug')('braces');
var compilers = require('./lib/compilers');
var parsers = require('./lib/parsers');
var Braces = require('./lib/braces');
var utils = require('./lib/utils');
var cache = {braces: {}};

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

function braces(pattern, options) {
  debug('initializing from <%s>', __filename);
  var key = pattern;
  if (options) {
    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        key += ';' + prop + '=' + String(options[prop]);
      }
    }
  }

  if (cache.braces.hasOwnProperty(key)) {
    return cache.braces[key];
  }

  // var key = createKey(pattern, options);
  // if (isCached('braces', key, options)) {
  //   return cache.braces[key];
  // }

  var result = braces.compile(pattern, options);
  cache.braces[key] = result.output;
  return result.output;
}

braces.compile = function(pattern, options) {
  var matcher = new Braces(options);
  var ast = matcher.parse(pattern, options);
  var compiled = matcher.compile(ast, options);
  return compiled;
};

braces.expand = function(pattern, options) {
  var opts = utils.extend({}, options, {expand: true, makeRe: false});
  if (pattern === '' || pattern.length <= 2) {
    return [pattern];
  }
  var res = braces.compile(pattern, opts).output;
  return res;
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
  var key = createKey(pattern, options);
  var isMatch;

  if (isCached('match', key, options)) {
    isMatch = cache.match[key];
  } else {
    isMatch = cache.match[key] = braces.matcher(pattern, options);
  }

  arr = utils.arrayify(arr);
  options = options || {};
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
  var key = createKey(pattern, options);
  var matcher;

  if (isCached('isMatch', key, options)) {
    matcher = cache.isMatch[key];
  } else {
    matcher = cache.isMatch[key] = braces.matcher(pattern, options);
  }

  return matcher(str);
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
  var key = createKey(pattern, options);
  var regex;

  if (isCached('matcher', key, options)) {
    regex = cache.isMatch[key];
  } else {
    regex = cache.isMatch[key] = braces.makeRe(pattern, options);
  }

  return function(str) {
    return regex.test(str);
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
  var key = createKey(pattern, options);
  var regex;

  if (isCached('makeRe', pattern, options)) {
    regex = cache.makeRe[key];
  } else {
    var opts = utils.extend({makeRe: true, expand: false}, options);
    regex = cache.makeRe[key] = new Braces(opts).makeRe(pattern);
  }

  return regex;
};

// console.log(braces.makeRe('a/b/{c,d,e}/f'))

function isCached(type, key, options) {
  cache[type] = cache[type] || {};
  if (options && options.cache === false) {
    return false;
  }
  return cache[type].hasOwnProperty(key);
}

function createKey(pattern, options) {
  var key = pattern;
  if (typeof options === 'undefined') {
    return key;
  }
  for (var prop in options) {
    if (options.hasOwnProperty(prop)) {
      key += ';' + prop + '=' + String(options[prop]);
    }
  }
  return key;
}

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
