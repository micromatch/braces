'use strict';

var debug = require('debug')('braces');
var Snapdragon = require('snapdragon');
var compilers = require('./compilers');
var parsers = require('./parsers');
var utils = require('./utils');

/**
 * Customize Snapdragon parser and renderer
 */

function Braces(options) {
  debug('initializing from <%s>', __filename);
  this.options = utils.extend({source: 'braces'}, options);
  this.snapdragon = this.options.snapdragon || new Snapdragon(this.options);
  this.compiler = this.snapdragon.compiler;
  this.parser = this.snapdragon.parser;

  compilers(this.snapdragon);
  parsers(this.snapdragon);

  /**
   * Override Snapdragon `.parse` method
   */

  utils.define(this.snapdragon, 'parse', function(str, options) {
    var parsed = Snapdragon.prototype.parse.apply(this, arguments);
    this.parser.ast.input = str;
    this.parser.ast.queue = [];

    var stack = this.parser.stack;
    while (stack.length) {
      addParent({type: 'brace.close', val: ''}, stack.pop());
    }

    function addParent(node, parent) {
      utils.define(node, 'parent', parent);
      parent.nodes.push(node);
    }

    function isType(node, type) {
      return node && node.type === type;
    }

    // add non-enumerable parser reference
    utils.define(parsed, 'parser', this.parser);
    return parsed;
  });

  /**
   * Decorate `.parse` method
   */

  utils.define(this, 'parse', function(ast, options) {
    return this.snapdragon.parse.apply(this.snapdragon, arguments);
  });

  /**
   * Decorate `.compile` method
   */

  utils.define(this, 'compile', function(ast, options) {
    ast.queue = [];
    return this.snapdragon.compile(ast, options);
  });

  /**
   * Create a regular expression from the given braces `pattern`.
   *
   * ```js
   * var braces = require('braces');
   * var re = braces.makeRe('*.!(*a)');
   * console.log(re);
   * //=> /^[^\/]*?\.(?![^\/]*?a)[^\/]*?$/
   * ```
   * @param {String} `pattern` The braces pattern to convert
   * @param {Object} `options`
   * @return {RegExp}
   * @api public
   */

  utils.define(this, 'makeRe', function() {
    return this.snapdragon.makeRe.apply(this.snapdragon, arguments);
  });

  /**
   * Create a regex from the given `string` and `options`
   */

  utils.define(this, 'toRegex', function() {
    return this.snapdragon.toRegex.apply(this.snapdragon, arguments);
  });
}

function visit(node, fn) {
  return node.nodes ? mapVisit(node.nodes, fn) : fn(node);
}

/**
 * Map visit over array of `nodes`.
 */

function mapVisit(nodes, fn) {
  var len = nodes.length;
  var idx = -1;
  while (++idx < len) {
    visit(nodes[idx], fn);
  }
}

/**
 * Expose `Braces`
 */

module.exports = Braces;
