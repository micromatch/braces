'use strict';

var util = require('util');
var assert = require('assert');
var braces = require('../..');

function compare(tests, method, config) {
  method = method || 'expand';
  var heading;

  return function(fixture, expected, options) {
    var opts = Object.assign({}, config, options);
    if (opts.skip) return;

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

    var val = opts.expand ? braces.expand.call(braces, fixture, opts) : braces(fixture, opts);
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

module.exports = compare;
