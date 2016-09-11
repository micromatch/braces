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

function compare(fixture, expected) {
  assert.equal(braces.compile(fixture).output, expected);
}

describe('.compile (.output)', function() {
  it('should expand sets', function() {
    compare('/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', '\\/usr\\/(ucb\\/(ex|edit)|lib\\/(ex|how_ex))');
    compare('\\{a,b,c,d,e}', '\\{a,b,c,d,e\\}');
    compare('a/b/c/{x,y}', 'a\\/b\\/c\\/(x|y)');
    compare('a/{x,y}/cde', 'a\\/(x|y)\\/cde');
    compare('abcd{efgh', 'abcd\\{efgh');
    compare('ff{c,b,a}', 'ff(c|b|a)');
    compare('f{d,e,f}g', 'f(d|e|f)g');
    compare('{a,b,c}', '(a|b|c)');
    compare('{abc}', '\\{abc\\}');
    compare('{l,n,m}xyz', '(l|n|m)xyz');
    compare('{x,y,\\{a,b,c\\}}', '(x|y|\\{a,b,c\\})');
    compare('{x,y,{a,b,c\\}}', '(x|y|\\{a,b,c\\})');
    compare('{x,y,{abc},trie}', '(x|y|\\{abc\\}|trie)');
    compare('{x\\,y,\\{abc\\},trie}', '(x,y|\\{abc\\}|trie)');

    // Bash 4.3 says the following should be equivalent to `foo|(1|2)|bar`
    compare('foo {1,2} bar', 'foo (1|2) bar');
  });

  it('should handle empty braces', function() {
    compare('{ }', '\\{|\\}');
    compare('{', '\\{');
    compare('{,}', '');
    compare('{}', '\\{\\}');
    compare('}', '\\}');
  });

  it('should work with no commas', function() {
    compare('a{b}c', 'abc');
  });

  it('should support sequence brace operators', function() {
    compare('{1..10}', '([1-9]|10)');
    compare('{{1..10},braces}', '(([1-9]|10)|braces)');
    compare('{{0..10},braces}', '(([0-9]|10)|braces)');
    compare('x{{0..10},braces}y', 'x(([0-9]|10)|braces)y');
    compare('{braces,{0..10}}', '(braces|([0-9]|10))');
    compare('{{1..10..2},braces}', '((1|3|5|7|9)|braces)');
  });

  it('should handle invalid sets:', function() {
    compare('{0..10,braces}', '(0..10|braces)');
    compare('{1..10,braces}', '(1..10|braces)');
  });

  it('should expand numerical ranges', function() {
    compare('{3..3}', '3');
    compare('x{3..3}y', 'x3y');
    compare('{10..1}', '([1-9]|10)');
    compare('{10..1}y', '([1-9]|10)y');
    compare('x{10..1}y', 'x([1-9]|10)y');
  });

  it('should expand ranges using steps:', function() {
    compare('{1..10..1}', '([1-9]|10)');
    compare('{1..10..2}', '(1|3|5|7|9)');
    compare('{1..10}', '([1-9]|10)');
    compare('{1..20..20}', '1');
    compare('{1..20..20}', '1');
    compare('{1..20..20}', '1');
    compare('{1..20..2}', '(1|3|5|7|9|11|13|15|17|19)');
    compare('{10..0..2}', '(10|8|6|4|2|0)');
    compare('{10..1..2}', '(10|8|6|4|2)');
    compare('{10..1}', '([1-9]|10)');
    compare('{10..1}y', '([1-9]|10)y');
    compare('{100..0..5}', '(100|95|90|85|80|75|70|65|60|55|50|45|40|35|30|25|20|15|10|5|0)');
    compare('{2..10..1}', '([2-9]|10)');
    compare('{2..10..2}', '(2|4|6|8|10)');
    compare('{2..10..3}', '(2|5|8)');
    compare('{a..z..2}', '(a|c|e|g|i|k|m|o|q|s|u|w|y)');
  });

  it.only('should expand ranges with negative numbers', function() {
    compare('{-1..-10}', '(-[1-9]|-10)');
    compare('{-10..-1}', '(-[1-9]|-10)');
    compare('{-20..0}', '(-[1-9]|-1[0-9]|-20|0)');
    compare('{0..-5}', '(-[1-5]|0)');
    compare('{9..-4}', '(-[1-4]|[0-9])', ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4']);
  });

  it('should expand numerical ranges - positive and negative', function() {
    compare('{-10..10}', '(-?10|-?[1-9]|0)');
  });

  it('should expand negative ranges using steps:', function() {
    compare('{-1..-10..-2}', '-(1|3|5|7|9)');
    compare('{-1..-10..2}', '-(1|3|5|7|9)');
    compare('{-10..-2..2}', '-(10|8|6|4|2)');
    compare('{-2..-10..1}', '(-[2-9]|-10)');
    compare('{-2..-10..2}', '-(2|4|6|8|10)');
    compare('{-2..-10..3}', '-(2|5|8)');
    compare('{-50..-0..5}', '(0|-(50|45|40|35|30|25|20|15|10|5))');
    compare('{-9..9..3}', '(0|3|6|9|-(9|6|3))');
    compare('{10..0..-2}', '10', '8', '6', '4', '2', '0');
    compare('{10..1..-2}', '(10|8|6|4|2)');
    compare('{100..0..-5}', '(100|95|90|85|80|75|70|65|60|55|50|45|40|35|30|25|20|15|10|5|0)');
  });

  it('should expand alphabetical ranges', function() {
    compare('0{1..9}/{10..20}', '0([1-9])\\/(1[0-9]|20)');
    compare('0{a..d}0', '0([a-d])0');
    compare('a/{b..d}/e', 'a\\/([b-d])\\/e');
    compare('{1..f}', '([1-f])');
    compare('{a..A}', '([A-a])');
    compare('{A..a}', '([A-a])');
    compare('{a..e}', '([a-e])');
    compare('{A..E}', '([A-E])');
    compare('{a..f}', '([a-f])');
    compare('{a..z}', '([a-z])');
    compare('{E..A}', '([A-E])');
    compare('{f..1}', '([1-f])');
    compare('{f..a}', '([a-f])');
    compare('{f..f}', 'f');
  });

  it('should expand multiple ranges:', function() {
    compare('a/{b..d}/e/{f..h}', 'a/b/e/f', 'a/c/e/f', 'a/d/e/f', 'a/b/e/g', 'a/c/e/g', 'a/d/e/g', 'a/b/e/h', 'a/c/e/h', 'a/d/e/h');
  });

  it('should expand alpha ranges with steps', function() {
    compare('{a..e..2}', 'a','c', 'e');
    compare('{E..A..2}', 'E', 'C', 'A');
    compare('{a..z}', '([a-z])');
    compare('{a..z..2}', '(a|c|e|g|i|k|m|o|q|s|u|w|y)');
    compare('{z..a..-2}', '(z|x|v|t|r|p|n|l|j|h|f|d|b)');
  });

  it('should expand alpha ranges with negative steps', function() {
    compare('{z..a..-2}', 'z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b');
  });

  it('should expand large numbers', function() {
    compare('{2147483645..2147483649}', '(214748364[5-9])');
    compare('{214748364..2147483649}', '(21474836[4-9]|2147483[7-9][0-9]|214748[4-9][0-9]{2}|214749[0-9]{3}|2147[5-9][0-9]{4}|214[8-9][0-9]{5}|21[5-9][0-9]{6}|2[2-9][0-9]{7}|[3-9][0-9]{8}|1[0-9]{9}|20[0-9]{8}|21[0-3][0-9]{7}|214[0-6][0-9]{6}|2147[0-3][0-9]{5}|21474[0-7][0-9]{4}|214748[0-2][0-9]{3}|2147483[0-5][0-9]{2}|21474836[0-4][0-9])');
  });

  it('unwanted zero-padding -- fixed post-bash-4.0', function() {
    compare('{10..0..2}', '(10|8|6|4|2|0)');
    compare('{10..0..-2}', '(10|8|6|4|2|0)');
    compare('{-50..-0..5}', '(0|-(50|45|40|35|30|25|20|15|10|5))');
  });

  it('should return an empty string for invalid ranges:', function() {
    compare('{1..10.f}', '');
    compare('{1..ff}', '');
    compare('{1..10..ff}', '');
    compare('{1.20..2}', '');
    compare('{1..20..f2}', '');
    compare('{1..20..2f}', '');
    compare('{1..2f..2}', '');
    compare('{1..ff..2}', '');
    compare('{1..ff}', '');
    compare('{1..0f}', '');
    compare('{1..10f}', '');
    compare('{1..10.f}', '');
    compare('{1..10.f}', '');
    compare('{1..f}', '([1-f])');
  });

  it('weirdly-formed brace expansions -- fixed in post-bash-3.1', function() {
    compare('a-{b{d,e}}-c', 'a-b(d|e)-c');
    compare('a-{bdef-{g,i}-c', 'a-\\{bdef-(g|i)-c');
  });

  it('should not expand quoted strings.', function() {
    compare('{"klklkl"}{1,2,3}', '\\{klklkl\\}(1|2|3)');
    compare('{"x,x"}', '\\{x,x\\}');
  });

  it('should remove braces when only one value exists', function() {
    compare('a{b}c', 'abc');
    compare('a/b/c{d}e', 'a\\/b\\/cde');
  });

  it('should work with nested non-sets', function() {
    compare('{a-{b,c,d}}', '\\{a-(b|c|d)\\}');
    compare('{a,{a-{b,c,d}}}', '(a|\\{a-(b|c|d)\\})');
  });

  it('should handle imbalanced braces', function() {
    compare('a-{bdef-{g,i}-c', 'a-\\{bdef-(g|i)-c');
    compare('abc{', 'abc\\{');
    compare('{abc{', '\\{abc\\{');
    compare('{abc', '\\{abc');
    compare('}abc', '\\}abc');
    compare('ab{c', 'ab\\{c');
    compare('ab{c', 'ab\\{c');
    compare('{{a,b}', '\\{(a|b)');
    compare('{a,b}}', '(a|b)\\}');
    compare('abcd{efgh', 'abcd\\{efgh');
    compare('a{b{c{d,e}f}g}h', 'a(b(c(d|e)f)g)h');
    compare('f{x,y{{g,z}}h}', 'f(x|y((g|z))h)');
    compare('z{a,b},c}d', 'z(a|b)|c\\}d');
    compare('a{b{c{d,e}f{x,y{{g}h', 'ab(c(d|e)f(x|y\\{h');
    compare('f{x,y{{g}h', 'f(x|y\\{h');
    compare('f{x,y{{g}}h', 'f\\{x|y(g)h');
    compare('a{b{c{d,e}f{x,y{}g}h', 'ab\\{c(d|e)f(x|y\\{\\}g)h');
    compare('f{x,y{}g}h', 'f(x|y\\{\\}g)h');
    compare('z{a,b{,c}d', 'z\\{a|b(|c)d');
  });

  it('should expand bash exponential notation', function() {
    compare('a{,}', 'a{2}');
    compare('a{,,}', 'a{2}'); //<= TODO
    compare('a{,}{,}', 'a{4}');
    compare('a{,}{,}{,}', 'a{8}');
    compare('a{,}{,}{,}{,}', 'a{16}');
    compare('{a,b{,}{,}{,}}', '(a|b{8})');
    compare('a{,}/{c,d}/e', 'a{2}\\/(c|d)\\/e');
    compare('{a,b{,}{,}{,},c}d', '(a|b{8}|c)d');
  });

  it('should handle spaces', function() {
    compare('0{1..9} {10..20}', '0([1-9]) (1[0-9]|20)');
    compare('a{ ,c{d, },h}x', 'a( |c(d| )|h)x');
    compare('a{ ,c{d, },h} ', 'a( |c(d| )|h) ');

    // see https://github.com/jonschlinkert/micromatch/issues/66
    compare('/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.{html,ejs}', '\\/Users\\/tobiasreich\\/Sites\\/aaa\\/bbb\\/ccc 2016\\/src\\/**\\/[^_]*.(html|ejs)');
  });

  it('should work with leading and trailing commas.', function() {
    compare('a{b,}c', 'a(b|)c');
    compare('a{,b}c', 'a(|b)c');
  });

  it('should expand multiple sets', function() {
    compare('a/{a,b}/{c,d}/e', 'a\\/(a|b)\\/(c|d)\\/e');
    compare('a{b,c}d{e,f}g', 'a(b|c)d(e|f)g');
    compare('a/{x,y}/c{d,e}f.{md,txt}', 'a\\/(x|y)\\/c(d|e)f.(md|txt)');
  });

  it('should expand nested sets', function() {
    compare('{a,b}{{a,b},a,b}', '(a|b)((a|b)|a|b)');
    compare('/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', '\\/usr\\/(ucb\\/(ex|edit)|lib\\/(ex|how_ex))');
    compare('a{b,c{d,e}f}g', 'a(b|c(d|e)f)g');
    compare('a{{x,y},z}b', 'a((x|y)|z)b');
    compare('f{x,y{g,z}}h', 'f(x|y(g|z))h');
    compare('a{b,c{d,e},h}x/z', 'a(b|c(d|e)|h)x\\/z');
    compare('a{b,c{d,e},h}x{y,z}', 'a(b|c(d|e)|h)x(y|z)');
    compare('a{b,c{d,e},{f,g}h}x{y,z}', 'a(b|c(d|e)|(f|g)h)x(y|z)');
    compare('a-{b{d,e}}-c', 'a-b(d|e)-c');
  });

  it('should expand with globs.', function() {
    compare('a/b/{d,e}/*.js', 'a\\/b\\/(d|e)\\/*.js');
    compare('a/**/c/{d,e}/f*.js', 'a\\/**\\/c\\/(d|e)\\/f*.js');
    compare('a/**/c/{d,e}/f*.{md,txt}', 'a\\/**\\/c\\/(d|e)\\/f*.(md|txt)');
  });

  it('should expand with extglobs (TODO)', function() {
    compare('a/b/{d,e,[1-5]}/*.js', 'a\\/b\\/(d|e|[1-5])\\/*.js');
  });

  describe('escaping:', function() {
    it('should not expand strings with es6/bash-like variables.', function() {
      compare('abc/${ddd}/xyz', 'abc\\/\\$\\{ddd\\}\\/xyz');
      compare('a${b}c', 'a\\$\\{b\\}c');
      compare('a/{${b},c}/d', 'a\\/(\\$\\{b\\}|c)\\/d');
      compare('a${b,d}/{foo,bar}c', 'a\\$\\{b,d\\}\\/(foo|bar)c');
    });

    it('should not expand escaped commas.', function() {
      compare('a{b\\,c\\,d}e', 'a\\{b,c,d\\}e');
      compare('a{b\\,c}d', 'a\\{b,c\\}d');
      compare('{abc\\,def}', '\\{abc,def\\}');
      compare('{abc\\,def,ghi}', '\\{abc,def,ghi\\}');
      compare('a/{b,c}/{x\\,y}/d/e', 'a\\/(b|c)\\/\\{x,y\\}\\/d\\/e');
    });

    it.skip('should return sets with escaped commas in `bash` mode.', function() {
      compare('a/{b,c}/{x\\,y}/d/e', 'a\\/(b|c)\\/(x,y)\\/d\\/e');
    });

    it('should not expand escaped braces.', function() {
      compare('{a,b\\}c,d}', '{a,b}c,d}'); // Bash expects ['a','b}c',')]
      compare('\\{a,b,c,d,e}', '{a,b,c,d,e}');
      compare('a/{b,\\{a,b,c,d,e}/d', 'a/b/d','a/{a/d','a/c/d','a/d/d','a/e/d');
      compare('a/{b,\\{a,b,c,d,e}/d', 'a/b/d','a/{a/d','a/b/d','a/c/d','a/d/d','a/e/d');
      compare('a/\\{b,c}/{d,e}/f', 'a/{b,c}/d/f', 'a/{b,c}/e/f');
      compare('./\\{x,y}/{a..z..3}/', './{x,y}/(a|d|g|j|m|p|s|v|y)/');
    });

    it('should not expand escaped braces or commas.', function() {
      compare('{x\\,y,\\{abc\\},trie}', '(x\\,y|\\{abc\\}|trie)');
    });
  });

  describe('options', function() {
    it('should remove empty values and `\\` when `options.strict` is true.', function() {
      compare('{a..A}', 'a', '`', '_', '^', ']', '[', 'Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A');
    });
  });

  describe('custom functions', function() {
    it('should expose the current value as the first param.', function() {
      var res = braces('{1..5}', function(val, isNumber, pad, i) {
        return val;
      });
      assert.deepEqual(res, ['1', '2', '3', '4', '5']);
    });

    it('should expose the `isNumber` boolean as the second param.', function() {
      var res = braces('{a..e}', function(val, isNumber, pad, i) {
        if (!isNumber) {
          return String.fromCharCode(val);
        }
        return val;
      });
      assert.deepEqual(res, ['a', 'b', 'c', 'd', 'e']);
    });

    it('should expose the index as the third param.', function() {
      var res = braces('{a..e}', function(val, isNumber, pad, i) {
        if (!isNumber) {
          return String.fromCharCode(val) + i;
        }
        return val;
      });
      assert.deepEqual(res, ['a0', 'b1', 'c2', 'd3', 'e4']);
    });
  });

  describe('complex', function() {
    it('should expand a complex combination of ranges and sets:', function() {
      compare('a/{x,y}/{1..5}c{d,e}f.{md,txt}', 'a/x/1cdf.md', 'a/y/1cdf.md', 'a/x/2cdf.md', 'a/y/2cdf.md', 'a/x/3cdf.md', 'a/y/3cdf.md', 'a/x/4cdf.md', 'a/y/4cdf.md', 'a/x/5cdf.md', 'a/y/5cdf.md', 'a/x/1cef.md', 'a/y/1cef.md', 'a/x/2cef.md', 'a/y/2cef.md', 'a/x/3cef.md', 'a/y/3cef.md', 'a/x/4cef.md', 'a/y/4cef.md', 'a/x/5cef.md', 'a/y/5cef.md', 'a/x/1cdf.txt', 'a/y/1cdf.txt', 'a/x/2cdf.txt', 'a/y/2cdf.txt', 'a/x/3cdf.txt', 'a/y/3cdf.txt', 'a/x/4cdf.txt', 'a/y/4cdf.txt', 'a/x/5cdf.txt', 'a/y/5cdf.txt', 'a/x/1cef.txt', 'a/y/1cef.txt', 'a/x/2cef.txt', 'a/y/2cef.txt', 'a/x/3cef.txt', 'a/y/3cef.txt', 'a/x/4cef.txt', 'a/y/4cef.txt', 'a/x/5cef.txt', 'a/y/5cef.txt');
    });

    it('should expand complex sets and ranges in `bash` mode:', function() {
      compare('a/{x,{1..5},y}/c{d}e', 'a/x/c{d}e', 'a/1/c{d}e', 'a/y/c{d}e', 'a/2/c{d}e', 'a/3/c{d}e', 'a/4/c{d}e', 'a/5/c{d}e');
    });
  });

  describe('range expansion', function() {
    it('should expand numerical ranges', function() {
      compare('a{0..3}d', 'a0d', 'a1d', 'a2d', 'a3d');
      compare('x{10..1}y', 'x10y', 'x9y', 'x8y', 'x7y', 'x6y', 'x5y', 'x4y', 'x3y', 'x2y', 'x1y');
      compare('x{3..3}y', 'x3y');
      compare('{1..10}', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10');
      compare('{1..3}', '1', '2', '3');
      compare('{1..9}', '1', '2', '3', '4', '5', '6', '7', '8', '9');
      compare('{3..3}', '3');
      compare('{5..8}', '5', '6', '7', '8');
    });

    it('should not try to expand ranges with decimals', function() {
      compare('{1.1..2.1}', '{1.1..2.1}');
      compare('{1.1..2.1}', '{1.1..2.1}');
      compare('{1.1..~2.1}', '{1.1..~2.1}');
    });

    it('should work with dots in file paths', function() {
      compare('../{1..3}/../foo', '..\\/([1-3])\\/..\\/foo');
      compare('../{2..10..2}/../foo', '..\\/(2|4|6|8|10)\\/..\\/foo');
      compare('../{1..3}/../{a,b,c}/foo', '..\\/([1-3])\\/..\\/(a|b|c)\\/foo');
      compare('./{a..z..3}/', '.\\/(a|d|g|j|m|p|s|v|y)\\/');
      compare('./{"x,y"}/{a..z..3}/', '.\\/\\{x,y\\}\\/(a|d|g|j|m|p|s|v|y)\\/');
    });
  });
});