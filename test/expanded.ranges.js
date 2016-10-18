'use strict';

var assert = require('assert');
var braces = require('..');
var expand = braces.expand;

function match(pattern, expected) {
  var actual = braces.expand(pattern).sort();
  assert.deepEqual(actual, expected.sort());
}

describe('expanded ranges', function() {
  describe('escaping / invalid ranges', function() {
    it('should not try to expand ranges with decimals', function() {
      match('{1.1..2.1}', ['{1.1..2.1}']);
      match('{1.1..~2.1}', ['{1.1..~2.1}']);
    });

    it('should escape invalid ranges:', function() {
      match('{1..0f}', ['{1..0f}']);
      match('{1..10..ff}', ['{1..10..ff}']);
      match('{1..10.f}', ['{1..10.f}']);
      match('{1..10f}', ['{1..10f}']);
      match('{1..20..2f}', ['{1..20..2f}']);
      match('{1..20..f2}', ['{1..20..f2}']);
      match('{1..2f..2}', ['{1..2f..2}']);
      match('{1..ff..2}', ['{1..ff..2}']);
      match('{1..ff}', ['{1..ff}']);
      match('{1.20..2}', ['{1.20..2}']);
    });

    it('weirdly-formed brace expansions -- fixed in post-bash-3.1', function() {
      match('a-{b{d,e}}-c', ['a-{bd}-c', 'a-{be}-c']);
      match('a-{bdef-{g,i}-c', ['a-{bdef-g-c', 'a-{bdef-i-c']);
    });

    it('should not expand quoted strings.', function() {
      match('{"klklkl"}{1,2,3}', ['{klklkl}1', '{klklkl}2', '{klklkl}3']);
      match('{"x,x"}', ['{x,x}']);
    });

    it('should escaped outer braces in nested non-sets', function() {
      match('{a-{b,c,d}}', ['{a-b}', '{a-c}', '{a-d}']);
      match('{a,{a-{b,c,d}}}', ['a', '{a-b}', '{a-c}', '{a-d}']);
    });

    it('should escape imbalanced braces', function() {
      match('a-{bdef-{g,i}-c', ['a-{bdef-g-c', 'a-{bdef-i-c']);
      match('abc{', ['abc{']);
      match('{abc{', ['{abc{']);
      match('{abc', ['{abc']);
      match('}abc', ['}abc']);
      match('ab{c', ['ab{c']);
      match('ab{c', ['ab{c']);
      match('{{a,b}', ['{a', '{b']);
      match('{a,b}}', ['a}', 'b}']);
      match('abcd{efgh', ['abcd{efgh']);
      match('a{b{c{d,e}f}g}h', ['a{b{cdf}g}h', 'a{b{cef}g}h']);
      match('f{x,y{{g,z}}h}', ['fx', 'fy{g}h', 'fy{z}h']);
      match('z{a,b},c}d', ['za,c}d', 'zb,c}d']);
      match('a{b{c{d,e}f{x,y{{g}h', ['a{b{cdf{x,y{{g}h', 'a{b{cef{x,y{{g}h']);
      match('f{x,y{{g}h', ['f{x,y{{g}h']);
      match('f{x,y{{g}}h', ['f{x,y{{g}}h']);
      match('a{b{c{d,e}f{x,y{}g}h', ['a{b{cdfxh', 'a{b{cdfy{}gh', 'a{b{cefxh', 'a{b{cefy{}gh']);
      match('f{x,y{}g}h', ['fxh', 'fy{}gh']);
      match('z{a,b{,c}d', ['z{a,bd', 'z{a,bcd']);
    });
  });

  describe('positive numeric ranges', function() {
    it('should expand numeric ranges', function() {
      match('a{0..3}d', ['a0d', 'a1d', 'a2d', 'a3d']);
      match('x{10..1}y', ['x10y', 'x9y', 'x8y', 'x7y', 'x6y', 'x5y', 'x4y', 'x3y', 'x2y', 'x1y']);
      match('x{3..3}y', ['x3y']);
      match('{1..10}', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
      match('{1..3}', ['1', '2', '3']);
      match('{1..9}', ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
      match('{10..1}', ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']);
      match('{10..1}y', ['10y', '9y', '8y', '7y', '6y', '5y', '4y', '3y', '2y', '1y']);
      match('{3..3}', ['3']);
      match('{5..8}', ['5', '6', '7', '8']);
    });
  });

  describe('negative ranges', function() {
    it('should expand ranges with negative numbers', function() {
      match('{-10..-1}', ['-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1']);
      match('{-20..0}', ['-20', '-19', '-18', '-17', '-16', '-15', '-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0']);
      match('{0..-5}', ['0', '-1', '-2', '-3', '-4', '-5']);
      match('{9..-4}', ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4']);
    });
  });

  describe('alphabetical ranges', function() {
    it('should expand alphabetical ranges', function() {
      match('{a..F}', ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a']);
      match('0{a..d}0', ['0a0', '0b0', '0c0', '0d0']);
      match('a/{b..d}/e', ['a/b/e', 'a/c/e', 'a/d/e']);
      match('{1..f}', ['1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f']);
      match('{a..A}', ['a', '`', '_', '^', ']', '\\', '[', 'Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']);
      match('{A..a}', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a']);
      match('{a..e}', ['a', 'b', 'c', 'd', 'e']);
      match('{A..E}', ['A', 'B', 'C', 'D', 'E']);
      match('{a..f}', ['a', 'b', 'c', 'd', 'e', 'f']);
      match('{a..z}', ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
      match('{E..A}', ['E', 'D', 'C', 'B', 'A']);
      match('{f..1}', ['f', 'e', 'd', 'c', 'b', 'a', '`', '_', '^', ']', '\\', '[', 'Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', '@', '?', '>', '=', '<', ';', ':', '9', '8', '7', '6', '5', '4', '3', '2', '1']);
      match('{f..a}', ['f', 'e', 'd', 'c', 'b', 'a']);
      match('{f..f}', ['f']);
    });

    it('should expand multiple ranges:', function() {
      match('a/{b..d}/e/{f..h}', ['a/b/e/f', 'a/b/e/g', 'a/b/e/h', 'a/c/e/f', 'a/c/e/g', 'a/c/e/h', 'a/d/e/f', 'a/d/e/g', 'a/d/e/h']);
    });
  });

  describe('combo', function() {
    it('should expand numerical ranges - positive and negative', function() {
      match('a{01..05}b', ['a01b', 'a02b', 'a03b', 'a04b', 'a05b' ]);
      match('0{1..9}/{10..20}', ['01/10', '01/11', '01/12', '01/13', '01/14', '01/15', '01/16', '01/17', '01/18', '01/19', '01/20', '02/10', '02/11', '02/12', '02/13', '02/14', '02/15', '02/16', '02/17', '02/18', '02/19', '02/20', '03/10', '03/11', '03/12', '03/13', '03/14', '03/15', '03/16', '03/17', '03/18', '03/19', '03/20', '04/10', '04/11', '04/12', '04/13', '04/14', '04/15', '04/16', '04/17', '04/18', '04/19', '04/20', '05/10', '05/11', '05/12', '05/13', '05/14', '05/15', '05/16', '05/17', '05/18', '05/19', '05/20', '06/10', '06/11', '06/12', '06/13', '06/14', '06/15', '06/16', '06/17', '06/18', '06/19', '06/20', '07/10', '07/11', '07/12', '07/13', '07/14', '07/15', '07/16', '07/17', '07/18', '07/19', '07/20', '08/10', '08/11', '08/12', '08/13', '08/14', '08/15', '08/16', '08/17', '08/18', '08/19', '08/20', '09/10', '09/11', '09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18', '09/19', '09/20' ]);
      match('{-10..10}', ['-1', '-10', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '0', '1', '10', '2', '3', '4', '5', '6', '7', '8', '9' ]);
    });
  });

  // HEADS UP! If you're using the `--mm` flag minimatch freezes on these
  describe('large numbers', function() {
    it('should expand large numbers', function() {
      match('{2147483645..2147483649}', ['2147483645', '2147483646', '2147483647', '2147483648', '2147483649']);
      match('{214748364..2147483649}', ['(21474836[4-9]|2147483[7-9][0-9]|214748[4-9][0-9]{2}|214749[0-9]{3}|2147[5-9][0-9]{4}|214[8-9][0-9]{5}|21[5-9][0-9]{6}|2[2-9][0-9]{7}|[3-9][0-9]{8}|1[0-9]{9}|20[0-9]{8}|21[0-3][0-9]{7}|214[0-6][0-9]{6}|2147[0-3][0-9]{5}|21474[0-7][0-9]{4}|214748[0-2][0-9]{3}|2147483[0-5][0-9]{2}|21474836[0-4][0-9])']);
    });
  });

  describe('steps > positive ranges', function() {
    it('should expand ranges using steps:', function() {
      match('{1..10..1}', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
      match('{1..10..2}', ['1', '3', '5', '7', '9']);
      match('{1..20..20}', ['1']);
      match('{1..20..2}', ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
      match('{10..0..2}', ['10', '8', '6', '4', '2', '0']);
      match('{10..1..2}', ['10', '8', '6', '4', '2']);
      match('{100..0..5}', ['100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0']);
      match('{2..10..1}', ['2', '3', '4', '5', '6', '7', '8', '9', '10']);
      match('{2..10..2}', ['2', '4', '6', '8', '10']);
      match('{2..10..3}', ['2', '5', '8']);
      match('{a..z..2}', ['a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y']);
    });

    it('should expand positive ranges with negative steps:', function() {
      match('{10..0..-2}', ['10', '8', '6', '4', '2', '0']);
    });
  });

  describe('steps > negative ranges', function() {
    it('should expand negative ranges using steps:', function() {
      match('{-1..-10..-2}', ['-1', '-3', '-5', '-7', '-9']);
      match('{-1..-10..2}', ['-1', '-3', '-5', '-7', '-9']);
      match('{-10..-2..2}', ['-10', '-8', '-6', '-4', '-2']);
      match('{-2..-10..1}', ['-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
      match('{-2..-10..2}', ['-2', '-4', '-6', '-8', '-10']);
      match('{-2..-10..3}', ['-2', '-5', '-8']);
      match('{-50..-0..5}', ['-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0']);
      match('{10..1..-2}', ['2', '4', '6', '8', '10']);
      match('{100..0..-5}', ['100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0']);
    });
  });

  describe('steps > alphabetical ranges', function() {
    it('should expand alpha ranges with steps', function() {
      match('{a..e..2}', ['a', 'c', 'e']);
      match('{E..A..2}', ['E', 'C', 'A']);
      match('{a..z}', ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
      match('{a..z..2}', ['a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y']);
      match('{z..a..-2}', ['z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b']);
    });

    it('should expand alpha ranges with negative steps', function() {
      match('{z..a..-2}', ['z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b']);
    });
  });

  describe('padding', function() {
    it('unwanted zero-padding -- fixed post-bash-4.0', function() {
      match('{10..0..2}', ['10', '8', '6', '4', '2', '0']);
      match('{10..0..-2}', ['10', '8', '6', '4', '2', '0']);
      match('{-50..-0..5}', ['-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0']);
    });
  });
});
