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

    var actual = stripSlashes(braces(fixture, opts)).filter(Boolean);
    expected = stripSlashes(expected).filter(Boolean);
    actual.sort(compare);
    expected.sort(compare);

    var msg = ' ' + fixture + '\n\n      "' + inspect(actual) + '" !== "' + inspect(expected) + '"\n';

    var a = actual.join('').split('\\').join('');
    var b = expected.join('').split('\\').join('');
    if (a !== b) {
      console.log(actual, expected);
    }
    assert.deepEqual(actual, expected, msg);
  };
};

function stripSlashes(arr) {
  return arr.map(function(str) {
    return str === '\\' ? '' : str.split('\\').join('');
  });
}

function inspect(val) {
  if (Array.isArray(val)) {
    val = stripSlashes(val).filter(Boolean);
    val.sort(compare);
  }
  return util.inspect(val, {depth: null})
    .split(/\s*\n+\s*/).join(' ')
    .split(/\[\s*'/).join('[\'')
    .split(/'\s*\]/).join('\']')
    .split('\\').join('');
}
