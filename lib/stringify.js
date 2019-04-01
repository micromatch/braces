'use strict';

module.exports = (ast, options = {}) => {
  let compile = node => {
    let invalid = parent.invalid === true && options.escapeInvalid === true;
    let output = '';

    if (invalid && !node.escaped && (node.type === 'open' || node.type === 'close')) {
      return '\\' + node.value;
    }

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

