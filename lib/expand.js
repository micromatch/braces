'use strict';

const stringify = require('./stringify');
const compile = require('./compile');
const utils = require('./utils');

const append = (queue = '', stash = '', enclose = false) => {
  let result = [];

  queue = [].concat(queue);
  stash = [].concat(stash);

  if (!stash.length) return queue;
  if (!queue.length) {
    return enclose ? utils.flatten(stash).map(ele => `{${ele}}`) : stash;
  }

  for (let item of queue) {
    if (Array.isArray(item)) {
      for (let value of item) {
        result.push(append(value, stash, enclose));
      }
    } else {
      for (let ele of stash) {
        if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
        result.push(Array.isArray(ele) ? append(item, ele, enclose) : (item + ele));
      }
    }
  }
  return result;
};

const expand = (ast, options = {}) => {
  let walk = (node, parent = {}) => {
    let enclose = utils.encloseBrace(node);
    // let invalid = options.escapeInvalid && utils.isInvalidBrace(parent);
    node.queue = [];

    if (node.invalid || node.dollar) {
      parent.queue.push(append(parent.queue.pop(), compile(node, options)));
      return;
    }

    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
      parent.queue.push(append(parent.queue.pop(), ['{}']));
      return;
    }

    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i];

      if (child.type === 'comma') {
        node.queue.push('');

        if (i === 1) {
          node.queue.push('');
        }
        continue;
      }

      if (child.type === 'text') {
        node.queue.push(append(node.queue.pop(), child.value));
        continue;
      }

      if (child.type === 'close') {
        parent.queue.push(append(parent.queue.pop(), node.queue, enclose));
        continue;
      }

      if (child.nodes) {
        walk(child, node);
      }
    }

    return node.queue;
  };

  return utils.flatten(walk(ast));
};

module.exports = expand;
