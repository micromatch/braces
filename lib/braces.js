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
  this.options = utils.extend({}, options);
}

/**
 * Initialize braces
 */

Braces.prototype.init = function(options) {
  var opts = utils.createOptions({}, this.options, options);
  this.snapdragon = this.options.snapdragon || new Snapdragon(opts);
  this.compiler = this.snapdragon.compiler;
  this.parser = this.snapdragon.parser;

  compilers(this.snapdragon);
  parsers(this.snapdragon);

  /**
   * Call Snapdragon `.parse` method. When AST is returned, we check to
   * see if any unclosed braces are left on the stack and, if so, we iterate
   * over the stack and correct the AST so that compilers are called in the correct
   * order and unbalance braces are properly escaped.
   */

  utils.define(this.snapdragon, 'parse', function(pattern, options) {
    var parsed = Snapdragon.prototype.parse.apply(this, arguments);
    this.parser.ast.input = pattern;
    this.parser.ast.queue = [];

    var stack = this.parser.stack;
    while (stack.length) {
      addParent({type: 'brace.close', val: ''}, stack.pop());
    }

    function addParent(node, parent) {
      utils.define(node, 'parent', parent);
      parent.nodes.push(node);
    }

    // add non-enumerable parser reference
    utils.define(parsed, 'parser', this.parser);
    return parsed;
  });
};

/**
 * Lazily initialize braces
 */

Braces.prototype.lazyInit = function(options) {
  if (!this.isInitialized) {
    this.isInitialized = true;
    this.init(options);
  }
};

/**
 * Decorate `.parse` method
 */

Braces.prototype.parse = function(ast, options) {
  if (utils.isObject(ast) && ast.nodes) return ast;
  this.lazyInit(options);
  return this.snapdragon.parse.apply(this.snapdragon, arguments);
};

/**
 * Decorate `.compile` method
 */

Braces.prototype.compile = function(ast, options) {
  this.lazyInit(options);
  ast.queue = [];
  return this.snapdragon.compile(ast, options);
};

/**
 * Expand
 */

Braces.prototype.expand = function(pattern) {
  var ast = this.parse(pattern, {expand: true});
  var res = this.compile(ast, {expand: true});
  return utils.arrayify(res.output);
};

/**
 * Optimize
 */

Braces.prototype.optimize = function(pattern) {
  var ast = this.parse(pattern, {optimize: true});
  var res = this.compile(ast, {optimize: true});
  return utils.arrayify(res.output);
};

/**
 * Visit `node` with the given `fn`
 */

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
