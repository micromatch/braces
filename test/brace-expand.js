'use strict';

var assert = require('assert');
var bash = require('./support/bash');
var braces = require('..');
var expand = braces.expand;

/**
 * All of the unit tests from brace-expansion v1.1.6
 * https://github.com/juliangruber/brace-expansion
 */

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

  describe('dollar', function() {
    it('ignores ${', function() {
      assert.deepEqual(expand('${1..3}'), ['${1..3}']);
      assert.deepEqual(expand('${a,b}${c,d}'), ['${a,b}${c,d}']);
      assert.deepEqual(expand('x${a,b}x${c,d}x'), ['x${a,b}x${c,d}x']);
    });
  });

  describe('empty option', function() {
    it('should support empty sets', function() {
      assert.deepEqual(expand('-v{,,,,}'), ['-v', '-v', '-v', '-v', '-v']);
    });
  });

  describe('negative increments', function() {
    it('should support negative steps', function() {
      assert.deepEqual(expand('{3..1}'), ['3', '2', '1']);
      assert.deepEqual(expand('{10..8}'), ['10', '9', '8']);
      assert.deepEqual(expand('{10..08}'), ['10', '09', '08']);
      assert.deepEqual(expand('{c..a}'), ['c', 'b', 'a']);

      assert.deepEqual(expand('{4..0..2}'), ['4', '2', '0']);
      assert.deepEqual(expand('{4..0..-2}'), ['4', '2', '0']);
      assert.deepEqual(expand('{e..a..2}'), ['e', 'c', 'a']);
    });
  });

  describe('nested', function() {
    it('should support nested sets', function() {
      assert.deepEqual(expand('{a,b{1..3},c}'), bash('{a,b{1..3},c}'));
      assert.deepEqual(expand('{{A..Z},{a..z}}'), bash('{{A..Z},{a..z}}'));
      assert.deepEqual(expand('ppp{,config,oe{,conf}}'), bash('ppp{,config,oe{,conf}}'));
    });
  });

  describe('order', function() {
    it('should expand in given order', function() {
      assert.deepEqual(expand('a{d,c,b}e'), ['ade', 'ace', 'abe']);
    });
  });

  describe('pad', function() {
    it('should support padding', function() {
      assert.deepEqual(expand('{9..11}'), ['9', '10', '11']);
      assert.deepEqual(expand('{09..11}'), ['09', '10', '11']);
    });
  });
});

