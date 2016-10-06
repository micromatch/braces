'use strict';

var debug = require('debug')('braces');
var toRegex = require('to-regex');
var compilers = require('./lib/compilers');
var parsers = require('./lib/parsers');
var Braces = require('./lib/braces');
var utils = require('./lib/utils');
var cache = require('./lib/cache');
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
  return memoize('braces', pattern, options, function() {
    debug('initializing from <%s>', __filename);

    if (options && options.expand === true) {
      return braces.expand.apply(braces, arguments);
    } else {
      return braces.optimize.apply(braces, arguments);
    }
  });
}

/**
 * Parse the given brace `pattern` with the specified `options`.
 *
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an AST
 * @api public
 */

braces.parse = function(pattern, options) {
  return memoize('parse', pattern, options, function() {
    debug('parsing <%s>', pattern);
    var opts = utils.createOptions({optimize: true}, options);
    var proto = new Braces(opts);
    var ast = proto.parse(pattern, opts);
    utils.define(ast, 'proto', proto);
    return ast;
  });
};

/**
 * Compile the given `ast` with the specified `options`.
 *
 * @param {Object} `ast`
 * @param {Object} `options`
 * @return {Object} Returns an object with the compiled value on the `output` property.
 * @api public
 */

braces.compile = function(ast, options) {
  var key = utils.isObject(ast) && ast.input ? ast.input : ast;
  return memoize('compile', key, options, function() {
    debug('compiling <%s>', key);
    var opts = utils.createOptions({optimize: true}, options);
    var proto = new Braces(opts);
    var res = proto.compile(ast, opts);
    res.output = utils.arrayify(res.output);
    return res;
  });
};

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
  var key = utils.isObject(pattern) && pattern.input ? pattern.input : pattern;
  return memoize('expand', key, options, function() {
    if (key === '' || key.length <= 2) {
      return [key];
    }
    var opts = utils.createOptions({}, options, {expand: true});
    var proto = new Braces(opts);
    var res = proto.expand(pattern, opts);
    return utils.arrayify(res.output);
  });
};

/**
 * Create a string that is optimized for regex usage. This method is called by the main
 * [braces](#braces) function by default, and/or when `options.optimize` is true.
 *
 * ```js
 * var braces = require('braces');
 * console.log(braces.optimize('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String|Object} `pattern` Brace pattern or AST returned from [.parse](#parse).
 * @param {Object} `options`
 * @return {Object} Returns an array of expanded values.
 * @api public
 */

braces.optimize = function(pattern, options) {
  var key = utils.isObject(pattern) && pattern.input ? pattern.input : pattern;
  return memoize('optimize', key, options, function() {
    if (Array.isArray(key)) {
      var len = key.length;
      var idx = -1;
      var arr = [];
      while (++idx < len) {
        arr.push(braces.optimize(key[idx], options));
      }
      return arr;
    }

    if (key === '' || key.length <= 2) {
      return [key];
    }

    var opts = utils.createOptions({}, options, {optimize: true});
    var proto = new Braces(opts);
    var res = proto.optimize(pattern, options);
    return utils.arrayify(res.output);
  });
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
  var isMatch = braces.matcher(pattern, options);
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
  var matcher = braces.matcher(pattern, options);
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
  var regex = braces.makeRe(pattern, options);
  return function(str) {
    return regex.test(str);
  };
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

  function makeRe() {
    var res = braces(pattern, options);
    var opts = utils.extend({strictErrors: false, wrap: false}, options);
    opts.optimize = true;
    delete opts.expand;
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
