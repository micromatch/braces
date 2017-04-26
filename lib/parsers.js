'use strict';

var utils = require('./utils');

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

      var prev = this.prev();
      var last = utils.last(prev.nodes);

      var node = pos({
        type: 'text',
        multiplier: 1,
        val: m[0]
      });

      if (node.val === '\\\\') {
        return node;
      }

      if (node.val === '${') {
        var str = this.input;
        var idx = -1;
        var ch;

        while ((ch = str[++idx])) {
          this.consume(1);
          node.val += ch;
          if (ch === '\\') {
            node.val += str[++idx];
            continue;
          }
          if (ch === '}') {
            break;
          }
        }
      }

      if (this.options.unescape !== false) {
        node.val = node.val.replace(/\\([{}])/g, '$1');
      }

      if (last.val === '"' && this.input.charAt(0) === '"') {
        last.val = node.val;
        this.consume(1);
        return;
      }

      return concatNodes.call(this, pos, node);
    })

    /**
     * Brackets: "[...]" (basic, this can be overridden by other parsers)
     */

    .capture('bracket', function() {
      var pos = this.position();
      var m = this.match(/^(?:\[([!^]?)([^\]]{2,}|\]\-)(\]|[^*+?]+)|\[)/);
      if (!m) return;

      var val = m[0];
      var negated = m[1] ? '^' : '';
      var inner = m[2] || '';
      var close = m[3] || '';

      var esc = this.input.slice(0, 2);
      if (inner === '' && esc === '\\]') {
        inner += esc;
        this.consume(2);

        var str = this.input;
        var idx = -1;
        var ch;

        while ((ch = str[++idx])) {
          this.consume(1);
          if (ch === ']') {
            close = ch;
            break;
          }
          inner += ch;
        }
      }

      return pos({
        type: 'bracket',
        val: val,
        escaped: close !== ']',
        negated: negated,
        inner: inner,
        close: close
      });
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
        node.multiplier = 0;
        node.escaped = true;
        return node;
      }

      brace.nodes.push(node);
      utils.define(node, 'parent', brace);
    })

    /**
     * Inner
     */

    .capture('nobrace', function() {
      var pos = this.position();
      var m = this.match(/^\{[^,]?\}/);
      if (!m) return;

      return pos({
        type: 'text',
        multiplier: 0,
        val: m[0]
      });
    })

    .capture('multiplier', function() {
      var pos = this.position();
      var m = this.match(/^\{(,+)\}/);
      if (!m) return;

      this.multiplier = true;
      var node = pos({
        type: 'text',
        multiplier: 1,
        val: m[0]
      });

      return concatNodes.call(this, pos, node);
    })

    .capture('text', function() {
      var pos = this.position();
      var m = this.match(/^(?!\\)[^${}\[\]]/);
      if (!m) return;

      var val = m[0];
      var node = pos({
        type: 'text',
        multiplier: 1,
        val: val
      });

      if (val === ',') {
        var prev = this.prev();
        var last = utils.last(prev.nodes);
        var next = this.input.charAt(0);
        if (next === '{' || next === '"' || next === '\'' || next === '`') {
          if (last.type === 'text') {

            last.val += val;
            return;
          }
        }
      }

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
  node.orig = node.val;
  var prev = this.prev();
  var last = utils.last(prev.nodes);
  var regex = /^\{(,+)\}/;
  var multi;
  var sets = [];
  var isEscaped = false;

  if (node.val.length > 1) {
    var a = node.val.charAt(0);
    var b = node.val.slice(-1);

    isEscaped = (a === '"' && b === '"')
      || (a === "'" && b === "'")
      || (a === '`' && b === '`');
  }

  if (isEscaped) {
    node.val = node.val.slice(1, node.val.length - 1);
    node.escaped = true;
  }

  if (regex.test(node.val)) {
    this.input = node.val + this.input;
    node.val = '';
  }

  while ((multi = regex.exec(this.input))) {
    this.consume(multi[0].length);
    node.multiplier *= multi[1].length + 1;
    sets.push(multi[0]);
  }

  if (last.type === 'text' && node.val && node.multiplier === 1 && last.multiplier === 1) {
    last.val += node.val;
    return;
  }

  node.sets = sets;
  return node;
}
