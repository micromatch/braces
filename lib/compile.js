'use strict';

const utils = require('./utils');

module.exports = (ast, options = {}) => {
  let compile = (node, parent = {}) => {
    let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let output = '';

    if (node.value) {
      if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
        return '\\' + node.value;
      }
      return node.value;
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += compile(child, node);
      }
    }
    return output;
  };

  return compile(ast);
};

