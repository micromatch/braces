'use strict';

var util = require('util');
var stringify = require('./stringify');
var isObject = require('isobject');
var assert = require('assert');
var braces = require('../..');

function compare(tests) {
  var heading;

  return function(fixture, expected, options) {
    if (arguments.length === 1) {
      heading = fixture;
      tests[heading] = tests[heading] || [];
      return;
    }

    expected = inspect(expected);
    if (tests[heading]) {
      tests[heading].push({
        fixture: inspect(fixture),
        expected: inspect(expected)
      });
    }

    var val = braces.expand(fixture, options);
    var actual = inspect(val);
    var msg = ' (' + fixture + ')\n\n      "' + actual + '" !== "' + expected + '"\n';
    assert.deepEqual(actual, expected, msg);
  }
}

function inspect(val) {
  return util.inspect(val, {depth: null})
    .split(/\s*\n+\s*/).join(' ')
    .split(/\[\s*/).join('[')
    .split(/\s*\]/).join(']')
    .split('\\').join('');
}

module.exports = compare;
