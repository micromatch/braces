'use strict';

require('mocha');
var assert = require('assert');
var braces = require('..');

describe('braces', function() {
  it('should return an array', function() {
    assert(Array.isArray(braces('{a,b}')));
  });

  it('should return an optimized string by default', function() {
    assert.deepEqual(braces('a/{b,c}/d'), ['a/(b|c)/d']);
  });

  it('should return an expanded array if defined on options', function() {
    assert.deepEqual(braces('a/{b,c}/d', {expand: true}), ['a/b/d', 'a/c/d']);
  });

  it('should optimize an array of patterns', function() {
    assert.deepEqual(braces(['a/{b,c}/d', 'x/{foo,bar}/z']), ['a/(b|c)/d', 'x/(foo|bar)/z']);
  });

  it('should expand an array of patterns', function() {
    var actual = braces(['a/{b,c}/d', 'a/{b,c}/d']);
    assert.deepEqual(actual, ['a/(b|c)/d', 'a/(b|c)/d']);
  });

  it('should not uniquify by default', function() {
    var actual = braces(['a/{b,c}/d', 'a/{b,c}/d']);
    assert.deepEqual(actual, ['a/(b|c)/d', 'a/(b|c)/d']);
  });

  it('should uniquify when `options.nodupes` is true', function() {
    var actual = braces(['a/{b,c}/d', 'a/{b,c}/d'], {nodupes: true});
    assert.deepEqual(actual, ['a/(b|c)/d']);
  });
});
