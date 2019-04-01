'use strict';

// const compile = require('./compile');
// const expand = require('./expand');
const utils = require('./utils');

/**
 * Constants
 */

const {
  CHAR_BACKSLASH,            /* \ */
  CHAR_BACKTICK,             /* ` */
  CHAR_COMMA,                /* , */
  CHAR_DOLLAR,               /* $ */
  CHAR_DOT,                  /* . */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_RIGHT_SQUARE_BRACKET, /* ] */
  CHAR_DOUBLE_QUOTE,         /* " */
  CHAR_SINGLE_QUOTE,         /* ' */
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = require('./constants');

/**
 * Append node to the block.queue
 */

const append = (block, node) => {
  if (!block.queue) return;

  if (node.nodes) {
    block.queue.push(node.queue);
    return;
  }

  let last = block.queue[block.queue.length - 1];

  if ((node.type === 'comma' || node.type === 'range')) {
    block.queue.push(node.value);
    return;
  }

  if (node.type === 'text' && node.value) {
    if (typeof last !== 'string' || last === ',') {
      block.queue.push(node.value);
    } else {
      block.queue[block.queue.length - 1] += node.value;
    }
  }
};

/**
 * parse
 */

const parse = (input, options = {}) => {
  let ast = { type: 'root', input, nodes: [] };
  let stack = [ast];
  let length = input.length;
  let block = ast;
  let prev = ast;
  let index = 0;
  let depth = 0;
  let value;

  /**
   * Helpers
   */

  const advance = () => input[index++];
  const push = node => {
    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.nodes.push(node);
    prev = node;
    return node;
  };

  push({ type: 'bos' });

  while (index < length) {
    block = stack[stack.length - 1];
    value = advance();

    /**
     * Invalid chars
     */

    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
      continue;
    }

    /**
     * Escaped chars
     */

    if (value === CHAR_BACKSLASH) {
      push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
      continue;
    }

    /**
     * Left square bracket: '['
     */

    if (value === CHAR_LEFT_SQUARE_BRACKET) {
      let closed = true;
      let next;

      while (index < length && (next = advance())) {
        value += next;

        if (next === CHAR_BACKSLASH) {
          value += advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          closed = true;
          break;
        }
      }

      if (closed !== true) {
        value = '\\' + value;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Left square bracket: '['
     */

    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
      let open = value;
      let next;

      while (index < length && (next = advance())) {
        value += next;

        if (next === CHAR_BACKSLASH) {
          value += advance();
          continue;
        }

        if (next === open) {
          break;
        }
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Right square bracket (literal): ']'
     */

    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
      push({ type: 'text', value: '\\' + value });
      continue;
    }

    /**
     * Left curly brace: '{'
     */

    if (value === CHAR_LEFT_CURLY_BRACE) {
      depth++;
      let dollar = prev.value && prev.value.slice(-1) === '$';

      let brace = {
        type: 'brace',
        open: true,
        close: false,
        dollar,
        depth,
        commas: 0,
        ranges: 0,
        nodes: []
      };

      block = push(brace);
      stack.push(block);
      push({ type: 'open', value });
      continue;
    }

    /**
     * Right curly brace: '}'
     */

    if (value === CHAR_RIGHT_CURLY_BRACE) {
      if (block.type !== 'brace') {
        push({ type: 'text', value });
        continue;
      }

      let type = 'close';
      block = stack.pop();
      block.close = true;

      push({ type, value });
      depth--;

      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Comma: ','
     */

    if (value === CHAR_COMMA && depth > 0) {
      push({ type: 'comma', value });
      block.commas++;
      continue;
    }

    /**
     * Dot: '.'
     */

    if (value === CHAR_DOT && depth > 0) {
      let siblings = block.nodes;

      if (depth === 0 || siblings.length === 0) {
        push({ type: 'text', value });
        continue;
      }

      if (prev.type === 'dot') {
        prev.value += value;
        prev.type = 'range';

        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
          block.invalid = true;
          block.ranges = 0;
          prev.type = 'text';
          continue;
        }

        block.ranges++;
        block.args = [];
        continue;
      }

      if (prev.type === 'range') {
        siblings.pop();

        let before = siblings[siblings.length - 1];
        before.value += prev.value + value;
        prev = before;
        block.ranges--;
        continue;
      }

      push({ type: 'dot', value });
      continue;
    }

    /**
     * Text
     */

    push({ type: 'text', value });
  }

  // Mark imbalanced braces and brackets as invalid
  do {
    block = stack.pop();
    if (block.type !== 'root') {
      block.nodes.forEach(node => {
        if (!node.nodes) {
          node.invalid = true;
          node[node.type] = true;
          node.type = 'text';
        }
      });
      let parent = stack[stack.length - 1];
      let index = parent.nodes.indexOf(block);
      parent.nodes.splice(index, 1, ...block.nodes);
    }
  } while (stack.length > 0);

  push({ type: 'eos' });
  return ast;
};

module.exports = parse;