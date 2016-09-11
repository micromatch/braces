'use strict';

var utils = require('./utils');

module.exports = function(braces) {
  var output = [];

  braces.compiler

    /**
     * beginning-of-string
     */

    .set('bos', function(node) {
      return this.emit(node.val, node);
    })

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

    .set('noop', function(node) {
      return this.emit(node.val, node);
    })
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
     * Dots: ".."
     */

    .set('dots', function(node) {
      if (node.parent.type === 'brace' && node.parent.range === true) {
        return this.emit('-', node);
      }
      return this.emit(node.val, node);
    })

    /**
     * Braces: "{1..3}"
     */

    .set('brace', function(node) {
      return this.mapVisit(node.nodes);
    })
    .set('brace.literal', function(node) {
      return this.emit('\\{\\}', node);
    })
    .set('brace.open', function(node) {
      var isEscaped = this.options.nobrace
        || node.inner === '\\'
        || node.rest === '}'
        || node.rest === ' }'
        || node.rest === ''
        || !/\}/.test(node.rest);

      if (isEscaped) {
        node.parent.escaped = true;
      }

      if (node.rest === ' }') {
        this.next().nodes[1].val = '|';
      }

      if (node.parent.escaped) {
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
      var ch = node.val.slice(-1);

      var val = !node.parent.escaped ? utils.expand(node.val) : node.val;
      return this.emit(val, node);
    })
    .set('brace.close', function(node) {
      if (node.parent.escaped || this.output === '') {
        return this.emit('\\}', node);
      }
      if (node.parent.range === true) {
        return this.emit(']', node);
      }
      return this.emit(')', node);
    })

    /**
     * end-of-string
     */

    .set('eos', function(node) {
      return this.emit(node.val, node);
    });
};
