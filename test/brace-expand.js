'use strict';

var assert = require('assert');
var braces = require('..');
var expand = braces.expand;

describe('unit tests from brace-expand', function() {
  describe('sequences', function() {
    it('numeric sequences', function() {
      assert.deepEqual(expand('a{1..2}b{2..3}c'), ['a1b2c', 'a1b3c', 'a2b2c', 'a2b3c']);
      assert.deepEqual(expand('{1..2}{2..3}'), ['12', '13', '22', '23']);
    });

    it('numeric sequences with step count', function() {
      assert.deepEqual(expand('{0..8..2}'), ['0', '2', '4', '6', '8']);
      assert.deepEqual(expand('{1..8..2}'), ['1', '3', '5', '7']);
    });

    it('numeric sequence with negative x / y', function() {
      assert.deepEqual(expand('{3..-2}'), ['3', '2', '1', '0', '-1', '-2']);
    });

    it('alphabetic sequences', function() {
      assert.deepEqual(expand('1{a..b}2{b..c}3'), ['1a2b3', '1a2c3', '1b2b3', '1b2c3']);
      assert.deepEqual(expand('{a..b}{b..c}'), ['ab', 'ac', 'bb', 'bc']);
    });

    it('alphabetic sequences with step count', function() {
      assert.deepEqual(expand('{a..k..2}'), ['a', 'c', 'e', 'g', 'i', 'k']);
      assert.deepEqual(expand('{b..k..2}'), ['b', 'd', 'f', 'h', 'j']);
    });
  });

  describe('sequences', function() {
    it('ignores ${', function() {
      assert.deepEqual(expand('${1..3}'), ['${1..3}']);
      assert.deepEqual(expand('${a,b}${c,d}'), ['${a,b}${c,d}']);
      assert.deepEqual(expand('x${a,b}x${c,d}x'), ['x${a,b}x${c,d}x']);
    });
  });
});

