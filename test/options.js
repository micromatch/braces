/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

require('mocha');
var assert = require('assert');
var braces = require('..');

function match(pattern, expected, options) {
  assert.deepEqual(braces(pattern, options).sort(), expected.sort());
}

describe('options', function() {
  describe('options.expand', function() {
    it('should expand braces when `options.expand` is true', function() {
      match('a/{b,c}/d', ['a/b/d', 'a/c/d'], {expand: true});
    });
  });

  describe('options.unescape', function() {
    it('should remove backslashes from escaped brace characters', function() {
      match('{a,b\\}c,d}', ['(a|b}c|d)']);
      match('\\{a,b,c,d,e}', ['{a,b,c,d,e}']);
      match('a/{z,\\{a,b,c,d,e}/d', ['a/(z|{a|b|c|d|e)/d']);
      match('a/\\{b,c}/{d,e}/f', ['a/{b,c}/(d|e)/f']);
      match('./\\{x,y}/{a..z..3}/', ['./{x,y}/(a|d|g|j|m|p|s|v|y)/']);
    });

    it('should not remove backslashes when `options.unescape` is false', function() {
      match('{a,b\\}c,d}', ['(a|b\\}c|d)'], {unescape: false});
      match('\\{a,b,c,d,e}', ['\\{a,b,c,d,e}'], {unescape: false});
      match('a/{z,\\{a,b,c,d,e}/d', ['a/(z|\\{a|b|c|d|e)/d'], {unescape: false});
      match('a/\\{b,c}/{d,e}/f', ['a/\\{b,c}/(d|e)/f'], {unescape: false});
      match('./\\{x,y}/{a..z..3}/', ['./\\{x,y}/(a|d|g|j|m|p|s|v|y)/'], {unescape: false});
    });
  });

  describe('options.nodupes', function() {
    it('should not remove duplicates by default', function() {
      match('a/{b,b,b}/c', ['a/b/c', 'a/b/c', 'a/b/c'], {expand: true});
    });

    it('should remove duplicates when `options.nodupes` is true', function() {
      match('a/{b,b,b}/c', ['a/b/c'], {expand: true, nodupes: true});
    });
  });

  describe('options.optimize', function() {
    it('should optimize braces when `options.optimize` is true', function() {
      match('a/{b,c}/d', ['a/(b|c)/d'], {optimize: true});
    });
  });

  describe('options.quantifiers:', function() {
    it('should not expand regex quantifiers when `options.quantifiers` is true', function() {
      match('a{2}c', ['a{2}c'], {quantifiers: true});
      match('a{2,}c', ['a{2,}c'], {quantifiers: true});
      match('a{,2}c', ['a{,2}c'], {quantifiers: true});
      match('a{2,3}c', ['a{2,3}c'], {quantifiers: true});
    });

    it('should expand non-quantifiers when `options.quantifiers` is true', function() {
      match('a{2}c/{x,y}/z', ['a{2}c/(x|y)/z'], {quantifiers: true});
      match('a{2}c/{x,y}/z', ['a{2}c/x/z', 'a{2}c/y/z'], {quantifiers: true, expand: true});
    });
  });
});
