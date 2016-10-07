/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

require('mocha');
var assert = require('assert');
var bash = require('./support/bash');
var support = require('./support/compare');
var braces = require('..');
var expand = braces.expand;
var compare;

describe('optimized', function() {
  beforeEach(function() {
    compare = support({optimize: true});
  });

  describe('sets', function() {
    describe('invalid sets', function() {
      it('should handle invalid sets:', function() {
        compare('{0..10,braces}', ['(0..10|braces)']);
        compare('{1..10,braces}', ['(1..10|braces)']);
      });
    });

    describe('escaping', function() {
      it('should not expand escaped braces', function() {
        compare('\\{a,b,c,d,e}', ['{a,b,c,d,e}']);
        compare('a/b/c/{x,y\\}', ['a/b/c/{x,y}']);
        compare('a/\\{x,y}/cde', ['a/{x,y}/cde']);
        compare('abcd{efgh', ['abcd{efgh']);
        compare('{abc}', ['{abc}']);
        compare('{x,y,\\{a,b,c\\}}', ['(x|y|\\{a|b|c\\})']);
        compare('{x,y,{a,b,c\\}}', ['\\{x,y,(a|b|c\\})']);
        compare('{x,y,{abc},trie}', ['(x|y|\\{abc\\}|trie)']);
        compare('{x\\,y,\\{abc\\},trie}', ['(x,y|\\{abc\\}|trie)']);
      });

      it('should handle spaces', function() {
        // Bash 4.3 says the following should be equivalent to `foo|(1|2)|bar`,
        // That makes sense in Bash, since ' ' is a separator, but not here.
        compare('foo {1,2} bar', ['foo (1|2) bar']);
      });

      it('should handle empty braces', function() {
        compare('{ }', ['\\{ \\}']);
        compare('{', ['\\{']);
        compare('{}', ['\\{\\}']);
        compare('}', ['\\}']);
      });

      it('should escape braces when only one value is defined', function() {
        compare('a{b}c', ['a\\{b\\}c']);
        compare('a/b/c{d}e', ['a/b/c\\{d\\}e']);
      });

      it('should not expand braces in sets with es6/bash-like variables', function() {
        compare('abc/${ddd}/xyz', ['abc/\\$\\{ddd\\}/xyz']);
        compare('a${b}c', ['a\\$\\{b\\}c']);
        compare('a/{${b},c}/d', ['a/(\\$\\{b\\}|c)/d']);
        compare('a${b,d}/{foo,bar}c', ['a\\$\\{b,d\\}/(foo|bar)c']);
      });

      it('should not expand escaped commas.', function() {
        compare('a{b\\,c\\,d}e', ['a\\{b,c,d\\}e']);
        compare('a{b\\,c}d', ['a\\{b,c\\}d']);
        compare('{abc\\,def}', ['\\{abc,def\\}']);
        compare('{abc\\,def,ghi}', ['(abc,def|ghi)']);
        compare('a/{b,c}/{x\\,y}/d/e', ['a/(b|c)/\\{x,y\\}/d/e']);
      });

      it('should return sets with escaped commas', function() {
        compare('a/{b,c}/{x\\,y}/d/e', ['a/(b|c)/\\{x,y\\}/d/e']);
      });

      it('should not expand escaped braces.', function() {
        compare('{a,b\\}c,d}', ['(a|b\\}c|d)']);
        compare('\\{a,b,c,d,e}', ['\\{a,b,c,d,e\\}']);
        compare('a/{z,\\{a,b,c,d,e}/d', ['a/(z|\\{a|b|c|d|e)/d']);
        compare('a/\\{b,c}/{d,e}/f', ['a/\\{b,c\\}/(d|e)/f']);
        compare('./\\{x,y}/{a..z..3}/', ['./\\{x,y\\}/(a|d|g|j|m|p|s|v|y)/']);
      });

      it('should not expand escaped braces or commas.', function() {
        compare('{x\\,y,\\{abc\\},trie}', ['(x,y|\\{abc\\}|trie)']);
      });
    });

    describe('set expansion', function() {
      it('should support sequence brace operators', function() {
        compare('/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', ['/usr/(ucb/(ex|edit)|lib/(ex|how_ex))']);
        compare('ff{c,b,a}', ['ff(c|b|a)']);
        compare('f{d,e,f}g', ['f(d|e|f)g']);
        compare('x{{0..10},braces}y', ['x(([0-9]|10)|braces)y']);
        compare('{1..10}', ['([1-9]|10)']);
        compare('{a,b,c}', ['(a|b|c)']);
        compare('{braces,{0..10}}', ['(braces|([0-9]|10))']);
        compare('{l,n,m}xyz', ['(l|n|m)xyz']);
        compare('{{0..10},braces}', ['(([0-9]|10)|braces)']);
        compare('{{1..10..2},braces}', ['((1|3|5|7|9)|braces)']);
        compare('{{1..10},braces}', ['(([1-9]|10)|braces)']);
      });

      it('should expand multiple sets', function() {
        compare('a/{a,b}/{c,d}/e', ['a/(a|b)/(c|d)/e']);
        compare('a{b,c}d{e,f}g', ['a(b|c)d(e|f)g']);
        compare('a/{x,y}/c{d,e}f.{md,txt}', ['a/(x|y)/c(d|e)f.(md|txt)']);
      });

      it('should expand nested sets', function() {
        compare('{a,b}{{a,b},a,b}', ['(a|b)((a|b)|a|b)']);
        compare('a{b,c{d,e}f}g', ['a(b|c(d|e)f)g']);
        compare('a{{x,y},z}b', ['a((x|y)|z)b']);
        compare('f{x,y{g,z}}h', ['f(x|y(g|z))h']);
        compare('a{b,c}{d,e}/hx/z', ['a(b|c)(d|e)/hx/z']);
        compare('a{b,c{d,e},h}x/z', ['a(b|c(d|e)|h)x/z']);
        compare('a{b,c{d,e},h}x{y,z}', ['a(b|c(d|e)|h)x(y|z)']);
        compare('a{b,c{d,e},{f,g}h}x{y,z}', ['a(b|c(d|e)|(f|g)h)x(y|z)']);
        compare('a-{b{d,e}}-c', ['a-\\{b(d|e)\\}-c']);
      });

      it('should expand not modify non-brace characters', function() {
        compare('a/b/{d,e}/*.js', ['a/b/(d|e)/*.js']);
        compare('a/**/c/{d,e}/f*.js', ['a/**/c/(d|e)/f*.js']);
        compare('a/**/c/{d,e}/f*.{md,txt}', ['a/**/c/(d|e)/f*.(md|txt)']);
      });
    });

    describe('commas', function() {
      it('should work with leading and trailing commas.', function() {
        compare('a{b,}c', ['a(b|)c']);
        compare('a{,b}c', ['a(|b)c']);
      });
    });

    describe('spaces', function() {
      it('should handle spaces', function() {
        compare('0{1..9} {10..20}', ['0([1-9]) (1[0-9]|20)']);
        compare('a{ ,c{d, },h}x', ['a( |c(d| )|h)x']);
        compare('a{ ,c{d, },h} ', ['a( |c(d| )|h) ']);

        // see https://github.com/jonschlinkert/micromatch/issues/66
        compare('/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.{html,ejs}', ['/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.(html|ejs)']);
      });
    });
  });

  /**
   * Ranges
   */

  describe('ranges', function() {
    describe('escaping / invalid ranges', function() {
      it('should not try to expand ranges with decimals', function() {
        compare('{1.1..2.1}', ['\\{1.1..2.1\\}']);
        compare('{1.1..~2.1}', ['\\{1.1..~2.1\\}']);
      });

      it('should escape invalid ranges:', function() {
        compare('{1..0f}', ['{1..0f}']);
        compare('{1..10..ff}', ['{1..10..ff}']);
        compare('{1..10.f}', ['{1..10.f}']);
        compare('{1..10f}', ['{1..10f}']);
        compare('{1..20..2f}', ['{1..20..2f}']);
        compare('{1..20..f2}', ['{1..20..f2}']);
        compare('{1..2f..2}', ['{1..2f..2}']);
        compare('{1..ff..2}', ['{1..ff..2}']);
        compare('{1..ff}', ['{1..ff}']);
        compare('{1..f}', ['([1-f])']);
        compare('{1.20..2}', ['{1.20..2}']);
      });

      it('weirdly-formed brace expansions -- fixed in post-bash-3.1', function() {
        compare('a-{b{d,e}}-c', ['a-\\{b(d|e)\\}-c']);
        compare('a-{bdef-{g,i}-c', ['a-\\{bdef-(g|i)-c']);
      });

      it('should not expand quoted strings.', function() {
        compare('{"klklkl"}{1,2,3}', ['\\{klklkl\\}(1|2|3)']);
        compare('{"x,x"}', ['\\{x,x\\}']);
      });

      it('should escaped outer braces in nested non-sets', function() {
        compare('{a-{b,c,d}}', ['{a-(b|c|d)}']);
        compare('{a,{a-{b,c,d}}}', ['(a|{a-(b|c|d)})']);
      });

      it('should escape imbalanced braces', function() {
        compare('a-{bdef-{g,i}-c', ['a-\\{bdef-(g|i)-c']);
        compare('abc{', ['abc\\{']);
        compare('{abc{', ['\\{abc\\{']);
        compare('{abc', ['\\{abc']);
        compare('}abc', ['\\}abc']);
        compare('ab{c', ['ab\\{c']);
        compare('{{a,b}', ['\\{(a|b)']);
        compare('{a,b}}', ['(a|b)\\}']);
        compare('abcd{efgh', ['abcd\\{efgh']);
        compare('a{b{c{d,e}f}g}h', ['a(b(c(d|e)f)g)h']);
        compare('f{x,y{{g,z}}h}', ['f(x|y((g|z))h)']);
        compare('z{a,b},c}d', ['z(a|b),c\\}d']);
        compare('a{b{c{d,e}f{x,y{{g}h', ['a\\{b\\{c(d|e)f\\{x,y\\{\\{g\\}h']);
        compare('f{x,y{{g}h', ['f\\{x,y\\{\\{g\\}h']);
        compare('f{x,y{{g}}h', ['f{x,y{{g}}h']);
        compare('a{b{c{d,e}f{x,y{}g}h', ['a{b{c(d|e)f(x|y{}g)h']);
        compare('f{x,y{}g}h', ['f(x|y\\{\\}g)h']);
        compare('z{a,b{,c}d', ['z\\{a,b(|c)d']);
      });
    });

    describe('positive numeric ranges', function() {
      it('should expand numeric ranges', function() {
        compare('a{0..3}d', ['a([0-3])d']);
        compare('x{10..1}y', ['x([1-9]|10)y']);
        compare('x{3..3}y', ['x3y']);
        compare('{1..10}', ['([1-9]|10)']);
        compare('{1..3}', ['([1-3])']);
        compare('{1..9}', ['([1-9])']);
        compare('{10..1}', ['([1-9]|10)']);
        compare('{10..1}y', ['([1-9]|10)y']);
        compare('{3..3}', ['3']);
        compare('{5..8}', ['([5-8])']);
      });
    });

    describe('negative ranges', function() {
      it('should expand ranges with negative numbers', function() {
        compare('{-1..-10}', ['(-[1-9]|-10)']);
        compare('{-10..-1}', ['(-[1-9]|-10)']);
        compare('{-20..0}', ['(-[1-9]|-1[0-9]|-20|0)']);
        compare('{0..-5}', ['(-[1-5]|0)']);
        compare('{9..-4}', ['(-[1-4]|[0-9])']);
      });
    });

    describe('alphabetical ranges', function() {
      it('should expand alphabetical ranges', function() {
        compare('0{1..9}/{10..20}', ['0([1-9])/(1[0-9]|20)']);
        compare('0{a..d}0', ['0([a-d])0']);
        compare('a/{b..d}/e', ['a/([b-d])/e']);
        compare('{1..f}', ['([1-f])']);
        compare('{a..A}', ['([A-a])']);
        compare('{A..a}', ['([A-a])']);
        compare('{a..e}', ['([a-e])']);
        compare('{A..E}', ['([A-E])']);
        compare('{a..f}', ['([a-f])']);
        compare('{a..z}', ['([a-z])']);
        compare('{E..A}', ['([A-E])']);
        compare('{f..1}', ['([1-f])']);
        compare('{f..a}', ['([a-f])']);
        compare('{f..f}', ['f']);
      });

      it('should expand multiple ranges:', function() {
        compare('a/{b..d}/e/{f..h}', ['a/([b-d])/e/([f-h])']);
      });
    });

    describe('combo', function() {
      it('should expand numerical ranges - positive and negative', function() {
        compare('{-10..10}', ['(-[1-9]|-?10|[0-9])']);
      });
    });

    // HEADS UP! If you're using the `--mm` flag minimatch freezes on these
    describe('large numbers', function() {
      it('should expand large numbers', function() {
        compare('{2147483645..2147483649}', ['(214748364[5-9])']);
        compare('{214748364..2147483649}', ['(21474836[4-9]|2147483[7-9][0-9]|214748[4-9][0-9]{2}|214749[0-9]{3}|2147[5-9][0-9]{4}|214[8-9][0-9]{5}|21[5-9][0-9]{6}|2[2-9][0-9]{7}|[3-9][0-9]{8}|1[0-9]{9}|20[0-9]{8}|21[0-3][0-9]{7}|214[0-6][0-9]{6}|2147[0-3][0-9]{5}|21474[0-7][0-9]{4}|214748[0-2][0-9]{3}|2147483[0-5][0-9]{2}|21474836[0-4][0-9])']);
      });
    });

    describe('steps > positive ranges', function() {
      it('should expand ranges using steps:', function() {
        compare('{1..10..1}', ['([1-9]|10)']);
        compare('{1..10..2}', ['(1|3|5|7|9)']);
        compare('{1..20..20}', ['1']);
        compare('{1..20..20}', ['1']);
        compare('{1..20..20}', ['1']);
        compare('{1..20..2}', ['(1|3|5|7|9|11|13|15|17|19)']);
        compare('{10..0..2}', ['(10|8|6|4|2|0)']);
        compare('{10..1..2}', ['(10|8|6|4|2)']);
        compare('{100..0..5}', ['(100|95|90|85|80|75|70|65|60|55|50|45|40|35|30|25|20|15|10|5|0)']);
        compare('{2..10..1}', ['([2-9]|10)']);
        compare('{2..10..2}', ['(2|4|6|8|10)']);
        compare('{2..10..3}', ['(2|5|8)']);
        compare('{a..z..2}', ['(a|c|e|g|i|k|m|o|q|s|u|w|y)']);
      });

      it('should expand positive ranges with negative steps:', function() {
        compare('{10..0..-2}', ['(10|8|6|4|2|0)']);
      });
    });

    describe('steps > negative ranges', function() {
      it('should expand negative ranges using steps:', function() {
        compare('{-1..-10..-2}', ['(-(1|3|5|7|9))']);
        compare('{-1..-10..2}', ['(-(1|3|5|7|9))']);
        compare('{-10..-2..2}', ['(-(10|8|6|4|2))']);
        compare('{-2..-10..1}', ['(-[2-9]|-10)']);
        compare('{-2..-10..2}', ['(-(2|4|6|8|10))']);
        compare('{-2..-10..3}', ['(-(2|5|8))']);
        compare('{-50..-0..5}', ['(0|-(50|45|40|35|30|25|20|15|10|5))']);
        compare('{-9..9..3}', ['(0|3|6|9|-(9|6|3))']);
        compare('{10..1..-2}', ['(10|8|6|4|2)']);
        compare('{100..0..-5}', ['(100|95|90|85|80|75|70|65|60|55|50|45|40|35|30|25|20|15|10|5|0)']);
      });
    });

    describe('steps > alphabetical ranges', function() {
      it('should expand alpha ranges with steps', function() {
        compare('{a..e..2}', ['(a|c|e)']);
        compare('{E..A..2}', ['(E|C|A)']);
        compare('{a..z}', ['([a-z])']);
        compare('{a..z..2}', ['(a|c|e|g|i|k|m|o|q|s|u|w|y)']);
        compare('{z..a..-2}', ['(z|x|v|t|r|p|n|l|j|h|f|d|b)']);
      });

      it('should expand alpha ranges with negative steps', function() {
        compare('{z..a..-2}', ['(z|x|v|t|r|p|n|l|j|h|f|d|b)']);
      });
    });

    describe('padding', function() {
      it('unwanted zero-padding -- fixed post-bash-4.0', function() {
        compare('{10..0..2}', ['(10|8|6|4|2|0)']);
        compare('{10..0..-2}', ['(10|8|6|4|2|0)']);
        compare('{-50..-0..5}', ['(0|-(50|45|40|35|30|25|20|15|10|5))']);
      });
    });
  });

  describe('integration', function() {
    it('should work with dots in file paths', function() {
      compare('../{1..3}/../foo', ['../([1-3])/../foo']);
      compare('../{2..10..2}/../foo', ['../(2|4|6|8|10)/../foo']);
      compare('../{1..3}/../{a,b,c}/foo', ['../([1-3])/../(a|b|c)/foo']);
      compare('./{a..z..3}/', ['./(a|d|g|j|m|p|s|v|y)/']);
      compare('./{"x,y"}/{a..z..3}/', ['./\\{x,y\\}/(a|d|g|j|m|p|s|v|y)/']);
    });

    it('should expand a complex combination of ranges and sets:', function() {
      compare('a/{x,y}/{1..5}c{d,e}f.{md,txt}', ['a/(x|y)/([1-5])c(d|e)f.(md|txt)']);
    });

    it('should expand complex sets and ranges in `bash` mode:', function() {
      compare('a/{x,{1..5},y}/c{d}e', ['a/(x|([1-5])|y)/c\\{d\\}e']);
    });
  });
});
