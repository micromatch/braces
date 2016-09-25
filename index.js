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
  var key = createKey(pattern, options);

  if (isCached('braces', key, options)) {
    return cache.braces[key];
  }

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
  var opts = utils.extend({}, options, {expand: true, optimize: false});
  if (pattern === '' || pattern.length <= 2) {
    return [pattern];
  }
  var res = braces.compile(pattern, opts).output;
  return res;
};

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
