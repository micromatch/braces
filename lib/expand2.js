'use strict';

var utils = require('./utils');

module.exports = function(braces) {
  braces.compiler

    /**
     * bos
     */

    .set('bos', function() {
      this.ast.queue = isEscaped(this.ast) ? [this.ast.val] : [];
    })

    /**
     * Brace
     */

    .set('brace', function(node) {
      node.queue = isEscaped(node) ? [node.val] : [];
      return this.mapVisit(node.nodes);
    })

    /**
     * Open
     */

    .set('brace.open', function(node) {
      if (node.escaped || !node.parent.hasSet) {
        node.parent.queue.push(node.val);
        return;
      }

      if (this.options.optimize && !node.parent.escaped) {
        node.parent.optimize = true;
        node.parent.queue.push('(');
      }
    })

    /**
     * Inner
     */

    .set('brace.inner', function(node) {
      var segs = [node.val];

      if (isType(node.parent, 'brace') && !isEscaped(node) && node.hasSet) {
        segs = utils.expand(node.val, this.options).segs;
      }

      if ((node.val && segs.length === 0) || (node.embrace && node.hasSet)) {
        segs = ['{' + node.val + '}'];

        if (node.parent.optimize && node.parent.queue.length === 1) {
          node.parent.optimize = false;
          node.parent.queue.pop();
        }
      }

      if (!hasQueue(node.parent)) {
        node.parent.queue = segs;
        return;
      }

      var last = node.parent.queue.pop();
      var temp = utils.join(utils.flatten(last), segs.shift());

      node.parent.queue.push(temp);
      node.parent.queue.push.apply(node.parent.queue, segs);
    })

    /**
     * Close
     */

    .set('brace.close', function(node) {
      var prev = node.parent.parent;
      var last = prev.queue.pop();

      if (node.val === '\\}') {
        last = utils.join(last, node.val);
      }

      var queue = node.parent.queue;
      if (!node.parent.hasSet && (!last || typeof last === 'string' || queue.length === 1)) {
        queue = utils.join(queue, node.val);
      } else if (node.parent.optimize && !node.parent.no_close) {
        queue = utils.join(queue, ')');
      }

      var arr = utils.flatten(utils.join(last, queue));
      prev.queue.push(arr);
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
    });

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

function isEscaped(node) {
  return node.val && node.escaped === true;
}

function isType(node, type) {
  return node && node.type === type;
}

function hasQueue(node) {
  return Array.isArray(node.queue) && node.queue.length;
}
