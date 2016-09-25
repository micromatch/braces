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

    .set('escape', function(node) {
      if (!hasQueue(node.parent)) {
        node.parent.queue = [node.val];
        return;
      }

      var last = node.parent.queue.pop();
      var temp = utils.join(last, [node.val]);
      node.parent.queue.push(temp);
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
      node.parent.open = node.val;
    })

    /**
     * Inner
     */

    .set('brace.inner', function(node) {
      var queue = node.parent.queue;
      var segs = [node.val];
      var escape = false;

      if (node.val.length > 1) {
        if (isType(node.parent, 'brace') && !isEscaped(node)) {
          var expanded = utils.expand(node.val, this.options)
          segs = expanded.segs;

          if (!segs.length) {
            var val = expanded.val || node.val;
            segs = [val];
            escape = true;
          }
        }
      } else if (node.val === ',') {
        segs = ['|'];
      } else {
        escape = true;
      }

      if (escape && isType(node.parent, 'brace') && node.parent.nodes.length <= 4) {
        node.parent.escaped = true;
      }

      if (!hasQueue(node.parent)) {
        node.parent.queue = segs;
        return;
      }

      var last = utils.arrayify(queue.pop());
      var temp = utils.join(utils.flatten(last), segs.shift());

      queue.push(temp);
      queue.push.apply(queue, segs);
    })

    /**
     * Close
     */

    .set('brace.close', function(node) {
      var queue = node.parent.queue;
      var prev = node.parent.parent;
      var last = prev.queue.pop();

      var open = node.parent.open;
      var close = node.val;

      if (open && close && isOptimized(node, this.options)) {
        open = '(';
        close = ')';
      }

      // if a close brace exists, and the previous segment is one character
      // don't wrap the result in braces or parens
      var ele = utils.last(queue);
      if (close && typeof ele === 'string' && ele.length === 1) {
        open = '';
        close = '';
      }

      queue.push(open + (queue.pop() || ''));


      if (typeof last === 'string' || queue.length === 1) {
        queue = utils.join(queue, close);
      }

      var arr = utils.flatten(utils.join(last, queue));
      prev.queue.push(arr);
    })

    /**
     * eos
     */

    .set('eos', function(node) {
      this.output = utils.last(utils.flatten(this.ast.queue));
      // if (Array.isArray(utils.last(this.ast.queue))) {
      //   this.output = utils.flatten(this.ast.queue.pop());
      // } else {
      //   this.output = utils.flatten(this.ast.queue);
      // }
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
    segs = utils.expand(node.val, options).segs;
  }
  return segs;
}

function isEscaped(node) {
  return node.escaped === true;
}

/**
 * Returns true if regex parens should be used for sets. If the parent `type`
 * is not `brace`, then we're on a root node, which means we should never
 * expand segments and open/close braces should be `{}` (since this indicates
 * a brace is missing from the set)
 */

function isOptimized(node, options) {
  return isType(node.parent, 'brace')
    && (options.optimize || options.makeRe)
    && !isEscaped(node.parent)
    && !isEscaped(node)
}

function isType(node, type) {
  return node && node.type === type;
}

function hasQueue(node) {
  return Array.isArray(node.queue) && node.queue.length;
}
