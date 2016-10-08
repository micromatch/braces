/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

require('mocha');
var support = require('./support/compare');
var compare;

describe('options', function() {
  beforeEach(function() {
    compare = support();
  });

  describe('options.expand', function() {
    it('should expand braces when `options.expand` is true', function() {
      compare('a/{b,c}/d', ['a/b/d', 'a/c/d'], {expand: true});
    });
  });

  describe('options.nodupes', function() {
    it('should not remove duplicates by default', function() {
      compare('a/{b,b,b}/c', ['a/b/c', 'a/b/c', 'a/b/c'], {expand: true});
    });

    it('should remove duplicates when `options.nodupes` is true', function() {
      compare('a/{b,b,b}/c', ['a/b/c'], {expand: true, nodupes: true});
    });
  });

  describe('options.optimize', function() {
    it('should optimize braces when `options.optimize` is true', function() {
      compare('a/{b,c}/d', ['a/(b|c)/d'], {optimize: true});
    });
  });

  describe('options.quantifiers:', function() {
    it('should not expand regex quantifiers when `options.quantifiers` is true', function() {
      compare('a{2}c', ['a{2}c'], {quantifiers: true});
      compare('a{2,}c', ['a{2,}c'], {quantifiers: true});
      compare('a{,2}c', ['a{,2}c'], {quantifiers: true});
      compare('a{2,3}c', ['a{2,3}c'], {quantifiers: true});
    });

    it('should expand non-quantifiers when `options.quantifiers` is true', function() {
      compare('a{2}c/{x,y}/z', ['a{2}c/(x|y)/z'], {quantifiers: true});
      compare('a{2}c/{x,y}/z', ['a{2}c/x/z', 'a{2}c/y/z'], {quantifiers: true, expand: true});
    });
  });
});