'use strict';

var debug = require('debug')('braces');
var compilers = require('./lib/compilers');
var parsers = require('./lib/parsers');
var Braces = require('./lib/braces');
var utils = require('./lib/utils');
var cache = {braces: {}, compile: {}, expand: {}, parse: {}};

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

  var key = pattern;
  if (options) {
    for (var prop in options) {
      if (options.hasOwnProperty(prop)) {
        key += ';' + prop + '=' + String(options[prop]);
      }
    }
  }

  if (cache.braces[key]) {
    return cache.braces[key];
  }

  var result = braces.compile(pattern, options);
  var output = result.output;
  cache.braces[key] = output;
  return output;
}

braces.parse = function(pattern, options) {
  var opts = utils.extend({optimize: true}, options);

  var key = pattern;
  for (var prop in opts) {
    if (opts.hasOwnProperty(prop)) {
      key += ';' + prop + '=' + String(opts[prop]);
    }
  }

  if (cache.parse[key]) {
    return cache.parse[key];
  }

  var inst = braces.instance = new Braces(opts);
  var ast = inst.parse(pattern, opts);
  cache.parse[key] = ast;
  return ast;
};

braces.compile = function(pattern, options) {
  var opts = utils.extend({optimize: true}, options);

  var key = pattern;
  for (var prop in opts) {
    if (opts.hasOwnProperty(prop)) {
      key += ';' + prop + '=' + String(opts[prop]);
    }
  }

  if (cache.compile[key]) {
    return cache.compile[key];
  }

  var ast = braces.parse(pattern, opts);
  var inst = braces.instance || new Braces(opts);
  var compiled = inst.compile(ast, opts);
  compiled.output = utils.arrayify(compiled.output);
  cache.compile[key] = compiled;
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
