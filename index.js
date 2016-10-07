'use strict';

var debug = require('debug')('braces');
var toRegex = require('to-regex');
var compilers = require('./lib/compilers');
var parsers = require('./lib/parsers');
var Braces = require('./lib/braces');
var utils = require('./lib/utils');
var MAX_LENGTH = 1024 * 64;

/**
 * Session cache
 */

var cache = {};

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

  var key = createKey(pattern, options);
  options = options || {};

  if (options.cache !== false && cache.hasOwnProperty(key)) {
    return cache[key];
  }

  if (Array.isArray(pattern)) {
    var len = pattern.length;
    var idx = -1;
    var arr = [];
    while (++idx < len) {
      arr.push(braces.optimize(pattern[idx], options));
    }
    return arr;
  }

  if (pattern === '{,}') {
    return [];
  }

  var proto = new Braces(options);
  if (options && options.expand === true) {
    return (cache[key] = proto.expand(pattern));
  }
  return (cache[key] = proto.optimize(pattern));
}

/**
 * Expands a brace pattern into an array. This method is called by the main
 * [braces](#braces) function when `options.expand` is true.
 *
 * ```js
 * var braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String|Object} `pattern` Brace pattern or AST returned from [.parse](#parse).
 * @param {Object} `options`
 * @return {Object} Returns an array of expanded values.
 * @api public
 */

braces.expand = function(pattern, options) {
  if (pattern === '' || pattern.length <= 2) {
    return [pattern];
  }
  if (pattern === '{,}') {
    return [];
  }
  var opts = utils.extend({}, options, {expand: true});
  return braces(pattern, opts);
};

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

  var key = createKey('makeRe:' + pattern, options);

  options = options || {};
  if (options.cache !== false && cache.hasOwnProperty(key)) {
    return cache[key];
  }

  var res = braces(pattern, options);
  var opts = utils.extend({strictErrors: false}, options);
  var regex = toRegex(res, opts);

  if (opts.cache !== false) {
    cache[key] = regex;
  }
  return regex;
};

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
  return Symbol(key);
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
