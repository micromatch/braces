
var braces = require('../..');
var assert = require('assert');
var util = require('util');

module.exports = function(actual, expected, options, pattern) {
  if (typeof options === 'string') {
    pattern = options;
    options = {};
  }

  if (typeof actual === 'string') {
    pattern = pattern || actual;
    actual = braces(actual, options);
  }

  actual = stripSlashes(actual).filter(Boolean);
  expected = stripSlashes(expected).filter(Boolean);
  actual.sort(compare);
  expected.sort(compare);

  // console.log('compare(\'' + pattern + '\', [\'' + expected.join('\', \'') + '\']);');
  // console.log('[\'' + pattern + '\', [\'' + expected.join('\', \'') + '\']],');

  var msg = ' ' + (pattern || '') + '\n\n      "'
    + inspect(actual) + '" !== "' + inspect(expected) + '"\n';

  var a = actual.join('').split('\\').join('');
  var b = expected.join('').split('\\').join('');
  assert.deepEqual(a, b, msg);
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

function compare(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}
