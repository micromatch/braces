'use strict';

var utils = require('./utils');

module.exports = function(braces) {
  var count = 0;

  braces.compiler

    /**
     * Negation / escaping
     */

    .set('bos', function(node) {
    })
    .set('escape', function(node) {
      return this.emit(node.val, node);
    })

    /**
     * Brace
     */

    .set('brace', function(node) {
      node.queue = [];
      node.count = count++;
      return this.mapVisit(node.nodes);
    })

    .set('brace.open', function(node) {
    })
    .set('brace.inner', function(node) {
      var segs = node.parent.type === 'brace'
        ? expand(node, this.options)
        : [node.val];

      if (!node.parent.queue.length) {
        node.parent.queue = segs;
        return;
      }
      var last = node.parent.queue.pop();
      var temp = utils.join(utils.flatten(last), segs.shift());
      node.parent.queue.push(temp);
      node.parent.queue.push.apply(node.parent.queue, segs);
    })
    .set('brace.close', function(node) {
      if (!node.parent.parent) return;
      var prev = node.parent.parent;

      if (node.escaped) {
        var val = node.parent.queue.pop();
        val = '\\' + node.val + val;
        node.parent.queue.push(val);
      }

      var last = prev.queue.pop();
      var temp = utils.join(last, node.parent.queue);
      prev.queue.push(temp);
    })

    /**
     * eos
     */

    .set('eos', function(node) {
      if (Array.isArray(utils.last(this.ast.queue))) {
        this.output = utils.flatten(this.ast.queue.pop());
      } else {
        this.output = utils.flatten(this.ast.queue);
      }
    })
};

/**
 * Expand `node.val`
 */

function expand(node, options) {
  var segs = [];

  if (node.val.length <= 1) {
    segs = [node.val];
  } else {
    segs = utils.expand(node.val, {toRegex: false}).segs;
  }

  return segs;
}

