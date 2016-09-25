'use strict';

var utils = require('./utils');
var regex;

module.exports = function(brace) {
  var not = regex || (regex = new RegExp('\\$?(\\{.?\\})|' + utils.not('(\\$?\\{|\\\\.|\\})')));

  // if (brace.parser.options.makeRe) {
  //   brace.parser.capture('brace.multiple', /\{,+\}/);
  // }

  brace.parser.sets.brace = brace.parser.sets.brace || [];
  brace.parser

    /**
     * Character parsers
     */

    .capture('escape', function() {
      var pos = this.position();
      var m = this.match(/^(?:\\(.)|\$\{)/);
      if (!m) return;

      var tok = pos({
        type: 'brace.inner',
        val: m[0]
      });

      if (tok.val === '${') {
        tok.val = '\\$\\{';
        var str = this.input;
        var idx = -1;
        var ch;

        while ((ch = str[++idx])) {
          this.consume(1);
          tok.val += ch;
          if (ch === '\\') {
            ch += str[++idx];
            tok.val += ch;
          }
          if (ch === '}') {
            break;
          }
        }
      }

      var prev = this.prev();
      var last = utils.last(prev.nodes);
      if (last.type === 'brace.inner') {
        last.val += tok.val;
        return;
      }

      return tok;
    })

    /**
     * Open
     */

    .capture('brace.open', function() {
      var pos = this.position();
      var m = this.match(/^\{(?!.?\})/);
      if (!m) return;

      var val = m[0];
      var open = pos({
        type: 'brace.open',
        val: val
      });

      var prev = this.prev();
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
        node.type = 'brace.inner';
        node.escaped = true;
        return node;
      }

      brace.nodes.push(node);
      utils.define(node, 'parent', brace);
    })

    .capture('brace.inner', function() {
      var pos = this.position();
      var m = this.match(not);
      if (!m) return;

      var prev = this.prev();
      var tok = pos({type: 'brace.inner', val: m[0]});

      var lastChar = tok.val.slice(-1);
      if (tok.val.charAt(0) === '"' && lastChar === '"') {
        tok.val = tok.val.slice(1, tok.val.length - 1);
        prev.escaped = true;
        tok.escaped = true;
      }

      var last = utils.last(prev.nodes);
      if (last.type === 'brace.inner') {
        last.val += tok.val;
        return;
      }

      return tok;
    });

};
