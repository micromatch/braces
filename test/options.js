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

function equal(pattern, expected, options) {
  assert.deepEqual(braces(pattern, options).sort(), expected.sort());
}

describe('options', function() {
  describe('options.expand', function() {
    it('should expand braces when `options.expand` is true', function() {
      equal('a/{b,c}/d', ['a/b/d', 'a/c/d'], {expand: true});
    });
  });

  describe('options.cache', function() {
    it('should disable caching', function() {
      braces('a/{b,c}/d');
      assert(braces.cache.hasOwnProperty('a/{b,c}/d'));
      braces('a/{b,c}/d');
      assert(braces.cache.hasOwnProperty('a/{b,c}/d'));
      braces('a/{b,c}/d');
      assert(braces.cache.hasOwnProperty('a/{b,c}/d'));
      braces('a/{b,c}/d', {cache: false});
      braces('a/{b,c}/d', {cache: false});
      braces('a/{b,c}/d', {cache: false});
      assert.deepEqual(braces.cache, {});
    });
  });

  describe('options.noempty', function() {
    it('should not remove empty values by default', function() {
      equal('{,b{,a}}', ['', 'b', 'ba'], {expand: true});
    });

    it('should remove empty values when `options.noempty` is false', function() {
      equal('{,b{,a}}', ['b', 'ba'], {expand: true, noempty: true});
    });
  });

  describe('options.nodupes', function() {
    it('should not remove duplicates by default', function() {
      equal('a/{b,b,b}/c', ['a/b/c', 'a/b/c', 'a/b/c'], {expand: true});
    });

    it('should remove duplicates when `options.nodupes` is true', function() {
      equal('a/{b,b,b}/c', ['a/b/c'], {expand: true, nodupes: true});
    });
  });

  describe('options.optimize', function() {
    it('should optimize braces when `options.optimize` is true', function() {
      equal('a/{b,c}/d', ['a/(b|c)/d'], {optimize: true});
    });
  });

  describe('options.quantifiers:', function() {
    it('should not expand regex quantifiers when `options.quantifiers` is true', function() {
      equal('a{2}c', ['a{2}c']);
      equal('a{2}c', ['a{2}c'], {quantifiers: true});
      equal('a{2,}c', ['a{2,}c'], {quantifiers: true});
      equal('a{,2}c', ['a{,2}c'], {quantifiers: true});
      equal('a{2,3}c', ['a{2,3}c'], {quantifiers: true});
    });

    it('should expand non-quantifiers when `options.quantifiers` is true', function() {
      equal('a{2}c/{x,y}/z', ['a{2}c/(x|y)/z'], {quantifiers: true});
      equal('a{2}c/{x,y}/z', ['a{2}c/x/z', 'a{2}c/y/z'], {quantifiers: true, expand: true});
    });
  });

  describe('options.unescape', function() {
    it('should remove backslashes from escaped brace characters', function() {
      equal('{a,b\\}c,d}', ['(a|b}c|d)']);
      equal('\\{a,b,c,d,e}', ['{a,b,c,d,e}']);
      equal('a/{z,\\{a,b,c,d,e}/d', ['a/(z|{a|b|c|d|e)/d']);
      equal('a/\\{b,c}/{d,e}/f', ['a/{b,c}/(d|e)/f']);
      equal('./\\{x,y}/{a..z..3}/', ['./{x,y}/(a|d|g|j|m|p|s|v|y)/']);
    });

    it('should not remove backslashes when `options.unescape` is false', function() {
      equal('{a,b\\}c,d}', ['(a|b\\}c|d)'], {unescape: false});
      equal('\\{a,b,c,d,e}', ['\\{a,b,c,d,e}'], {unescape: false});
      equal('a/{z,\\{a,b,c,d,e}/d', ['a/(z|\\{a|b|c|d|e)/d'], {unescape: false});
      equal('a/\\{b,c}/{d,e}/f', ['a/\\{b,c}/(d|e)/f'], {unescape: false});
      equal('./\\{x,y}/{a..z..3}/', ['./\\{x,y}/(a|d|g|j|m|p|s|v|y)/'], {unescape: false});
    });
  });
});
