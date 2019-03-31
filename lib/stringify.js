'use strict';

module.exports = (ast, options = {}) => {
  let compile = node => {
    let output = '';
    if (node.value) {
      return node.value;
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += compile(child);
      }
    }
    return output;
  };

  return compile(ast);
};

