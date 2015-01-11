'use strict';

var braces = require('../..');

module.exports = function(str) {
  return braces(str, {nodupes: false});
};
