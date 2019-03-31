'use strict';

// const compile = require('./compile');
// const expand = require('./expand');

const escapeNode = (block, n = 0) => {
  if (typeof block.nodes[n].value === 'string') {
    block.nodes[n].value = '\\' + block.nodes[n].value;
  }
};

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
 * Constants
 */

const {
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA,                /* , */
  CHAR_DOT,                  /* . */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_RIGHT_SQUARE_BRACKET, /* ] */
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = require('./constants');

/**
 * parse
 */

const parse = (input, options = {}) => {
  let ast = { type: 'root', nodes: [] };
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
    // append(block, node);

    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.nodes.push(node);
    // node.parent = block;
    // node.prev = prev;
    // prev.next = node;

    Reflect.defineProperty(node, 'parent', { value: block });
    Reflect.defineProperty(node, 'prev', { value: prev });
    Reflect.defineProperty(prev, 'next', { value: node });
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

    if (value === CHAR_BACKWARD_SLASH) {
      value += advance();
      push({ type: 'text', value });
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

        if (next === CHAR_BACKWARD_SLASH) {
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
      block = push({ type: 'brace', commas: 0, ranges: 0, nodes: [] });
      stack.push(block);
      push({ type: 'open', value });
      continue;
    }

    /**
     * Right curly brace: '}'
     */

    if (value === CHAR_RIGHT_CURLY_BRACE) {
      if (index === 1 || block.type !== 'brace') {
        push({ type: 'text', value: '\\' + value });
        continue;
      }

      let type = 'close';
      block = stack.pop();

      // detect invalid braces
      if ((block.commas === 0 && block.ranges === 0) || (block.commas > 0 && block.ranges > 0) || block.ranges > 2) {

        type = 'text';
        block.literal = true;
        block.commas = 0;
        block.ranges = 0;

        // escape open/close braces if specified on options
        if (options.escapeInvalid === true) {
          escapeNode(block);
          value = '\\' + value;
        }
      }

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

  // Fix imbalanced braces and brackets
  do {
    if (block.literal !== true && (block.type === 'brace' || block.type === 'bracket')) {
      block.literal = true;
      block.commas = 0;
      block.ranges = 0;
      escapeNode(block);
    }
    block = stack.pop();
  } while (stack.length > 0);

  push({ type: 'eos' });
  return ast;
};

// const braces = require('../tmp/index');
// const input = 'foo/{a,bar/{b,c},d}';
// const input = 'a/{b,c{x,y}}/d';
// const input = '{{x,y},/{b,c{x,y}d,e}/f}';
// const input = '{{a,b}/{b,c{x,y}d,e}/f,x,z}';
// const input = 'a/{b,c}/d';
// console.log(braces.expand(input));
// const ast = parse(input);
// console.log(ast)
// console.log(JSON.stringify(ast.queue));
// console.log('EXPECTED:', [ 'a/b/f', 'a/cxd/f', 'a/cyd/f', 'a/e/f' ]);
// console.log(JSON.stringify(ast, null, 2))
// console.log(expand(ast));
// expand(ast);

// const sets = parse('foo/{a/b,{c,d,{x..z},e},f}/bar');
// const sets = parse('{a,{c,d}');
// console.log(sets.nodes[2]);
// console.log(compile(sets));

// const range = parse(']{a..e,z}');
// console.log(range.nodes[2]);
// console.log(braces.expand(']{a..e,z}'))
// console.log(compile(range));
// console.log(parse('[abc]'))

module.exports = parse;
