'use strict';

const fill = require('fill-range');
const utils = require('./utils');

const compile = (ast, options = {}) => {
  const maxDepth = typeof options.maxDepth === 'number' ? options.maxDepth : 64;
  const walk = (node, parent = {}, depth = 0) => {
    if (depth > maxDepth) {
      throw new RangeError('input exceeds maximum nesting depth. Use options.maxDepth to increase or disable the limit.');
    }
    const invalidBlock = utils.isInvalidBrace(parent);
    const invalidNode = node.invalid === true && options.escapeInvalid === true;
    const invalid = invalidBlock === true || invalidNode === true;
    const prefix = options.escapeInvalid === true ? '\\' : '';
    let output = '';

    if (node.isOpen === true) {
      return prefix + node.value;
    }

    if (node.isClose === true) {
      return prefix + node.value;
    }

    if (node.type === 'open') {
      return invalid ? prefix + node.value : '(';
    }

    if (node.type === 'close') {
      return invalid ? prefix + node.value : ')';
    }

    if (node.type === 'comma') {
      return node.prev.type === 'comma' ? '' : invalid ? node.value : '|';
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes && node.ranges > 0) {
      const args = utils.reduce(node.nodes);
      const range = fill(...args, { ...options, wrap: false, toRegex: true, strictZeros: true });

      if (range.length !== 0) {
        return args.length > 1 && range.length > 1 ? `(${range})` : range;
      }
    }

    if (node.nodes) {
      for (const child of node.nodes) {
        output += walk(child, node, depth + 1);
      }
    }

    return output;
  };

  return walk(ast);
};

module.exports = compile;
