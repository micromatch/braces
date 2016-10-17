'use strict';

require('mocha');
var match = require('./support/match');
var braces = require('..');
var expand = braces.expand;

describe('expanded', function() {
  describe('sets', function() {
    describe('invalid sets', function() {
      it('should handle invalid sets:', function() {
        match(expand('{0..10,braces}'), ['0..10', 'braces']);
        match(expand('{1..10,braces}'), ['1..10', 'braces']);
      });
    });

    describe('escaping', function() {
      it('should not expand escaped braces', function() {
        match(expand('y{\\},a}x'), ['y}x', 'yax']);
        match(expand('y{\\},a}x'), ['yax', 'y}x']);
        match(expand('{a,\\\\{a,b}c}'), ['a', 'ac', 'bc']);
        match(expand('\\{a,b,c,d,e}'), ['{a,b,c,d,e}']);
        match(expand('a/b/c/{x,y\\}'), ['a/b/c/{x,y}']);
        match(expand('a/\\{x,y}/cde'), ['a/{x,y}/cde']);
        match(expand('abcd{efgh'), ['abcd{efgh']);
        match(expand('{abc}'), ['\\{abc\\}']);
        match(expand('{x,y,\\{a,b,c\\}}'), ['x', 'y', '\\{a', 'b', 'c\\}']);
        match(expand('{x,y,{a,b,c\\}}'), ['{x,y,a', '{x,y,b', '{x,y,c\\}']);
        match(expand('{x,y,{abc},trie}'), ['x', 'y', '\\{abc\\}', 'trie']);
        match(expand('{x\\,y,\\{abc\\},trie}'), ['x,y', '\\{abc\\}', 'trie']);
      });

      it('should handle empty braces', function() {
        match(expand('{ }'), ['\\{ \\}']);
        match(expand('{'), ['\\{']);
        match(expand('{}'), ['\\{\\}']);
        match(expand('}'), ['\\}']);
      });

      it('should handle empty sets', function() {
        match(expand('{ }'), ['\\{ \\}']);
        match(expand('{'), ['\\{']);
        match(expand('{}'), ['\\{\\}']);
        match(expand('}'), ['\\}']);
      });

      it('should escape braces when only one value is defined', function() {
        match(expand('a{b}c'), ['a\\{b\\}c']);
        match(expand('a/b/c{d}e'), ['a/b/c\\{d\\}e']);
      });

      it('should escape closing braces when open is not defined', function() {
        match(expand('{a,b}c,d}'), ['ac,d}', 'bc,d}']);
      });

      it('should not expand braces in sets with es6/bash-like variables', function() {
        match(expand('abc/${ddd}/xyz'), ['abc/\\$\\{ddd\\}/xyz']);
        match(expand('a${b}c'), ['a\\$\\{b\\}c']);
        match(expand('a/{${b},c}/d'), ['a/\\$\\{b\\}/d', 'a/c/d']);
        match(expand('a${b,d}/{foo,bar}c'), ['a\\$\\{b,d\\}/fooc', 'a\\$\\{b,d\\}/barc']);
      });

      it('should not expand escaped commas.', function() {
        match(expand('a{b\\,c\\,d}e'), ['a{b,c,d}e']);
        match(expand('a{b\\,c}d'), ['a{b,c}d']);
        match(expand('{abc\\,def}'), ['{abc,def}']);
        match(expand('{abc\\,def,ghi}'), ['abc,def', 'ghi']);
        match(expand('a/{b,c}/{x\\,y}/d/e'), ['a/b/{x,y}/d/e', 'a/c/{x,y}/d/e']);
      });

      it('should return sets with escaped commas', function() {
      });

      it('should not expand escaped braces.', function() {
        match(expand('{a,b\\}c,d}'), ['a', 'b}c', 'd']);
        match(expand('\\{a,b,c,d,e}'), ['{a,b,c,d,e}']);
        match(expand('a/{z,\\{a,b,c,d,e}/d'), ['a/{a/d', 'a/b/d', 'a/c/d', 'a/d/d', 'a/e/d', 'a/z/d']);
        match(expand('a/\\{b,c}/{d,e}/f'), ['a/{b,c}/d/f', 'a/{b,c}/e/f']);
        match(expand('./\\{x,y}/{a..z..3}/'), ['./{x,y}/a/', './{x,y}/d/', './{x,y}/g/', './{x,y}/j/', './{x,y}/m/', './{x,y}/p/', './{x,y}/s/', './{x,y}/v/', './{x,y}/y/']);
      });

      it('should not expand escaped braces or commas.', function() {
        match(expand('{x\\,y,\\{abc\\},trie}'), ['{abc}', 'trie', 'x,y']);
      });
    });

    describe('multipliers', function() {
      it('should support multipliers', function() {
        match(expand('{{d,d},e}{,}'), ['d', 'd', 'd', 'd', 'e', 'e']);
        match(expand('{d{,},e}{,}'), ['d', 'd', 'd', 'd', 'e', 'e']);
        match(expand('a/{,}{c,d}/e'), ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']);
        match(expand('a/{c,d}{,}/e'), ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']);
        match(expand('a/{b,c{,}}'), ['a/b', 'a/c', 'a/c']);
        match(expand('a{,,}'), ['a', 'a', 'a']);
        match(expand('a{,}'), ['a', 'a']);
        match(expand('a{,}/{c,d}/e'), ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']);
        match(expand('a{,}{,}'), ['a', 'a', 'a', 'a']);
        match(expand('a{,}{,}{,}'), ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
        match(expand('a{,}{,}{,}{,}'), ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
        match(expand('{,}'), []);
        match(expand('{a,b{,}{,}{,},c}d'), ['ad', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'cd']);
        match(expand('{a,b{,}{,}{,}}'), ['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']);
        match(expand('{a{,,}b{,}}'), ['{ab}', '{ab}', '{ab}', '{ab}', '{ab}', '{ab}']);
        match(expand('{d{,},e}{,}'), ['d', 'd', 'd', 'd', 'e', 'e']);
        match(expand('a/{b,c}{,}/{d{,},e}{,}'), ['a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/e', 'a/b/e', 'a/b/e', 'a/b/e', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/e', 'a/c/e', 'a/c/e', 'a/c/e']);
        match(expand('a/{b,c{,}}'), ['a/b', 'a/c', 'a/c']);
        match(expand('a{,,}'), ['a', 'a', 'a']);
        match(expand('a{,}'), ['a', 'a']);
        match(expand('a{,}/{c,d}/e'), ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']);
        match(expand('a/{,}{c,d}/e'), ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']);
        match(expand('a/{c,d}{,}/e'), ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']);
        match(expand('a{,}{,}'), ['a', 'a', 'a', 'a']);
        match(expand('a{,}{,}{,}'), ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
        match(expand('a{,}{,}{,}{,}'), ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
        match(expand('{,}'), []);
        match(expand('{a,b{,}{,}{,},c}d'), ['ad', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'cd']);
        match(expand('{a,b{,}{,}{,}}'), ['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']);
        match(expand('{a{,,}b{,}}'), ['{ab}', '{ab}', '{ab}', '{ab}', '{ab}', '{ab}']);
      });
    });

    describe('set expansion', function() {
      it('should support sequence brace operators', function() {
        match(expand('{a,b,c}'), ['a', 'b', 'c']);
        match(expand('{1..10}'), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
      });

      it('should support sequence braces with leading characters', function() {
        match(expand('/usr/{ucb/{ex,edit},lib/{ex,how_ex}}'), ['/usr/lib/ex', '/usr/lib/how_ex', '/usr/ucb/edit', '/usr/ucb/ex']);
        match(expand('ff{c,b,a}'), ['ffa', 'ffb', 'ffc']);
      });

      it('should support sequence braces with trailing characters', function() {
        match(expand('f{d,e,f}g'), ['fdg', 'feg', 'ffg']);
        match(expand('{l,n,m}xyz'), ['lxyz', 'mxyz', 'nxyz']);
      });

      it('should support sequence braces with trailing characters', function() {
        match(expand('{braces,{0..10}}'), ['braces', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
        match(expand('{{0..10},braces}'), ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces']);
        match(expand('{{1..10..2},braces}'), ['1', '3', '5', '7', '9', 'braces']);
        match(expand('{{1..10},braces}'), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces']);
      });

      it('should support nested sequence braces with trailing characters', function() {
        match(expand('x{{0..10},braces}y'), ['xbracesy', 'x0y', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'x10y']);
      });

      it('should expand multiple sets', function() {
        match(expand('a/{a,b}/{c,d}/e'), ['a/a/c/e', 'a/a/d/e', 'a/b/c/e', 'a/b/d/e']);
        match(expand('a{b,c}d{e,f}g'), ['abdeg', 'abdfg', 'acdeg', 'acdfg']);
        match(expand('a/{x,y}/c{d,e}f.{md,txt}'), ['a/x/cdf.md', 'a/x/cdf.txt', 'a/x/cef.md', 'a/x/cef.txt', 'a/y/cdf.md', 'a/y/cdf.txt', 'a/y/cef.md', 'a/y/cef.txt']);
      });

      it('should expand nested sets', function() {
        match(expand('{{d,d},e}{}'), ['d{}', 'd{}', 'e{}']);
        match(expand('{{d,d},e}a'), ['da', 'da', 'ea']);
        match(expand('{{d,d},e}{a,b}'), ['da', 'da', 'db', 'db', 'ea', 'eb']);
        match(expand('{d,d,{d,d},{e,e}}'), ['d', 'd', 'd', 'd', 'e', 'e']);
        match(expand('{{d,d},e}{a,b}'), ['da', 'da', 'db', 'db', 'ea', 'eb']);
        match(expand('{{d,d},e}'), ['d', 'd', 'e']);
        match(expand('{a,b}{{a,b},a,b}'), ['aa', 'aa', 'ab', 'ab', 'ba', 'ba', 'bb', 'bb']);
        match(expand('a{b,c{d,e}f}g'), ['abg', 'acdfg', 'acefg']);
        match(expand('a{{x,y},z}b'), ['axb', 'ayb', 'azb']);
        match(expand('f{x,y{g,z}}h'), ['fxh', 'fygh', 'fyzh']);
        match(expand('a{b,c{d,e},h}x/z'), ['abx/z', 'acdx/z', 'acex/z', 'ahx/z']);
        match(expand('a{b,c{d,e},h}x{y,z}'), ['abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'ahxy', 'ahxz']);
        match(expand('a{b,c{d,e},{f,g}h}x{y,z}'), ['abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'afhxy', 'afhxz', 'aghxy', 'aghxz']);
        match(expand('a-{b{d,e}}-c'), ['a-{bd}-c', 'a-{be}-c']);
      });

      it('should expand with globs.', function() {
        match(expand('a/b/{d,e}/*.js'), ['a/b/d/*.js', 'a/b/e/*.js']);
        match(expand('a/**/c/{d,e}/f*.js'), ['a/**/c/d/f*.js', 'a/**/c/e/f*.js']);
        match(expand('a/**/c/{d,e}/f*.{md,txt}'), ['a/**/c/d/f*.md', 'a/**/c/d/f*.txt', 'a/**/c/e/f*.md', 'a/**/c/e/f*.txt']);
        match(expand('a/b/{d,e,[1-5]}/*.js'), ['a/b/d/*.js', 'a/b/e/*.js', 'a/b/[1-5]/*.js']);
      });
    });

    describe('commas', function() {
      it('should work with leading and trailing commas.', function() {
        match(expand('a{b,}c'), ['abc', 'ac']);
        match(expand('a{,b}c'), ['abc', 'ac']);
        match(expand('{{a,b},a}c'), ['ac', 'ac', 'bc']);
        match(expand('{{a,b},}c'), ['ac', 'bc', 'c']);
        match(expand('a{{a,b},}c'), ['aac', 'abc', 'ac']);
      });
    });

    describe('spaces', function() {
      it('should handle spaces', function() {
      match(expand('0{1..9} {10..20}'), ['01 10', '01 11', '01 12', '01 13', '01 14', '01 15', '01 16', '01 17', '01 18', '01 19', '01 20', '02 10', '02 11', '02 12', '02 13', '02 14', '02 15', '02 16', '02 17', '02 18', '02 19', '02 20', '03 10', '03 11', '03 12', '03 13', '03 14', '03 15', '03 16', '03 17', '03 18', '03 19', '03 20', '04 10', '04 11', '04 12', '04 13', '04 14', '04 15', '04 16', '04 17', '04 18', '04 19', '04 20', '05 10', '05 11', '05 12', '05 13', '05 14', '05 15', '05 16', '05 17', '05 18', '05 19', '05 20', '06 10', '06 11', '06 12', '06 13', '06 14', '06 15', '06 16', '06 17', '06 18', '06 19', '06 20', '07 10', '07 11', '07 12', '07 13', '07 14', '07 15', '07 16', '07 17', '07 18', '07 19', '07 20', '08 10', '08 11', '08 12', '08 13', '08 14', '08 15', '08 16', '08 17', '08 18', '08 19', '08 20', '09 10', '09 11', '09 12', '09 13', '09 14', '09 15', '09 16', '09 17', '09 18', '09 19', '09 20']);
        match(expand('a{ ,c{d, },h}x'), ['acdx', 'ac x', 'ahx', 'a x']);
        match(expand('a{ ,c{d, },h} '), ['a  ', 'ac  ', 'acd ', 'ah ']);

        // see https://github.com/jonschlinkert/micromatch/issues/66
        match(expand('/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.{html,ejs}'), ['/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.ejs', '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.html' ]);

        // Bash 4.3 says the following should be equivalent to `foo|(1|2)|bar`,
        // That makes sense in Bash, since ' ' is a separator, but not here.
        match(expand('foo {1,2} bar'), ['foo 1 bar', 'foo 2 bar']);
      });
    });
  });

  /**
   * Ranges
   */

  describe('ranges', function() {
    describe('escaping / invalid ranges', function() {
      it('should not try to expand ranges with decimals', function() {
        match(expand('{1.1..2.1}'), ['{1.1..2.1}']);
        match(expand('{1.1..~2.1}'), ['{1.1..~2.1}']);
      });

      it('should escape invalid ranges:', function() {
        match(expand('{1..0f}'), ['{1..0f}']);
        match(expand('{1..10..ff}'), ['{1..10..ff}']);
        match(expand('{1..10.f}'), ['{1..10.f}']);
        match(expand('{1..10f}'), ['{1..10f}']);
        match(expand('{1..20..2f}'), ['{1..20..2f}']);
        match(expand('{1..20..f2}'), ['{1..20..f2}']);
        match(expand('{1..2f..2}'), ['{1..2f..2}']);
        match(expand('{1..ff..2}'), ['{1..ff..2}']);
        match(expand('{1..ff}'), ['{1..ff}']);
        match(expand('{1.20..2}'), ['{1.20..2}']);
      });

      it('weirdly-formed brace expansions -- fixed in post-bash-3.1', function() {
        match(expand('a-{b{d,e}}-c'), ['a-{bd}-c', 'a-{be}-c']);
        match(expand('a-{bdef-{g,i}-c'), ['a-{bdef-g-c', 'a-{bdef-i-c']);
      });

      it('should not expand quoted strings.', function() {
        match(expand('{"klklkl"}{1,2,3}'), ['{klklkl}1', '{klklkl}2', '{klklkl}3']);
        match(expand('{"x,x"}'), ['{x,x}']);
      });

      it('should escaped outer braces in nested non-sets', function() {
        match(expand('{a-{b,c,d}}'), ['{a-b}', '{a-c}', '{a-d}']);
        match(expand('{a,{a-{b,c,d}}}'), ['a', '{a-b}', '{a-c}', '{a-d}']);
      });

      it('should escape imbalanced braces', function() {
        match(expand('a-{bdef-{g,i}-c'), ['a-{bdef-g-c', 'a-{bdef-i-c']);
        match(expand('abc{'), ['abc{']);
        match(expand('{abc{'), ['{abc{']);
        match(expand('{abc'), ['{abc']);
        match(expand('}abc'), ['}abc']);
        match(expand('ab{c'), ['ab{c']);
        match(expand('ab{c'), ['ab{c']);
        match(expand('{{a,b}'), ['{a', '{b']);
        match(expand('{a,b}}'), ['a}', 'b}']);
        match(expand('abcd{efgh'), ['abcd{efgh']);
        match(expand('a{b{c{d,e}f}g}h'), ['a{b{cdf}g}h', 'a{b{cef}g}h']);
        match(expand('f{x,y{{g,z}}h}'), ['fx', 'fy{g}h', 'fy{z}h']);
        match(expand('z{a,b},c}d'), ['za,c}d', 'zb,c}d']);
        match(expand('a{b{c{d,e}f{x,y{{g}h'), ['a{b{cdf{x,y{{g}h', 'a{b{cef{x,y{{g}h']);
        match(expand('f{x,y{{g}h'), ['f{x,y{{g}h']);
        match(expand('f{x,y{{g}}h'), ['f{x,y{{g}}h']);
        match(expand('a{b{c{d,e}f{x,y{}g}h'), ['a{b{cdfxh', 'a{b{cdfy{}gh', 'a{b{cefxh', 'a{b{cefy{}gh']);
        match(expand('f{x,y{}g}h'), ['fxh', 'fy{}gh']);
        match(expand('z{a,b{,c}d'), ['z{a,bd', 'z{a,bcd']);
      });
    });

    describe('positive numeric ranges', function() {
      it('should expand numeric ranges', function() {
        match(expand('a{0..3}d'), ['a0d', 'a1d', 'a2d', 'a3d']);
        match(expand('x{10..1}y'), ['x10y', 'x9y', 'x8y', 'x7y', 'x6y', 'x5y', 'x4y', 'x3y', 'x2y', 'x1y']);
        match(expand('x{3..3}y'), ['x3y']);
        match(expand('{1..10}'), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
        match(expand('{1..3}'), ['1', '2', '3']);
        match(expand('{1..9}'), ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
        match(expand('{10..1}'), ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']);
        match(expand('{10..1}y'), ['10y', '9y', '8y', '7y', '6y', '5y', '4y', '3y', '2y', '1y']);
        match(expand('{3..3}'), ['3']);
        match(expand('{5..8}'), ['5', '6', '7', '8']);
      });
    });

    describe('negative ranges', function() {
      it('should expand ranges with negative numbers', function() {
        match(expand('{-10..-1}'), ['-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1']);
        match(expand('{-20..0}'), ['-20', '-19', '-18', '-17', '-16', '-15', '-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0']);
        match(expand('{0..-5}'), ['0', '-1', '-2', '-3', '-4', '-5']);
        match(expand('{9..-4}'), ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4']);
      });
    });

    describe('alphabetical ranges', function() {
      it('should expand alphabetical ranges', function() {
        match(expand('{a..F}'), ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', ']', '^', '_', '`', 'a']);
        match(expand('0{a..d}0'), ['0a0', '0b0', '0c0', '0d0']);
        match(expand('a/{b..d}/e'), ['a/b/e', 'a/c/e', 'a/d/e']);
        match(expand('{1..f}'), ['1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f']);
        match(expand('{a..A}'), ['a', '`', '_', '^', ']', '\\', '[', 'Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']);
        match(expand('{A..a}'), ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a']);
        match(expand('{a..e}'), ['a', 'b', 'c', 'd', 'e']);
        match(expand('{A..E}'), ['A', 'B', 'C', 'D', 'E']);
        match(expand('{a..f}'), ['a', 'b', 'c', 'd', 'e', 'f']);
        match(expand('{a..z}'), ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
        match(expand('{E..A}'), ['E', 'D', 'C', 'B', 'A']);
        match(expand('{f..1}'), ['f', 'e', 'd', 'c', 'b', 'a', '`', '_', '^', ']', '\\', '[', 'Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', '@', '?', '>', '=', '<', ';', ':', '9', '8', '7', '6', '5', '4', '3', '2', '1']);
        match(expand('{f..a}'), ['f', 'e', 'd', 'c', 'b', 'a']);
        match(expand('{f..f}'), ['f']);
      });

      it('should expand multiple ranges:', function() {
        match(expand('a/{b..d}/e/{f..h}'), ['a/b/e/f', 'a/b/e/g', 'a/b/e/h', 'a/c/e/f', 'a/c/e/g', 'a/c/e/h', 'a/d/e/f', 'a/d/e/g', 'a/d/e/h']);
      });
    });

    describe('combo', function() {
      it('should expand numerical ranges - positive and negative', function() {
        match(expand('a{01..05}b'), ['a01b', 'a02b', 'a03b', 'a04b', 'a05b' ]);
        match(expand('0{1..9}/{10..20}'), ['01/10', '01/11', '01/12', '01/13', '01/14', '01/15', '01/16', '01/17', '01/18', '01/19', '01/20', '02/10', '02/11', '02/12', '02/13', '02/14', '02/15', '02/16', '02/17', '02/18', '02/19', '02/20', '03/10', '03/11', '03/12', '03/13', '03/14', '03/15', '03/16', '03/17', '03/18', '03/19', '03/20', '04/10', '04/11', '04/12', '04/13', '04/14', '04/15', '04/16', '04/17', '04/18', '04/19', '04/20', '05/10', '05/11', '05/12', '05/13', '05/14', '05/15', '05/16', '05/17', '05/18', '05/19', '05/20', '06/10', '06/11', '06/12', '06/13', '06/14', '06/15', '06/16', '06/17', '06/18', '06/19', '06/20', '07/10', '07/11', '07/12', '07/13', '07/14', '07/15', '07/16', '07/17', '07/18', '07/19', '07/20', '08/10', '08/11', '08/12', '08/13', '08/14', '08/15', '08/16', '08/17', '08/18', '08/19', '08/20', '09/10', '09/11', '09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18', '09/19', '09/20' ]);
        match(expand('{-10..10}'), ['-1', '-10', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '0', '1', '10', '2', '3', '4', '5', '6', '7', '8', '9' ]);
      });
    });

    // HEADS UP! If you're using the `--mm` flag minimatch freezes on these
    describe('large numbers', function() {
      it('should expand large numbers', function() {
        match(expand('{2147483645..2147483649}'), ['2147483645', '2147483646', '2147483647', '2147483648', '2147483649']);
        match(expand('{214748364..2147483649}'), ['(21474836[4-9]|2147483[7-9][0-9]|214748[4-9][0-9]{2}|214749[0-9]{3}|2147[5-9][0-9]{4}|214[8-9][0-9]{5}|21[5-9][0-9]{6}|2[2-9][0-9]{7}|[3-9][0-9]{8}|1[0-9]{9}|20[0-9]{8}|21[0-3][0-9]{7}|214[0-6][0-9]{6}|2147[0-3][0-9]{5}|21474[0-7][0-9]{4}|214748[0-2][0-9]{3}|2147483[0-5][0-9]{2}|21474836[0-4][0-9])']);
      });
    });

    describe('steps > positive ranges', function() {
      it('should expand ranges using steps:', function() {
        match(expand('{1..10..1}'), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
        match(expand('{1..10..2}'), ['1', '3', '5', '7', '9']);
        match(expand('{1..20..20}'), ['1']);
        match(expand('{1..20..2}'), ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
        match(expand('{10..0..2}'), ['10', '8', '6', '4', '2', '0']);
        match(expand('{10..1..2}'), ['10', '8', '6', '4', '2']);
        match(expand('{100..0..5}'), ['100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0']);
        match(expand('{2..10..1}'), ['2', '3', '4', '5', '6', '7', '8', '9', '10']);
        match(expand('{2..10..2}'), ['2', '4', '6', '8', '10']);
        match(expand('{2..10..3}'), ['2', '5', '8']);
        match(expand('{a..z..2}'), ['a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y']);
      });

      it('should expand positive ranges with negative steps:', function() {
        match(expand('{10..0..-2}'), ['10', '8', '6', '4', '2', '0']);
      });
    });

    describe('steps > negative ranges', function() {
      it('should expand negative ranges using steps:', function() {
        match(expand('{-1..-10..-2}'), ['-1', '-3', '-5', '-7', '-9']);
        match(expand('{-1..-10..2}'), ['-1', '-3', '-5', '-7', '-9']);
        match(expand('{-10..-2..2}'), ['-10', '-8', '-6', '-4', '-2']);
        match(expand('{-2..-10..1}'), ['-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
        match(expand('{-2..-10..2}'), ['-2', '-4', '-6', '-8', '-10']);
        match(expand('{-2..-10..3}'), ['-2', '-5', '-8']);
        match(expand('{-50..-0..5}'), ['-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0']);
        match(expand('{10..1..-2}'), ['2', '4', '6', '8', '10']);
        match(expand('{100..0..-5}'), ['100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0']);
      });
    });

    describe('steps > alphabetical ranges', function() {
      it('should expand alpha ranges with steps', function() {
        match(expand('{a..e..2}'), ['a', 'c', 'e']);
        match(expand('{E..A..2}'), ['E', 'C', 'A']);
        match(expand('{a..z}'), ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
        match(expand('{a..z..2}'), ['a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y']);
        match(expand('{z..a..-2}'), ['z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b']);
      });

      it('should expand alpha ranges with negative steps', function() {
        match(expand('{z..a..-2}'), ['z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b']);
      });
    });

    describe('padding', function() {
      it('unwanted zero-padding -- fixed post-bash-4.0', function() {
        match(expand('{10..0..2}'), ['10', '8', '6', '4', '2', '0']);
        match(expand('{10..0..-2}'), ['10', '8', '6', '4', '2', '0']);
        match(expand('{-50..-0..5}'), ['-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0']);
      });
    });
  });

  describe('integration', function() {
    it('should work with dots in file paths', function() {
      match(expand('../{1..3}/../foo'), ['../1/../foo', '../2/../foo', '../3/../foo']);
      match(expand('../{2..10..2}/../foo'), ['../2/../foo', '../4/../foo', '../6/../foo', '../8/../foo', '../10/../foo']);
      match(expand('../{1..3}/../{a,b,c}/foo'), ['../1/../a/foo', '../2/../a/foo', '../3/../a/foo', '../1/../b/foo', '../2/../b/foo', '../3/../b/foo', '../1/../c/foo', '../2/../c/foo', '../3/../c/foo']);
      match(expand('./{a..z..3}/'), ['./a/', './d/', './g/', './j/', './m/', './p/', './s/', './v/', './y/']);
      match(expand('./{"x,y"}/{a..z..3}/'), ['./{x,y}/a/', './{x,y}/d/', './{x,y}/g/', './{x,y}/j/', './{x,y}/m/', './{x,y}/p/', './{x,y}/s/', './{x,y}/v/', './{x,y}/y/']);
    });

    it('should expand a complex combination of ranges and sets:', function() {
      match(expand('a/{x,y}/{1..5}c{d,e}f.{md,txt}'), ['a/x/1cdf.md', 'a/y/1cdf.md', 'a/x/2cdf.md', 'a/y/2cdf.md', 'a/x/3cdf.md', 'a/y/3cdf.md', 'a/x/4cdf.md', 'a/y/4cdf.md', 'a/x/5cdf.md', 'a/y/5cdf.md', 'a/x/1cef.md', 'a/y/1cef.md', 'a/x/2cef.md', 'a/y/2cef.md', 'a/x/3cef.md', 'a/y/3cef.md', 'a/x/4cef.md', 'a/y/4cef.md', 'a/x/5cef.md', 'a/y/5cef.md', 'a/x/1cdf.txt', 'a/y/1cdf.txt', 'a/x/2cdf.txt', 'a/y/2cdf.txt', 'a/x/3cdf.txt', 'a/y/3cdf.txt', 'a/x/4cdf.txt', 'a/y/4cdf.txt', 'a/x/5cdf.txt', 'a/y/5cdf.txt', 'a/x/1cef.txt', 'a/y/1cef.txt', 'a/x/2cef.txt', 'a/y/2cef.txt', 'a/x/3cef.txt', 'a/y/3cef.txt', 'a/x/4cef.txt', 'a/y/4cef.txt', 'a/x/5cef.txt', 'a/y/5cef.txt']);
    });

    it('should expand complex sets and ranges in `bash` mode:', function() {
      match(expand('a/{x,{1..5},y}/c{d}e'), ['a/x/c{d}e', 'a/1/c{d}e', 'a/2/c{d}e', 'a/3/c{d}e', 'a/4/c{d}e', 'a/5/c{d}e', 'a/y/c{d}e']);
    });
  });
});
