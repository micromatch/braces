'use strict';

var debug = require('debug')('braces');
var compilers = require('./lib/compilers');
var parsers = require('./lib/parsers');
var Braces = require('./lib/braces');
var utils = require('./lib/utils');
var cache = require('./lib/cache');
var toRegex = require('to-regex');
var MAX_LENGTH = 1024 * 64;

/**
 * Convert the given `braces` pattern into a regex-compatible string. Set `options.expand`
 * to true to return an array of patterns.
 *
 * ```js
 * var braces = require('braces');
 * console.log(braces('{a,b,c}'));
 * //=> ['(a|b|c)']
 *
 * console.log(braces('{a,b,c}', {expand: true}));
 * //=> ['a', 'b', 'c']
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

function braces(pattern, options) {
  debug('initializing from <%s>', __filename);
  if (options && options.expand === true) {
    return braces.expand.apply(braces, arguments);
  }

  var result = braces.compile(pattern, options);
  var opts = utils.extend({optimize: true}, options);

  var snapdragon = new Braces(opts);
  var ast = snapdragon.parse(pattern, opts);
  var res = snapdragon.compile(ast, opts);
  return utils.arrayify(res.output);
}

braces.parse = function(pattern, options) {
  var opts = utils.extend({optimize: true}, options);
  var inst = braces.instance = new Braces(opts);
  var ast = inst.parse(pattern, opts);
  return ast;
};

braces.compile = function(pattern, options) {
  var opts = utils.extend({optimize: true}, options);
  var ast = braces.parse(pattern, opts);
  var inst = braces.instance || new Braces(opts);
  var compiled = inst.compile(ast, opts);

  compiled.output = utils.arrayify(compiled.output);
  return compiled;
};

braces.expand = function(pattern, options) {
  var opts = utils.createOptions({}, options, {optimize: false, expand: true});
  if (pattern === '' || pattern.length <= 2) {
    return [pattern];
  }
  var res = braces.compile(pattern, opts).output;
  return utils.arrayify(res);
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

// braces.match = function(arr, pattern, options) {
//   var key = createKey(pattern, options);
//   var isMatch;

//   if (isCached('match', key, options)) {
//     isMatch = cache.match[key];
//   } else {
//     isMatch = cache.match[key] = braces.matcher(pattern, options);
//   }

//   arr = utils.arrayify(arr);
//   options = options || {};
//   var len = arr.length;
//   var idx = -1;
//   var res = [];

//   while (++idx < len) {
//     var ele = arr[idx];
//     if (isMatch(ele)) {
//       res.push(ele);
//     }
//   }

//   if (res.length === 0) {
//     if (options.failglob === true) {
//       throw new Error('no matches found for "' + pattern + '"');
//     }
//     if (options.nonull === true || options.nullglob === true) {
//       return [pattern.split('\\').join('')];
//     }
//   }
//   return res;
// };

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

// braces.isMatch = function(str, pattern, options) {
//   var key = createKey(pattern, options);
//   var matcher;

//   if (isCached('isMatch', key, options)) {
//     matcher = cache.isMatch[key];
//   } else {
//     matcher = cache.isMatch[key] = braces.matcher(pattern, options);
//   }

//   return matcher(str);
// };

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

// braces.matcher = function(pattern, options) {
//   var key = createKey(pattern, options);
//   var regex;

//   if (isCached('matcher', key, options)) {
//     regex = cache.isMatch[key];
//   } else {
//     regex = cache.isMatch[key] = braces.makeRe(pattern, options);
//   }

//   return function(str) {
//     return regex.test(str);
//   };
// };

/**
 * Create a regular expression from the given string `pattern`.
 *
 * ```js
 * var braces = require('braces');
 * var re = braces.makeRe('[[:alpha:]]');
 * console.log(re);
 * //=> /^(?:[a-zA-Z])$/
 * ```
 * @param {String} `pattern` The pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

braces.makeRe = function(pattern, options) {
  if (pattern instanceof RegExp) {
    return pattern;
  }

  if (pattern.length > MAX_LENGTH) {
    throw new Error('expected pattern to be less than ' + MAX_LENGTH + ' characters');
  }

  function makeRe() {
    var res = braces(pattern, options);
    var opts = utils.extend({strictErrors: false, wrap: false}, options);
    return toRegex(res, opts);
  }

  var regex = memoize('makeRe', pattern, options, makeRe);
  if (regex.source.length > MAX_LENGTH) {
    throw new SyntaxError('potentially malicious regex detected');
  }

  return regex;
};

/**
 * Memoize a generated regex or function
 */

function memoize(type, pattern, options, fn) {
  if (!utils.isString(pattern)) {
    return fn(pattern, options);
  }

  var key = createKey(pattern, options);
  if (cache.has(type, key)) {
    return cache.get(type, key);
  }

  var val = fn(pattern, options);
  if (options && options.cache === false) {
    return val;
  }

  val.key = key;
  cache.set(type, key, val);
  return val;
}

/**
 * Create the key to use for memoization. The key is generated
 * by iterating over the options and concatenating key-value pairs
 * to the pattern string.
 */

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
