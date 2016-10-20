'use strict';

require('mocha');
var assert = require('assert');
var braces = require('..');

function match(pattern, expected, options) {
  assert.deepEqual(braces(pattern, options), expected);
}

describe('braces', function() {
  it('should return an array', function() {
    assert(Array.isArray(braces('{a,b}')));
  });

  it('should return an optimized string by default', function() {
    match('a/{b,c}/d', ['a/(b|c)/d']);
  });

  it('should return an expanded array if defined on options', function() {
    match('a/{b,c}/d', ['a/b/d', 'a/c/d'], {expand: true});
  });

  it('should optimize an array of patterns', function() {
    match(['a/{b,c}/d', 'x/{foo,bar}/z'], ['a/(b|c)/d', 'x/(foo|bar)/z']);
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

  it('should expand ranges', function() {
    match('a{1..5}b', ['a1b', 'a2b', 'a3b', 'a4b', 'a5b'], {expand: true});
  });

  it('should expand ranges that are nested in a set', function() {
    match('a{b,c,{1..5}}e', ['abe', 'ace', 'a1e', 'a2e', 'a3e', 'a4e', 'a5e'], {expand: true});
  });

  it('should not expand ranges when they are just characters in a set', function() {
    match('a{b,c,1..5}e', ['abe', 'ace', 'a1..5e'], {expand: true});
    match('a{/../}e', ['a/e'], {expand: true});
    match('a{/../,z}e', ['a/../e', 'aze'], {expand: true});
    match('a{b,c/*/../d}e', ['abe', 'ac/*/../de'], {expand: true});
    match('a{b,b,c/../b}d', ['abd', 'abd', 'ac/../bd'], {expand: true});
  });
});
