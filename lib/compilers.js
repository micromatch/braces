'use strict';

var utils = require('./utils');

module.exports = function(braces) {
  var output = [];

  braces.compiler

    /**
     * Negation / escaping
     */

    .set('not', function(node) {
      return this.emit('', node);
    })
    .set('escape', function(node) {
      return this.emit(node.inner, node);
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
        return this.emit('\\/?', node);
      }
      return this.emit('\\/', node);
    })

    /**
     * Braces: "{1..3}"
     */

    .set('brace', function(node) {
      // console.log(node.nodes)
      return this.mapVisit(node.nodes);
    })
    .set('brace.literal', function(node) {
      return this.emit('\\{\\}', node);
    })
    .set('brace.exponent', function(node) {
      if (!this.output.length) {
        return this.emit('', node);
      }
      // TODO: a{,,}{,,} (maybe, this seems like a hacky bash feature)
      var len = Math.pow(2, node.val.split(/\{,+\}/).length - 1);
      return this.emit('{' + Math.max(len, 2) + '}', node);
    })
    .set('brace.open', function(node) {
      if (node.rest === ' }') {
        this.next().nodes[1].val = '|';
      }

      if (node.val === '${') {
        return this.emit('\\$\\{', node);
      }

      if (node.parent.escaped || node.val === '\\{') {
        return this.emit('\\{', node);
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
      if (node.parent.escaped) {
        return this.emit(node.val, node);
      }

      var val = node.val;
      var esc = false;

      if (!node.parent.escaped) {
        val = utils.expand(node.val);
        if (val === node.val) {
        }
      }


      if (/^-?\(/.test(val) && val.slice(-1) === ')' || !val.length) {
        this.output = this.output.slice(0, this.output.length - 1);
        node.parent.noclose = true;
      }

      if (val.length === 1 && node.parent.nodes.length <= 4) {
        this.output = this.output.slice(0, this.output.length - 1);
        node.parent.noclose = true;
      }

      return this.emit(val, node);
    })
    .set('brace.close', function(node) {
      if (node.parent.noclose === true) {
        return this.emit('', node);
      }
      if (node.parent.escaped || this.output === '') {
        return this.emit('\\}', node);
      }
      if (node.parent.range === true) {
        return this.emit(']', node);
      }
      return this.emit(')', node);
    });
};
