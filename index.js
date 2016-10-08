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

  var results = [];
  if (options && options.expand === true) {
    results = braces.expand(pattern, options);
  } else {
    results = braces.optimize(pattern, options);
  }

  if (options && options.nodupes === true) {
    results = utils.unique(results);
  }
  return (cache[key] = results);
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

  var quoted = /^(['"`])(.*)(\1)$/g.exec(pattern);
  if (quoted) {
    return [quoted[2]];
  }

  var opts = utils.extend({}, options, {expand: true});
  var proto = new Braces(options);
  return proto.expand(pattern, opts).filter(Boolean);
};

/**
 * Expands a brace pattern into a regex-compatible, optimized string. This method
 * is called by the main [braces](#braces) function by default.
 *
 * ```js
 * var braces = require('braces');
 * console.log(braces.optimize('user-{200..300}/project-{a,b,c}-{1..10}'))
 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
 * ```
 * @param {String|Object} `pattern` Brace pattern or AST returned from [.parse](#parse).
 * @param {Object} `options`
 * @return {Object} Returns an array of expanded values.
 * @api public
 */

braces.optimize = function(pattern, options) {
  if (pattern === '' || pattern.length <= 2) {
    return [pattern];
  }

  if (pattern === '{,}') {
    return [];
  }

  var quoted = /^(['"`])(.*)(\1)$/g.exec(pattern);
  if (quoted) {
    return [quoted[2]];
  }

  var opts = utils.extend({}, options, {optimize: true});
  var proto = new Braces(options);
  return proto.optimize(pattern, opts).filter(Boolean);
};

/**
 * Create a regular expression from the given string `pattern`.
 *
 * ```js
 * var braces = require('braces');
 * console.log(braces.makeRe('user-{200..300}'))
 * //=> /^(?:user-(20[0-9]|2[1-9][0-9]|300))$/
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
