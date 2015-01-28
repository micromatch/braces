'use strict';

var braces = require('../..');

module.exports = function(str) {
  return braces(str, {makeRe: false});
};
