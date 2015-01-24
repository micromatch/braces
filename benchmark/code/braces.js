'use strict';

var braces = require('../../tmp/example');

module.exports = function(str) {
  return braces(str, {makeRe: true});
};
