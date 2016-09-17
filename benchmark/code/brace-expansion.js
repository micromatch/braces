'use strict';

var braceExpansion = require('brace-expansion');

module.exports = function(args) {
  return braceExpansion.apply(null, Array.isArray(args) ? args : [args]);
};
