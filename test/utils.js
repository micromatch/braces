/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

require('mocha');
var assert = require('assert');
var utils = require('../lib/utils');

describe('utils', function() {
  describe('.isEmptySets', function() {
    it('should return true if string contains only empty stems', function() {
      assert(utils.isEmptySets('{,}'));
      assert(utils.isEmptySets('{,}{,}'));
      assert(utils.isEmptySets('{,}{,}{,}{,}{,}'));
    });

    it('should return false if string contains more than empty stems', function() {
      assert(!utils.isEmptySets('{,}foo'));
    });

    it('should return false if string contains other than empty stems', function() {
      assert(!utils.isEmptySets('foo'));
    });
  });

  describe('.split', function() {
    it('should split on commas by default', function() {
      assert.deepEqual(utils.split('a,b,c'), ['a', 'b', 'c']);
      assert.deepEqual(utils.split('{a,b,c}'), ['{a', 'b', 'c}']);
    });

    it('should not split inside parens', function() {
      assert.deepEqual(utils.split('*(a|{b|c,d})'), ['*(a|{b|c,d})']);
      assert.deepEqual(utils.split('a,@(b,c)'), ['a', '@(b,c)']);
      assert.deepEqual(utils.split('a,*(b|c,d),z'), ['a', '*(b|c,d)', 'z']);
    });

    it('should work with unclosed parens', function() {
      assert.deepEqual(utils.split('*(a|{b|c,d}'), ['*(a|{b|c,d}']);
    });

    it('should not split inside nested parens', function() {
      assert.deepEqual(utils.split('a,*(b|(c,d)),z'), ['a', '*(b|(c,d))', 'z']);
      assert.deepEqual(utils.split('a,*(b,(c,d)),z'), ['a', '*(b,(c,d))', 'z']);
    });

    it('should not split inside brackets', function() {
      assert.deepEqual(utils.split('[a-z,"]*'), ['[a-z,"]*']);
    });

    it('should work with unclosed brackets', function() {
      assert.deepEqual(utils.split('[a-z,"*'), ['[a-z,"*']);
    });

    it('should not split parens nested inside brackets', function() {
      assert.deepEqual(utils.split('[-a(z,")]*'), ['[-a(z,")]*']);
    });

    it('should not split brackets nested inside parens', function() {
      assert.deepEqual(utils.split('x,(a,[-a,])*'), ['x', '(a,[-a,])*']);
      assert.deepEqual(utils.split('a,(1,[^(x,y)],3),z'), ['a', '(1,[^(x,y)],3)', 'z']);
    });

    it('should support escaped parens', function() {
      assert.deepEqual(utils.split('a,@(b,c\\),z)'), ['a', '@(b,c\\),z)']);
    });

    it('should support escaped brackets', function() {
      assert.deepEqual(utils.split('a,@([b,c\\],x]|b),z'), ['a', '@([b,c\\],x]|b)', 'z']);
      assert.deepEqual(utils.split('a,@([b,c\\],x],b),z'), ['a', '@([b,c\\],x],b)', 'z']);
    });
  });
});
