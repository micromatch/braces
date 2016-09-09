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
      return this.emit(node.val, node);
    })

    /**
     * Text
     */

    .set('text', function(node) {
      var parent = node.parent;
      var type = parent.type;
      if (type === 'brace') {
        var prev = this.prev();
        var next = this.next();
        console.log(node)
        console.log(prev)
        console.log(next)
        console.log('--------------')
        var segs = node.val.split(',');
        if (segs.length === 1) {
          output.push(node.val);
        } else {
          var temp = [];
          segs.forEach(function(val) {
            if (!output.length) output.push('');
            output.forEach(function(str) {
              temp.push(str + val);
            });
          });
          output = temp;
        }
      } else {
        output.push(node.val);
      }
      return this.emit(node.val, node);
    })

    /**
     * Dots: ".."
     */

    .set('dots', function(node) {
      return this.emit(node.val, node);
    })

    /**
     * Braces: "{1..3}"
     */

    .set('brace', function(node) {
      return this.mapVisit(node.nodes);
    })
    .set('brace.open', function(node) {
      if (this.options.nobrace === true) {
        return '\\' + node.val;
      }
      return '(';
    })
    .set('brace.close', function(node) {
      if (this.options.nobrace === true) {
        return '\\' + node.val;
      }
      if (!/[\{\}]/.test(node.rest || '')) {
        var temp = [];
        output.forEach(function(str) {
          temp.push(str + node.rest);
        });
        this.braces = temp;
      }
      return ')';
    })

    /**
     * end-of-string
     */

    .set('eos', function(node) {
      return this.emit(node.val, node);
    });
};
