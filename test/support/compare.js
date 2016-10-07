'use strict';

var util = require('util');
var assert = require('assert');
var braces = require('../..');

function compare(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}

module.exports = function(config) {
  config = config || {};
  return function(fixture, expected, options) {
    options = options || {};

    if (options.optimize === true) {
      delete config.expand;
    }
    if (options.expand === true) {
      delete config.optimize;
    }

    var opts = Object.assign({}, config, options);
    if (opts.skip) return;

    var actual = braces(fixture, opts);
    expected = inspect(expected);
    actual = inspect(actual);

    var msg = ' ' + fixture + '\n\n      "' + actual + '" !== "' + expected + '"\n';
    assert.deepEqual(actual, expected, msg);
  };
};

function inspect(val) {
  if (Array.isArray(val)) {
    val = val.map(function(str) {
      return str.split('\\').join('');
    })
    val.sort(compare);
  }
  return util.inspect(val, {depth: null})
    .split(/\s*\n+\s*/).join(' ')
    .split(/\[\s*'/).join('[\'')
    .split(/'\s*\]/).join('\']')
    .split('\\').join('');
}
