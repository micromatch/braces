'use strict';

var utils = require('./utils');

module.exports = function(brace) {
  var not = utils.not('([!|{}]|\\$\\{|\\{,\\}|\\\\.|\\{|\\})+');

  brace.parser

    /**
     * Character parsers
     */

    .capture('escape', function() {
      var pos = this.position();
      var m = this.match(/^\\(.)/);
      if (!m) return;
      return pos({
        type: 'escape',
        val: m[0]
      });
    })

    /**
     * Parse braces: '{1..3}'
     */

    .capturePair('brace', /^\$?\{/, /^\}/)
    .capture('brace.inner', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(new RegExp(not));
      if (!m) return;

      var val = m[0];
      var len = this.input.length;
      var tok = pos({type: 'brace.inner'});

      var idx = -1;
      var input = this.input;
      function next() {
        return input[++idx];
      }

      while (this.input[idx + 1] && !/[{$}]/.test(this.input[idx + 1])) {
        var ch = next();
        if (ch === '\\') {
          ch = !this.options.unescape ? ch += next() : ch + next();
        }
        val += ch;
      }

      this.consume(val.length - m[0].length);
      var prev = this.prev();

      if (this.options.expand && prev.type !== 'brace') {
        prev.escaped = true;
        tok.escaped = true;
      }

      tok.val = val;
      return tok;
    })

  if (brace.options.expand !== true) {
    brace.parser
      .capturePair('brace', /^\$?\{(?!(?:[}]|,+\}))/, /^\}/)
      .capture('brace.multiplier', /^(\{,+\})+/)
      .capture('brace.literal', /^\{\}/)
  }
};
