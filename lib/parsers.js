'use strict';

var utils = require('./utils');

module.exports = function(brace) {
  var not = utils.not('[!|{}\\\\\\/]+|\\{,\\}|\\$\\{');

  brace.parser

    /**
     * Character parsers
     */

    .capture('quotes', /^"/)
    .capture('slash', /^\//)
    .capture('escape', function() {
      var pos = this.position();
      var m = this.match(/^\\(.)/);
      if (!m) return;
      var prev = this.prev();

      if (prev.type === 'brace') {
        if (m[0] === '\\,') {
          prev.escapedComma = true;
        }
      }
      return pos({
        type: 'escape',
        val: m[0]
      });
    })
    .capture('comma', function() {
      if (this.isInside('brace')) return;
      var pos = this.position();
      var m = this.match(/^,/);
      if (!m) return;
      return pos({
        type: 'comma',
        val: m[0]
      });
    })
    .capture('text', function() {
      if (this.isInside('brace')) return;
      var pos = this.position();
      var re = new RegExp(not);
      var m = this.match(re);
      if (!m) return;
      return pos({
        type: 'text',
        val: m[0]
      });
    })

    /**
     * Parse braces: '{1..3}'
     */

    .capturePair('brace', /^\$?\{(?!(?:[}]|,+\}))/, /^\}/, function(node, parent) {
      parent.escaped = parent.escaped
        || this.options.nobrace
        || node.val.charAt(0) === '"'
        || node.inner === '\\'
        || node.inner === '$'
        || node.val === '${'
        || node.rest === ' }'
        || node.rest === '}'
        || node.rest === ''
        || !/\}/.test(node.rest);

    })
    .capture('brace.exponent', /^(\{,+\})+/)
    .capture('brace.literal', /^\{\}/)
    .capture('brace.inner', function() {
      if (!this.isInside('brace')) return;
      var pos = this.position();
      var m = this.match(new RegExp(not));
      if (!m) return;

      var prev = this.prev();
      var val = m[0];
      var tok = pos({
        type: 'brace.inner',
        inner: m[1],
        val: val
      });

      if (m[1] === '"') {
        prev.escaped = true;
        val = val.slice(1, val.length - 1);
      }

      if (m[0] === '\\,') {
        prev.escaped = true;
        val = ',';
      }

      if (!/\.\.|,/.test(val) && val.length > 1) {
        var ch = this.input.charAt(0);
        if (/^[{}]/.test(ch)) {
          prev.escaped = true;
          tok.escaped = true;
        }
      }

      tok.val = val;
      return tok;

      // var prev = this.prev();
      // var nodes = prev.nodes;
      // var len = nodes.length;
      // var value = tok.val;

      // while (len--) {
      //   var node = nodes[len];
      //   if (node.type === 'escape' || node.type === 'brace.inner') {
      //     if (node.type === 'escape') {
      //       tok.escaped = true;
      //     }
      //     if (node.val === '\\,') {
      //       prev.escaped = true;
      //       tok.escaped = true;
      //     }
      //     node.val += value
      //     value = node.val;
      //     nodes.splice(len, 1);
      //   } else {
      //     break;
      //   }
      // }

      // tok.val = value;
      // return tok;
    })

};
