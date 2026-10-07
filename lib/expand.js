'use strict';

const fill = require('fill-range');
const stringify = require('./stringify');
const utils = require('./utils');
const { assertTree } = require('./depth-guard');

const append = (queue = '', stash = '', enclose = false) => {
  const result = [];

  queue = [].concat(queue);
  stash = [].concat(stash);

  if (!stash.length) return queue;
  if (!queue.length) {
    return enclose ? utils.flatten(stash).map(ele => `{${ele}}`) : stash;
  }

  for (const item of queue) {
    if (Array.isArray(item)) {
      for (const value of item) {
        result.push(append(value, stash, enclose));
      }
    } else {
      for (let ele of stash) {
        if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
        result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
      }
    }
  }
  return utils.flatten(result);
};

const expand = (ast, options = {}) => {
  assertTree(ast);
  const rangeLimit = options.rangeLimit === undefined ? 1000 : options.rangeLimit;

  const walk = (node, parentQueue) => {
    node.queue = [];
    const q = parentQueue;

    if (node.invalid || node.dollar) {
      q.push(append(q.pop(), stringify(node, options)));
      return;
    }

    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
      q.push(append(q.pop(), ['{}']));
      return;
    }

    if (node.nodes && node.ranges > 0) {
      // reduce normalizes range markers in place. Keep that work local so a
      // shared subtree retains its range arguments on every traversal.
      const args = utils.reduce(node.nodes.map(child => ({ type: child.type, value: child.value })));

      let step = args[2] || options.step || 1;
      // fill-range accepts a function or an options object as its third argument.
      if (typeof args[2] === 'function') step = 1;
      else if (args[2] && typeof args[2] === 'object' && !Array.isArray(args[2])) step = args[2].step || 1;
      if (utils.exceedsLimit(args[0], args[1], step, rangeLimit)) {
        throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
      }

      let range = fill(...args, options);
      if (range.length === 0) {
        range = stringify(node, options);
      }

      q.push(append(q.pop(), range));
      return;
    }

    const enclose = utils.encloseBrace(node);
    // Queue ownership follows the actual child traversal. A caller's parent
    // metadata must never supply an unvalidated external work queue.
    const queue = node.type === 'brace' || node.type === 'root' || parentQueue === undefined
      ? node.queue
      : parentQueue;

    for (let i = 0; i < node.nodes.length; i++) {
      const child = node.nodes[i];

      if (child.type === 'comma' && node.type === 'brace') {
        if (i === 1) queue.push('');
        queue.push('');
        continue;
      }

      if (child.type === 'close') {
        q.push(append(q.pop(), queue, enclose));
        continue;
      }

      if (child.value && child.type !== 'open') {
        queue.push(append(queue.pop(), child.value));
        continue;
      }

      if (child.nodes) {
        walk(child, queue);
      }
    }

    return queue;
  };

  return utils.flatten(walk(ast));
};

module.exports = expand;
