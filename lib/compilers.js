'use strict';

var utils = require('./utils');

module.exports = function(braces) {
  var output = [];

  braces.compiler
    .use(function() {
      this.define('emitEscaped', function(val, node) {
        if (/^\w/.test(val)) {
          return this.emit(val, node);
        }
        if (this.options.noescape !== true) {
          return this.emit(utils.escapeRegex(val), node);
        }
        this.emit(val, node);
      });
    })

    /**
     * Negation / escaping
     */

    .set('not', function(node) {
      return this.emit('', node);
    })
    .set('escape', function(node) {
      return this.emitEscaped(node.val, node);
    })

    /**
     * Misc
     */

    .set('text', function(node) {
      return this.emit(node.val, node);
    })
    .set('comma', function(node) {
      if (node.parent.type === 'brace' && node.parent.escaped) {
        return this.emit(node.val, node);
      }
      return this.emit('|', node);
    })

    /**
     * Slashs: "/" and "\"
     */

    .set('slash', function(node) {
      if (node.parsed === '**') {
        return this.emitEscaped('/?', node);
      }
      return this.emitEscaped('/', node);
    })

    /**
     * Braces: "{1..3}"
     */

    .set('brace', function(node) {
      return this.mapVisit(node.nodes);
    })
    .set('brace.literal', function(node) {
      return this.emitEscaped('{}', node);
    })
    // TODO: a{,,}{,,} (maybe, this seems like a hacky bash feature)
    .set('brace.exponent', function(node) {
      if (!this.output.length) {
        return this.emit('', node);
      }
      var len = Math.pow(2, node.val.split(/\{,+\}/).length - 1);
      return this.emit('{' + Math.max(len, 2) + '}', node);
    })
    .set('brace.open', function(node) {
      var escaped = node.escaped || node.parent.escaped;
      if (node.rest === ' }') {
        this.next().nodes[1].val = '|';
      }
      if (escaped || node.val === '\\{') {
        return this.emitEscaped(node.val, node);
      }
      // if `parent.nodes` is not 5 nodes, it's not a valid range
      if (node.parent.nodes.length !== 5) {
        node.parent.range = false;
      }
      if (node.parent.range === true) {
        return this.emit('[', node);
      }
      return this.emit('(', node);
    })
    .set('brace.inner', function(node) {
      var escaped = node.escaped || node.parent.escaped;
      if (escaped) {
        return this.emitEscaped(node.val, node);
      }

      var len = node.parent.nodes.length;
      var val = node.val;
      var esc = false;

      if (!escaped) {
        var tok = utils.expand(node.val);
        if (tok.val && tok.rest) {
          val = tok.val + '|' + tok.rest;
        } else {
          val = tok.val || node.val;
        }

        if (val === node.val && len <= 4) {
          node.parent.escaped = true;
          this.output = this.output.slice(0, this.output.length - 1);
          this.output += '\\{';
          return this.emitEscaped(val, node);
        }
      }

      if (val.length === 0 || (val.length === 1 && len <= 4)) {
        this.output = this.output.slice(0, this.output.length - 1);
        node.parent.noclose = true;
        return this.emit(val, node);
      }

      if (/^-?\(/.test(val) && val.slice(-1) === ')') {
        this.output = this.output.slice(0, this.output.length - 1);
        node.parent.noclose = true;
      }

      return this.emit(val, node);
    })
    .set('brace.close', function(node) {
      var escaped = node.escaped || node.parent.escaped;
      if (node.parent.escapedComma && node.rest) {

        this.output = this.output.replace(/\(([^(]+)$/, '\\{$1');
        return this.emitEscaped('}', node);
      }

      if (node.parent.noclose === true) {
        return this.emit('', node);
      }
      if (escaped || this.output === '') {
        return this.emitEscaped('}', node);
      }
      if (node.parent.range === true) {
        return this.emit(']', node);
      }
      return this.emit(')', node);
    })
    .set('eos', function(node) {
      this.output = this.output.replace(/\\,/g, ',');
    });
};
