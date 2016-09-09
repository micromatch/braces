'use strict';

var utils = require('./utils');

module.exports = function(brace) {
  brace.parser

    /**
     * Character parsers
     */

    .capture('escape', /^\\(.)/)

    /**
     * Parse braces: '{1..3}'
     */

    .capturePair('brace', /^\{/, /^\}/)
    .capture('text', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var re = new RegExp(utils.not('[{}]'));
      var m = this.match(re);
      if (!m || !m[0]) return;
      return pos({
        type: 'text',
        inside: this.isInside('brace'),
        val: m[0]
      });
    })

    /**
     * Parse negations
     */

    .capture('not', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(/^\!/);
      if (!m || !m[0]) return;

      var prev = this.prev();
      var node = pos({
        type: 'not',
        val: m[0]
      });

      // if nothing has been parsed, we know `!` is at the start,
      // so we need to wrap the result in a negation regex
      if (!parsed) {
        this.bos.val = '(?!^(?:';
        this.append = ')$).*';
        node.val = '';
      }

      utils.define(node, 'parent', prev);
      prev.nodes.push(node);
      return node;
    });
};
