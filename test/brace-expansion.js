'use strict';

var assert = require('assert');
var braces = require('..');

function match(pattern, expected, options) {
  var actual = braces.expand(pattern, options).sort();
  assert.deepEqual(actual, expected.sort(), pattern);
}

/**
 * All of the unit tests from brace-expansion v1.1.6
 * https://github.com/juliangruber/brace-expansion
 */

describe('unit tests from brace-expand', function() {
  describe('sequences', function() {
    it('numeric sequences', function() {
      match('a{1..2}b{2..3}c', ['a1b2c', 'a1b3c', 'a2b2c', 'a2b3c']);
      match('{1..2}{2..3}', ['12', '13', '22', '23']);
    });

    it('numeric sequences with step count', function() {
      match('{0..8..2}', ['0', '2', '4', '6', '8']);
      match('{1..8..2}', ['1', '3', '5', '7']);
    });

    it('numeric sequence with negative x / y', function() {
      match('{3..-2}', ['3', '2', '1', '0', '-1', '-2']);
    });

    it('alphabetic sequences', function() {
      match('1{a..b}2{b..c}3', ['1a2b3', '1a2c3', '1b2b3', '1b2c3']);
      match('{a..b}{b..c}', ['ab', 'ac', 'bb', 'bc']);
    });

    it('alphabetic sequences with step count', function() {
      match('{a..k..2}', ['a', 'c', 'e', 'g', 'i', 'k']);
      match('{b..k..2}', ['b', 'd', 'f', 'h', 'j']);
    });
  });

  describe('dollar', function() {
    it('ignores ${', function() {
      match('${1..3}', ['${1..3}']);
      match('${a,b}${c,d}', ['${a,b}${c,d}']);
      match('x${a,b}x${c,d}x', ['x${a,b}x${c,d}x']);
    });
  });

  describe('empty option', function() {
    it('should support empty sets', function() {
      match('-v{,,,,}', ['-v', '-v', '-v', '-v', '-v']);
    });
  });

  describe('negative increments', function() {
    it('should support negative steps', function() {
      match('{3..1}', ['3', '2', '1']);
      match('{10..8}', ['10', '9', '8']);
      match('{10..08}', ['10', '09', '08']);
      match('{c..a}', ['c', 'b', 'a']);

      match('{4..0..2}', ['4', '2', '0']);
      match('{4..0..-2}', ['4', '2', '0']);
      match('{e..a..2}', ['e', 'c', 'a']);
    });
  });

  describe('nested', function() {
    it('should support nested sets', function() {
      match('{a,b{1..3},c}', ['a', 'b1', 'b2', 'b3', 'c']);
      match('{{A..Z},{a..z}}', [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ].sort());
      match('ppp{,config,oe{,conf}}', ['ppp', 'pppconfig', 'pppoe', 'pppoeconf']);
    });
  });

  describe('order', function() {
    it('should expand in given order', function() {
      match('a{d,c,b}e', ['ade', 'ace', 'abe']);
    });
  });

  describe('pad', function() {
    it('should support padding', function() {
      match('{9..11}', ['9', '10', '11']);
      match('{09..11}', ['09', '10', '11']);
    });
  });
});

