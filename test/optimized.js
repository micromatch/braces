/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

require('mocha');
var match = require('./support/match');
var braces = require('..');

describe('optimized', function() {

  describe('sets', function() {
    describe('invalid sets', function() {
      it('should handle invalid sets:', function() {
        match('{0..10,braces}', ['(0..10|braces)']);
        match('{1..10,braces}', ['(1..10|braces)']);
      });
    });

    describe('escaping', function() {
      it('should not expand escaped braces', function() {
        match('\\{a,b,c,d,e}', ['{a,b,c,d,e}']);
        match('a/b/c/{x,y\\}', ['a/b/c/{x,y}']);
        match('a/\\{x,y}/cde', ['a/{x,y}/cde']);
        match('abcd{efgh', ['abcd{efgh']);
        match('{abc}', ['{abc}']);
        match('{x,y,\\{a,b,c\\}}', ['(x|y|\\{a|b|c\\})']);
        match('{x,y,{a,b,c\\}}', ['\\{x,y,(a|b|c\\})']);
        match('{x,y,{abc},trie}', ['(x|y|\\{abc\\}|trie)']);
        match('{x\\,y,\\{abc\\},trie}', ['(x,y|\\{abc\\}|trie)']);
      });

      it('should handle spaces', function() {
        // Bash 4.3 says the following should be equivalent to `foo|(1|2)|bar`,
        // That makes sense in Bash, since ' ' is a separator, but not here.
        match('foo {1,2} bar', ['foo (1|2) bar']);
      });

      it('should handle empty braces', function() {
        match('{ }', ['\\{ \\}']);
        match('{', ['\\{']);
        match('{}', ['\\{\\}']);
        match('}', ['\\}']);
      });

      it('should escape braces when only one value is defined', function() {
        match('a{b}c', ['a\\{b\\}c']);
        match('a/b/c{d}e', ['a/b/c\\{d\\}e']);
      });

      it('should not expand braces in sets with es6/bash-like variables', function() {
        match('abc/${ddd}/xyz', ['abc/\\$\\{ddd\\}/xyz']);
        match('a${b}c', ['a\\$\\{b\\}c']);
        match('a/{${b},c}/d', ['a/(\\$\\{b\\}|c)/d']);
        match('a${b,d}/{foo,bar}c', ['a\\$\\{b,d\\}/(foo|bar)c']);
      });

      it('should not expand escaped commas.', function() {
        match('a{b\\,c\\,d}e', ['a\\{b,c,d\\}e']);
        match('a{b\\,c}d', ['a\\{b,c\\}d']);
        match('{abc\\,def}', ['\\{abc,def\\}']);
        match('{abc\\,def,ghi}', ['(abc,def|ghi)']);
        match('a/{b,c}/{x\\,y}/d/e', ['a/(b|c)/\\{x,y\\}/d/e']);
      });

      it('should return sets with escaped commas', function() {
        match('a/{b,c}/{x\\,y}/d/e', ['a/(b|c)/\\{x,y\\}/d/e']);
      });

      it('should not expand escaped braces.', function() {
        match('{a,b\\}c,d}', ['(a|b\\}c|d)']);
        match('\\{a,b,c,d,e}', ['\\{a,b,c,d,e\\}']);
        match('a/{z,\\{a,b,c,d,e}/d', ['a/(z|\\{a|b|c|d|e)/d']);
        match('a/\\{b,c}/{d,e}/f', ['a/\\{b,c\\}/(d|e)/f']);
        match('./\\{x,y}/{a..z..3}/', ['./\\{x,y\\}/(a|d|g|j|m|p|s|v|y)/']);
      });

      it('should not expand escaped braces or commas.', function() {
        match('{x\\,y,\\{abc\\},trie}', ['(x,y|\\{abc\\}|trie)']);
      });
    });

    describe('set expansion', function() {
      it('should support sequence brace operators', function() {
        match('/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', ['/usr/(ucb/(ex|edit)|lib/(ex|how_ex))']);
        match('ff{c,b,a}', ['ff(c|b|a)']);
        match('f{d,e,f}g', ['f(d|e|f)g']);
        match('x{{0..10},braces}y', ['x(([0-9]|10)|braces)y']);
        match('{1..10}', ['([1-9]|10)']);
        match('{a,b,c}', ['(a|b|c)']);
        match('{braces,{0..10}}', ['(braces|([0-9]|10))']);
        match('{l,n,m}xyz', ['(l|n|m)xyz']);
        match('{{0..10},braces}', ['(([0-9]|10)|braces)']);
        match('{{1..10..2},braces}', ['((1|3|5|7|9)|braces)']);
        match('{{1..10},braces}', ['(([1-9]|10)|braces)']);
      });

      it('should expand multiple sets', function() {
        match('a/{a,b}/{c,d}/e', ['a/(a|b)/(c|d)/e']);
        match('a{b,c}d{e,f}g', ['a(b|c)d(e|f)g']);
        match('a/{x,y}/c{d,e}f.{md,txt}', ['a/(x|y)/c(d|e)f.(md|txt)']);
      });

      it('should expand nested sets', function() {
        match('{a,b}{{a,b},a,b}', ['(a|b)((a|b)|a|b)']);
        match('a{b,c{d,e}f}g', ['a(b|c(d|e)f)g']);
        match('a{{x,y},z}b', ['a((x|y)|z)b']);
        match('f{x,y{g,z}}h', ['f(x|y(g|z))h']);
        match('a{b,c}{d,e}/hx/z', ['a(b|c)(d|e)/hx/z']);
        match('a{b,c{d,e},h}x/z', ['a(b|c(d|e)|h)x/z']);
        match('a{b,c{d,e},h}x{y,z}', ['a(b|c(d|e)|h)x(y|z)']);
        match('a{b,c{d,e},{f,g}h}x{y,z}', ['a(b|c(d|e)|(f|g)h)x(y|z)']);
        match('a-{b{d,e}}-c', ['a-\\{b(d|e)\\}-c']);
      });

      it('should expand not modify non-brace characters', function() {
        match('a/b/{d,e}/*.js', ['a/b/(d|e)/*.js']);
        match('a/**/c/{d,e}/f*.js', ['a/**/c/(d|e)/f*.js']);
        match('a/**/c/{d,e}/f*.{md,txt}', ['a/**/c/(d|e)/f*.(md|txt)']);
      });
    });

    describe('commas', function() {
      it('should work with leading and trailing commas.', function() {
        match('a{b,}c', ['a(b|)c']);
        match('a{,b}c', ['a(|b)c']);
      });
    });

    describe('spaces', function() {
      it('should handle spaces', function() {
        match('0{1..9} {10..20}', ['0([1-9]) (1[0-9]|20)']);
        match('a{ ,c{d, },h}x', ['a( |c(d| )|h)x']);
        match('a{ ,c{d, },h} ', ['a( |c(d| )|h) ']);

        // see https://github.com/jonschlinkert/micromatch/issues/66
        match('/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.{html,ejs}', ['/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.(html|ejs)']);
      });
    });
  });

  /**
   * Ranges
   */

  describe('ranges', function() {
    describe('escaping / invalid ranges', function() {
      it('should not try to expand ranges with decimals', function() {
        match('{1.1..2.1}', ['\\{1.1..2.1\\}']);
        match('{1.1..~2.1}', ['\\{1.1..~2.1\\}']);
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
        match('{1..f}', ['([1-f])']);
        match('{1.20..2}', ['{1.20..2}']);
      });

      it('weirdly-formed brace expansions -- fixed in post-bash-3.1', function() {
        match('a-{b{d,e}}-c', ['a-\\{b(d|e)\\}-c']);
        match('a-{bdef-{g,i}-c', ['a-\\{bdef-(g|i)-c']);
      });

      it('should not expand quoted strings.', function() {
        match('{"klklkl"}{1,2,3}', ['\\{klklkl\\}(1|2|3)']);
        match('{"x,x"}', ['\\{x,x\\}']);
      });

      it('should escaped outer braces in nested non-sets', function() {
        match('{a-{b,c,d}}', ['{a-(b|c|d)}']);
        match('{a,{a-{b,c,d}}}', ['(a|{a-(b|c|d)})']);
      });

      it('should escape imbalanced braces', function() {
        match('a-{bdef-{g,i}-c', ['a-\\{bdef-(g|i)-c']);
        match('abc{', ['abc\\{']);
        match('{abc{', ['\\{abc\\{']);
        match('{abc', ['\\{abc']);
        match('}abc', ['\\}abc']);
        match('ab{c', ['ab\\{c']);
        match('{{a,b}', ['\\{(a|b)']);
        match('{a,b}}', ['(a|b)\\}']);
        match('abcd{efgh', ['abcd\\{efgh']);
        match('a{b{c{d,e}f}g}h', ['a(b(c(d|e)f)g)h']);
        match('f{x,y{{g,z}}h}', ['f(x|y((g|z))h)']);
        match('z{a,b},c}d', ['z(a|b),c\\}d']);
        match('a{b{c{d,e}f{x,y{{g}h', ['a\\{b\\{c(d|e)f\\{x,y\\{\\{g\\}h']);
        match('f{x,y{{g}h', ['f\\{x,y\\{\\{g\\}h']);
        match('f{x,y{{g}}h', ['f{x,y{{g}}h']);
        match('a{b{c{d,e}f{x,y{}g}h', ['a{b{c(d|e)f(x|y{}g)h']);
        match('f{x,y{}g}h', ['f(x|y\\{\\}g)h']);
        match('z{a,b{,c}d', ['z\\{a,b(|c)d']);
      });
    });

    describe('positive numeric ranges', function() {
      it('should expand numeric ranges', function() {
        match('a{0..3}d', ['a([0-3])d']);
        match('x{10..1}y', ['x([1-9]|10)y']);
        match('x{3..3}y', ['x3y']);
        match('{1..10}', ['([1-9]|10)']);
        match('{1..3}', ['([1-3])']);
        match('{1..9}', ['([1-9])']);
        match('{10..1}', ['([1-9]|10)']);
        match('{10..1}y', ['([1-9]|10)y']);
        match('{3..3}', ['3']);
        match('{5..8}', ['([5-8])']);
      });
    });

    describe('negative ranges', function() {
      it('should expand ranges with negative numbers', function() {
        match('{-1..-10}', ['(-[1-9]|-10)']);
        match('{-10..-1}', ['(-[1-9]|-10)']);
        match('{-20..0}', ['(-[1-9]|-1[0-9]|-20|0)']);
        match('{0..-5}', ['(-[1-5]|0)']);
        match('{9..-4}', ['(-[1-4]|[0-9])']);
      });
    });

    describe('alphabetical ranges', function() {
      it('should expand alphabetical ranges', function() {
        match('0{1..9}/{10..20}', ['0([1-9])/(1[0-9]|20)']);
        match('0{a..d}0', ['0([a-d])0']);
        match('a/{b..d}/e', ['a/([b-d])/e']);
        match('{1..f}', ['([1-f])']);
        match('{a..A}', ['([A-a])']);
        match('{A..a}', ['([A-a])']);
        match('{a..e}', ['([a-e])']);
        match('{A..E}', ['([A-E])']);
        match('{a..f}', ['([a-f])']);
        match('{a..z}', ['([a-z])']);
        match('{E..A}', ['([A-E])']);
        match('{f..1}', ['([1-f])']);
        match('{f..a}', ['([a-f])']);
        match('{f..f}', ['f']);
      });

      it('should expand multiple ranges:', function() {
        match('a/{b..d}/e/{f..h}', ['a/([b-d])/e/([f-h])']);
      });
    });

    describe('combo', function() {
      it('should expand numerical ranges - positive and negative', function() {
        match('{-10..10}', ['(-[1-9]|-?10|[0-9])']);
      });
    });

    // HEADS UP! If you're using the `--mm` flag minimatch freezes on these
    describe('large numbers', function() {
      it('should expand large numbers', function() {
        match('{2147483645..2147483649}', ['(214748364[5-9])']);
        match('{214748364..2147483649}', ['(21474836[4-9]|2147483[7-9][0-9]|214748[4-9][0-9]{2}|214749[0-9]{3}|2147[5-9][0-9]{4}|214[8-9][0-9]{5}|21[5-9][0-9]{6}|2[2-9][0-9]{7}|[3-9][0-9]{8}|1[0-9]{9}|20[0-9]{8}|21[0-3][0-9]{7}|214[0-6][0-9]{6}|2147[0-3][0-9]{5}|21474[0-7][0-9]{4}|214748[0-2][0-9]{3}|2147483[0-5][0-9]{2}|21474836[0-4][0-9])']);
      });
    });

    describe('steps > positive ranges', function() {
      it('should expand ranges using steps:', function() {
        match('{1..10..1}', ['([1-9]|10)']);
        match('{1..10..2}', ['(1|3|5|7|9)']);
        match('{1..20..20}', ['1']);
        match('{1..20..20}', ['1']);
        match('{1..20..20}', ['1']);
        match('{1..20..2}', ['(1|3|5|7|9|11|13|15|17|19)']);
        match('{10..0..2}', ['(10|8|6|4|2|0)']);
        match('{10..1..2}', ['(10|8|6|4|2)']);
        match('{100..0..5}', ['(100|95|90|85|80|75|70|65|60|55|50|45|40|35|30|25|20|15|10|5|0)']);
        match('{2..10..1}', ['([2-9]|10)']);
        match('{2..10..2}', ['(2|4|6|8|10)']);
        match('{2..10..3}', ['(2|5|8)']);
        match('{a..z..2}', ['(a|c|e|g|i|k|m|o|q|s|u|w|y)']);
      });

      it('should expand positive ranges with negative steps:', function() {
        match('{10..0..-2}', ['(10|8|6|4|2|0)']);
      });
    });

    describe('steps > negative ranges', function() {
      it('should expand negative ranges using steps:', function() {
        match('{-1..-10..-2}', ['(-(1|3|5|7|9))']);
        match('{-1..-10..2}', ['(-(1|3|5|7|9))']);
        match('{-10..-2..2}', ['(-(10|8|6|4|2))']);
        match('{-2..-10..1}', ['(-[2-9]|-10)']);
        match('{-2..-10..2}', ['(-(2|4|6|8|10))']);
        match('{-2..-10..3}', ['(-(2|5|8))']);
        match('{-50..-0..5}', ['(0|-(50|45|40|35|30|25|20|15|10|5))']);
        match('{-9..9..3}', ['(0|3|6|9|-(9|6|3))']);
        match('{10..1..-2}', ['(10|8|6|4|2)']);
        match('{100..0..-5}', ['(100|95|90|85|80|75|70|65|60|55|50|45|40|35|30|25|20|15|10|5|0)']);
      });
    });

    describe('steps > alphabetical ranges', function() {
      it('should expand alpha ranges with steps', function() {
        match('{a..e..2}', ['(a|c|e)']);
        match('{E..A..2}', ['(E|C|A)']);
        match('{a..z}', ['([a-z])']);
        match('{a..z..2}', ['(a|c|e|g|i|k|m|o|q|s|u|w|y)']);
        match('{z..a..-2}', ['(z|x|v|t|r|p|n|l|j|h|f|d|b)']);
      });

      it('should expand alpha ranges with negative steps', function() {
        match('{z..a..-2}', ['(z|x|v|t|r|p|n|l|j|h|f|d|b)']);
      });
    });

    describe('padding', function() {
      it('unwanted zero-padding -- fixed post-bash-4.0', function() {
        match('{10..0..2}', ['(10|8|6|4|2|0)']);
        match('{10..0..-2}', ['(10|8|6|4|2|0)']);
        match('{-50..-0..5}', ['(0|-(50|45|40|35|30|25|20|15|10|5))']);
      });
    });
  });

  describe('integration', function() {
    it('should work with dots in file paths', function() {
      match('../{1..3}/../foo', ['../([1-3])/../foo']);
      match('../{2..10..2}/../foo', ['../(2|4|6|8|10)/../foo']);
      match('../{1..3}/../{a,b,c}/foo', ['../([1-3])/../(a|b|c)/foo']);
      match('./{a..z..3}/', ['./(a|d|g|j|m|p|s|v|y)/']);
      match('./{"x,y"}/{a..z..3}/', ['./\\{x,y\\}/(a|d|g|j|m|p|s|v|y)/']);
    });

    it('should expand a complex combination of ranges and sets:', function() {
      match('a/{x,y}/{1..5}c{d,e}f.{md,txt}', ['a/(x|y)/([1-5])c(d|e)f.(md|txt)']);
    });

    it('should expand complex sets and ranges in `bash` mode:', function() {
      match('a/{x,{1..5},y}/c{d}e', ['a/(x|([1-5])|y)/c\\{d\\}e']);
    });
  });
});
