'use strict';

var utils = require('./utils');
var regex;

module.exports = function(brace) {
  var not = regex || (regex = new RegExp('\\$?(\\{(.|,+)?\\})|' + utils.not('(\\$?\\{|\\\\.|\\})+')));

  brace.parser.sets.brace = brace.parser.sets.brace || [];
  if (brace.parser.options.makeRe) {
    brace.parser.capture('brace.multiple', /\{,+\}/);
  }

  brace.parser

    /**
     * Character parsers
     */

    .capture('escape', function() {
      var pos = this.position();
      var m = this.match(/^(?:\\(.)|\$\{)/);
      if (!m) return;

      var tok = pos({
        type: 'escape',
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
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(/^\{(?!.?\})/);
      if (!m) return;

      var val = m[0];
      var open = pos({
        type: 'brace.open',
        val: val,
        rest: this.input
      });

      var prev = this.prev();
      var node = pos({
        type: 'brace',
        nodes: [open]
      });

      utils.define(node, 'rest', this.input);
      utils.define(node, 'parsed', parsed);
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

      var parent = this.pop('brace');
      var node = pos({
        type: 'brace.close',
        rest: this.input,
        suffix: m[1],
        val: m[0]
      });

      if (!this.isType(parent, 'brace')) {
        if (this.options.strict) {
          throw new Error('missing opening "{"');
        }
        node.type = 'brace.inner';
        node.escaped = true;
        return node;
      }

      if (node.suffix === '\\') {
        parent.escaped = true;
        node.escaped = true;
      }

      parent.nodes.push(node);
      utils.define(node, 'parent', parent);
    })

    .capture('brace.inner', function() {
      var parsed = this.parsed;
      var pos = this.position();
      var m = this.match(not);
      if (!m) return;

      var prev = this.prev();
      var tok = pos({type: 'brace.inner', val: m[0]});
      console.log(tok)
      // var idx = -1;
      // function next() {
      //   return input[++idx];
      // }

      // while (this.input[idx + 1] && !/[{$}]/.test(this.input[idx + 1])) {
      //   var ch = next();
      //   if (ch === '\\') {
      //     ch = !this.options.unescape ? ch += next() : ch + next();
      //   }
      //   tok.val += ch;
      // }

      // this.consume(tok.val.length - m[0].length);
      var lastChar = tok.val.slice(-1);
      // if (lastChar === '{' && this.input.charAt(0) === '}') {
      //   this.consume(1);
      //   tok.val += '}';
      // }

      if (tok.val.charAt(0) === '"' && lastChar === '"') {
        tok.val = tok.val.slice(1, tok.val.length - 1);
        prev.escaped = true;
        tok.escaped = true;
      }

      if (this.options.expand && prev.type !== 'brace') {
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
