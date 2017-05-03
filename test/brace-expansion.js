'use strict';

var assert = require('assert');
var braces = require('..');

function equal(pattern, expected, options) {
  var actual = braces.expand(pattern, options).sort();
  assert.deepEqual(actual.filter(Boolean), expected.sort(), pattern);
}

/**
 * All of the unit tests from brace-expansion v1.1.6
 * https://github.com/juliangruber/brace-expansion
 */

describe('unit tests from brace-expand', function() {
  describe('sequences', function() {
    it('numeric sequences', function() {
      equal('a{1..2}b{2..3}c', ['a1b2c', 'a1b3c', 'a2b2c', 'a2b3c']);
      equal('{1..2}{2..3}', ['12', '13', '22', '23']);
    });

    it('numeric sequences with step count', function() {
      equal('{0..8..2}', ['0', '2', '4', '6', '8']);
      equal('{1..8..2}', ['1', '3', '5', '7']);
    });

    it('numeric sequence with negative x / y', function() {
      equal('{3..-2}', ['3', '2', '1', '0', '-1', '-2']);
    });

    it('alphabetic sequences', function() {
      equal('1{a..b}2{b..c}3', ['1a2b3', '1a2c3', '1b2b3', '1b2c3']);
      equal('{a..b}{b..c}', ['ab', 'ac', 'bb', 'bc']);
    });

    it('alphabetic sequences with step count', function() {
      equal('{a..k..2}', ['a', 'c', 'e', 'g', 'i', 'k']);
      equal('{b..k..2}', ['b', 'd', 'f', 'h', 'j']);
    });
  });

  describe('dollar', function() {
    it('ignores ${', function() {
      equal('${1..3}', ['${1..3}']);
      equal('${a,b}${c,d}', ['${a,b}${c,d}']);
      equal('x${a,b}x${c,d}x', ['x${a,b}x${c,d}x']);
    });
  });

  describe('empty option', function() {
    it('should support empty sets', function() {
      equal('-v{,,,,}', ['-v', '-v', '-v', '-v', '-v']);
    });
  });

  describe('negative increments', function() {
    it('should support negative steps', function() {
      equal('{3..1}', ['3', '2', '1']);
      equal('{10..8}', ['10', '9', '8']);
      equal('{10..08}', ['10', '09', '08']);
      equal('{c..a}', ['c', 'b', 'a']);

      equal('{4..0..2}', ['4', '2', '0']);
      equal('{4..0..-2}', ['4', '2', '0']);
      equal('{e..a..2}', ['e', 'c', 'a']);
    });
  });

  describe('nested', function() {
    it('should support nested sets', function() {
      equal('{a,b{1..3},c}', ['a', 'b1', 'b2', 'b3', 'c']);
      equal('{{A..Z},{a..z}}', ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].sort());
      equal('ppp{,config,oe{,conf}}', ['ppp', 'pppconfig', 'pppoe', 'pppoeconf']);
    });
  });

  describe('order', function() {
    it('should expand in given order', function() {
      equal('a{d,c,b}e', ['ade', 'ace', 'abe']);
    });
  });

  describe('pad', function() {
    it('should support padding', function() {
      equal('{9..11}', ['9', '10', '11']);
      equal('{09..11}', ['09', '10', '11']);
    });
  });
});

