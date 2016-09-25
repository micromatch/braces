'use strict';

var util = require('util');
var isNumber = require('is-number');
var compare = require('./natural');
var assert = require('assert');
var braces = require('../..');

module.exports = function(tests, config) {
  var heading;

  return function(fixture, expected, options) {
    var opts = Object.assign({}, config, options);
    if (opts.skip) return;

    if (arguments.length === 1) {
      heading = fixture;
      tests[heading] = tests[heading] || [];
      return;
    }

    if (Array.isArray(expected)) {
      expected.sort(compare);
    }

    expected = inspect(expected);
    if (tests[heading]) {
      tests[heading].push({
        fixture: inspect(fixture),
        expected: expected
      });
    }

    var val = opts.expand ? braces.expand.call(braces, fixture, opts) : braces(fixture, opts);
    if (Array.isArray(val)) {
      val.sort(compare);
    }

    var actual = inspect(val);
    var msg = ' ' + fixture + '\n\n      "' + actual + '" !== "' + expected + '"\n';
    assert.deepEqual(actual, expected, msg);
  }
}

function inspect(str) {
  return util.inspect(str, {depth: null})
    .split(/\s*\n+\s*/).join(' ')
    .split(/\[\s*'/).join('[\'')
    .split(/'\s*\]/).join('\']')
    .split('\\').join('');
}
