'use strict';

var utils = require('./utils');

module.exports = function(brace) {
  var not = utils.not('[!{}\\\\/]+');

  brace.parser

    /**
     * Character parsers
     */

    .capture('escape', /^\\(?![{}])(.)/)
    .capture('comma', /^,/)
    .capture('slash', /^\//)

    .capture('text', function() {
      if (this.isInside('brace')) return;
      var parsed = this.parsed;
      var pos = this.position();
      var re = new RegExp(not);
      var m = this.match(re);
      if (!m || !m[0]) return;
      var node = pos({
        type: 'text',
        val: m[0]
      });

      utils.define(node, 'rest', this.input);
      return node;
    })

    /**
     * Parse braces: '{1..3}'
     */

    .capturePair('brace', /^(\\)?\{(?!\})/, /^(\\)?\}/)
    .capture('brace.literal', /^\{\}/)
    .capture('brace.inner', function() {
      if (!this.isInside('brace')) return;
      var parsed = this.parsed;
      var pos = this.position();
      var re = new RegExp(not);
      var m = this.match(re);
      if (!m || !m[0]) return;
      console.log(m)

      var node = pos({
        type: 'brace.inner',
        val: m[0],
      });

      utils.define(node, 'rest', this.input);
      utils.define(node, 'parsed', parsed);
      return node;
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

      utils.define(node, 'rest', this.input);
      return node;
    })

    .capture('dots', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(/^[.]{2}/);
      if (!m || !m[0]) return;

      var prev = this.prev();
      var node = pos({
        type: 'dots',
        val: m[0]
      });

      if (prev.type === 'brace') {
        prev.range = true;
      }
      utils.define(node, 'rest', this.input);
      return node;
    })
};
