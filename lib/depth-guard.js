'use strict';

// Caller options must not disable the bounds protecting recursive walkers.
const MAX_DEPTH = 128;
const MAX_NODES = 65536;

const fail = () => {
  const error = new SyntaxError('Brace expression exceeds the safe nesting or AST complexity limit');
  error.code = 'ERR_BRACES_COMPLEXITY';
  throw error;
};

exports.assertDepth = depth => {
  if (depth > MAX_DEPTH) fail();
};

// Preflight iteratively, before processing or mutating a caller-supplied AST.
// Only child edges are followed: parser ASTs have intentional parent/prev links.
// Track the active path, rather than all nodes, to allow shared child objects.
exports.assertTree = ast => {
  const stack = [{ node: ast, depth: 0, index: -1 }];
  const ancestors = new Set();
  let count = 0;

  while (stack.length) {
    const frame = stack[stack.length - 1];
    const node = frame.node;

    if (frame.index === -1) {
      if (!node || typeof node !== 'object') fail();
      if (frame.depth > MAX_DEPTH || ancestors.has(node) || ++count > MAX_NODES) fail();
      if (node.nodes && !Array.isArray(node.nodes)) fail();
      ancestors.add(node);
      frame.index = 0;
    }

    if (node.nodes && frame.index < node.nodes.length) {
      stack.push({ node: node.nodes[frame.index++], depth: frame.depth + 1, index: -1 });
    } else {
      ancestors.delete(node);
      stack.pop();
    }
  }
};
