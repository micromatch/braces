'use strict';

require('mocha');
var assert = require('assert');
var braces = require('..');

describe('.makeRe', function() {
  it('should throw an error when invalid args are passed', function() {
    assert.throws(function() {
      braces.makeRe();
    });
  });

  it('should throw an error when string exceeds max safe length', function() {
    var MAX_LENGTH = 1024 * 64;

    assert.throws(function() {
      braces.makeRe(Array(MAX_LENGTH + 1).join('.'));
    });
  });
});
