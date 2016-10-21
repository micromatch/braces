'use strict';

/**
 * Module dependencies
 */

var toRegex = require('to-regex');
var unique = require('array-unique');
var extend = require('extend-shallow');
var debug = require('debug')('braces');

/**
 * Local dependencies
 */

var compilers = require('./lib/compilers');
var parsers = require('./lib/parsers');
var Braces = require('./lib/braces');
var utils = require('./lib/utils');
var MAX_LENGTH = 1024 * 64;

/**
 * Session cache (disable with `options.cache`)
 */

var cache = {};

/**
 * Convert the given `braces` pattern into a regex-compatible string. By default, only one string is generated for every input string. Set `options.expand` to true to return an array of patterns (similar to Bash or minimatch. Before using `options.expand`, it's recommended that you read the [performance notes](#performance)).
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

  var key = utils.createKey(pattern, options);
  options = options || {};

  if (options.cache !== false && cache.hasOwnProperty(key)) {
    return cache[key];
  }

  var results = [];
  if (Array.isArray(pattern)) {
    for (var i = 0; i < pattern.length; i++) {
      results.push.apply(results, braces.create(pattern[i], options));
    }

    if (options && options.nodupes === true) {
      results = unique(results);
    }
  } else {
    results = braces.create(pattern, options);
  }

  return (cache[key] = results);
}

/**
 * Expands a brace pattern into an array. This method is called by the main [braces](#braces) function when `options.expand` is true. Before using this method it's recommended that you read the [performance notes](#performance)) and advantages of using [.optimize](#optimize) instead.
 *
 * ```js
 * var braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.expand = function(pattern, options) {
  return braces.create(pattern, extend({}, options, {expand: true}));
};

/**
 * Expands a brace pattern into a regex-compatible, optimized string. This method is called by the main [braces](#braces) function by default.
 *
 * ```js
 * var braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/(b|c)/d']
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.optimize = function(pattern, options) {
  return braces.create(pattern, options);
};

/**
 * Processes a brace pattern and returns either an expanded array (if `options.expand` is true), a highly optimized regex-compatible string. This method is called by the main [braces](#braces) function.
 *
 * ```js
 * var braces = require('braces');
 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.create = function(pattern, options) {
  if (pattern instanceof RegExp) {
    pattern = pattern.source;
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('expected a string');
  }

  if (pattern.length > MAX_LENGTH) {
    throw new Error('expected pattern to be less than ' + MAX_LENGTH + ' characters');
  }

  function create() {
    if (pattern === '' || pattern.length <= 2) {
      return [pattern];
    }

    if (/^(?:{,})+$/.test(pattern)) {
      return [];
    }

    var quoted = /^(['"`])(.*)(\1)$/g.exec(pattern);
    if (quoted) {
      return [quoted[2]];
    }

    var proto = new Braces(options);
    var arr = !options || !options.expand
      ? proto.optimize(pattern, options)
      : proto.expand(pattern, options);

    if (options && options.nodupes === true) {
      return unique(arr);
    }

    return arr;
  }

  return memoize('create', pattern, options, create);
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

  if (typeof pattern !== 'string') {
    throw new TypeError('expected a string');
  }

  if (pattern.length > MAX_LENGTH) {
    throw new Error('expected pattern to be less than ' + MAX_LENGTH + ' characters');
  }

  function makeRe() {
    var arr = braces(pattern, options);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].replace(/([{}])/g, '\\$1');
    }
    var opts = extend({strictErrors: false}, options);
    return toRegex(arr, opts);
  }

  return memoize('makeRe', pattern, options, makeRe);
};

/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * var braces = require('braces');
 * var ast = braces.parse('a/{b,c}/d');
 * console.log(ast);
 * // { type: 'root',
 * //   errors: [],
 * //   input: 'a/{b,c}/d',
 * //   nodes:
 * //    [ { type: 'bos', val: '' },
 * //      { type: 'text', val: 'a/' },
 * //      { type: 'brace',
 * //        nodes:
 * //         [ { type: 'brace.open', val: '{' },
 * //           { type: 'text', val: 'b,c' },
 * //           { type: 'brace.close', val: '}' } ] },
 * //      { type: 'text', val: '/d' },
 * //      { type: 'eos', val: '' } ] }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an AST
 * @api public
 */

braces.parse = function(str, options) {
  var inst = new Braces(options);
  return inst.parse(str, options);
};

/**
 * Compile the given `ast` or string with the given `options`.
 *
 * ```js
 * var braces = require('braces');
 * var ast = braces.parse('a/{b,c}/d');
 * console.log(braces.compile(ast));
 * // { options: { source: 'string' },
 * //   state: {},
 * //   compilers:
 * //    { eos: [Function],
 * //      noop: [Function],
 * //      bos: [Function],
 * //      brace: [Function],
 * //      'brace.open': [Function],
 * //      text: [Function],
 * //      'brace.close': [Function] },
 * //   output: [ 'a/(b|c)/d' ],
 * //   ast:
 * //    { ... },
 * //   parsingErrors: [] }
 * ```
 * @param {Object|String} `ast`
 * @param {Object} `options`
 * @return {Object} Returns an object that has an `output` property with the compiled string.
 * @api public
 */

braces.compile = function(ast, options) {
  var inst = new Braces(options);
  return inst.compile(ast, options);
};

/**
 * Memoize if `options.cache` is not false
 */

function memoize(type, pattern, options, fn) {
  var key = utils.createKey(type + ':' + pattern, options);
  options = options || {};

  if (options.cache !== false && cache.hasOwnProperty(key)) {
    return cache[key];
  }

  var res = fn(pattern, options);
  if (options.cache !== false) {
    cache[key] = res;
  }
  return res;
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
