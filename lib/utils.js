'use strict';

exports.isInteger = num => {
  if (typeof num === 'number') {
    return Number.isInteger(num);
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isInteger(Number(num));
  }
  return false;
};

/**
 * Find a node of the given type
 */

exports.find = (node, type) => node.nodes.find(node => node.type === type);

/**
 * Find a node of the given type
 */

exports.exceedsLimit = (min, max, step = 1, limit) => {
  const validValue = value => typeof value === 'number' || (typeof value === 'string' && value !== '');
  if (!validValue(min) || !validValue(max)) return false;

  // Match fill-range's fallback for zero steps and object-valued options.step.
  step = step || 1;
  if (typeof step === 'object' && !Array.isArray(step) && !Number.isInteger(+step)) step = 1;
  if (!Number.isInteger(+step)) return false;
  step = Math.max(Math.abs(step), 1);

  let a = +min;
  let b = +max;
  if (Number.isInteger(a) && Number.isInteger(b)) {
    // A unit increment can stop making progress outside the safe integer
    // domain. Disabling a size limit must not permit that nonterminating loop.
    if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b)) {
      throw new RangeError('numeric range endpoints must be safe integers');
    }
  } else {
    // fill-range counts letters by their first UTF-16 code unit. Numeric
    // strings remain valid mixed endpoints, even when they have several digits.
    if ((!Number.isInteger(a) && min.length > 1) || (!Number.isInteger(b) && max.length > 1)) return false;
    a = String(min).charCodeAt(0);
    b = String(max).charCodeAt(0);
  }

  if (limit === false || limit === Infinity) return false;
  return Math.floor(Math.abs(b - a) / step) + 1 > limit;
};

/**
 * Escape the given node with '\\' before node.value
 */

exports.escapeNode = (block, n = 0, type) => {
  const node = block.nodes[n];
  if (!node) return;

  if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
    if (node.escaped !== true) {
      node.value = '\\' + node.value;
      node.escaped = true;
    }
  }
};

/**
 * Returns true if the given brace node should be enclosed in literal braces
 */

exports.encloseBrace = node => {
  if (node.type !== 'brace') return false;
  if ((node.commas >> 0 + node.ranges >> 0) === 0) {
    node.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a brace node is invalid.
 */

exports.isInvalidBrace = block => {
  if (block.type !== 'brace') return false;
  if (block.invalid === true || block.dollar) return true;
  if ((block.commas >> 0 + block.ranges >> 0) === 0) {
    block.invalid = true;
    return true;
  }
  if (block.open !== true || block.close !== true) {
    block.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a node is an open or close node
 */

exports.isOpenOrClose = node => {
  if (node.type === 'open' || node.type === 'close') {
    return true;
  }
  return node.open === true || node.close === true;
};

/**
 * Reduce an array of text nodes.
 */

exports.reduce = nodes => nodes.reduce((acc, node) => {
  if (node.type === 'text') acc.push(node.value);
  if (node.type === 'range') node.type = 'text';
  return acc;
}, []);

/**
 * Flatten an array
 */

exports.flatten = (...args) => {
  const result = [];

  const flat = arr => {
    for (let i = 0; i < arr.length; i++) {
      const ele = arr[i];

      if (Array.isArray(ele)) {
        flat(ele);
        continue;
      }

      if (ele !== undefined) {
        result.push(ele);
      }
    }
    return result;
  };

  flat(args);
  return result;
};
