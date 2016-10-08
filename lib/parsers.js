'use strict';

var utils = require('./utils');
var regexNot = require('regex-not');
var toRegex = require('to-regex');

/**
 * Characters to use in negation regex (we want to "not" match
 * characters that are matched by other parsers)
 */

var cached;
var regex = textRegex();

/**
 * Braces parsers
 */

module.exports = function(brace) {
  brace.parser.sets.brace = brace.parser.sets.brace || [];
  brace.parser

    /**
     * Character parsers
     */

    .capture('escape', function() {
      var pos = this.position();
      var m = this.match(/^(?:\\(.)|\$\{)/);
      if (!m) return;

      var node = pos({
        type: 'text',
        multiplier: 1,
        val: m[0]
      });

      if (node.val === '\\\\') {
        return node;
      }

      var chars = {'${': '}', '`': '`', '"': '"'};
      var val = node.val;
      if (chars[val]) {
        var str = this.input;
        var idx = -1;
        var ch;

        while ((ch = str[++idx])) {
          this.consume(1);
          node.val += ch;
          if (ch === '\\') {
            ch += str[++idx];
            node.val += ch;
          }
          if (ch === chars[val]) {
            break;
          }
        }
      }

      return concatNodes.call(this, pos, node);
    })

    /**
     * Open
     */

    .capture('brace.open', function() {
      var pos = this.position();
      var m = this.match(/^\{(?!(?:[^\\}]?|,+)\})/);
      if (!m) return;

      var prev = this.prev();
      var val = m[0];

      var open = pos({
        type: 'brace.open',
        val: val
      });

      var node = pos({
        type: 'brace',
        nodes: [open]
      });

      utils.define(node, 'parent', prev);
      utils.define(open, 'parent', node);
      this.push('brace', node);
      prev.nodes.push(node);
    })

    /**
     * Close
     */

    .capture('brace.close', function() {
      var pos = this.position();
      var m = this.match(/^\}/);
      if (!m || !m[0]) return;

      var brace = this.pop('brace');
      var node = pos({
        type: 'brace.close',
        val: m[0]
      });

      if (!this.isType(brace, 'brace')) {
        if (this.options.strict) {
          throw new Error('missing opening "{"');
        }
        node.type = 'text';
        node.multiplier = 1;
        node.escaped = true;
        return node;
      }

      brace.nodes.push(node);
      utils.define(node, 'parent', brace);
    })

    /**
     * Inner
     */

    .capture('text', function() {
      var pos = this.position();
      var m = this.match(regex);
      if (!m) return;

      var node = pos({
        type: 'text',
        multiplier: 1,
        val: m[0]
      });

      return concatNodes.call(this, pos, node);
    });

};

/**
 * Combine text nodes, and calculate empty sets (`{,,}`)
 * @param {Function} `pos` Function to calculate node position
 * @param {Object} `node` AST node
 * @return {Object}
 */

function concatNodes(pos, node) {
  var prev = this.prev();
  var last = utils.last(prev.nodes);
  var re = /^\{(,+)\}/;
  var multi;

  var a = node.val.charAt(0);
  var b = node.val.slice(-1);

  if ((a === '"' && b === '"') || (a === '`' && b === '`') || (a === "'" && b === "'")) {
    node.val = node.val.slice(1, node.val.length - 1);
    node.escaped = true;
  }

  if (re.test(node.val)) {
    this.input = node.val + this.input;
    node.val = '';
  }

  while ((multi = re.exec(this.input))) {
    this.consume(multi[0].length);
    node.multiplier *= multi[1].length + 1;
  }

  if (last.type === 'text' && node.val && node.multiplier === 1 && last.multiplier === 1) {
    last.val += node.val;
    return;
  }

  return node;
}

/**
 * Create and cache regex to use for text nodes
 */

function textRegex(pattern) {
  if (cached) return cached;
  var opts = {contains: true, strictClose: false};
  var not = regexNot.create('(\\$?\\{|\\\\.|\\})', opts);
  var re = toRegex('^(?:\\{(,+|.?)\\}|' + not + ')', opts);
  return (cached = re);
}
