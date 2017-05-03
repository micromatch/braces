'use strict';

var assert = require('assert');
var braces = require('..');

function equal(pattern, expected) {
  var actual = braces.expand(pattern);
  assert.deepEqual(actual.sort(), expected.sort());
}

describe('expanded sets', function() {
  describe('invalid sets', function() {
    it('should handle invalid sets:', function() {
      equal('{0..10,braces}', ['0..10', 'braces']);
      equal('{1..10,braces}', ['1..10', 'braces']);
    });
  });

  describe('extglobs', function() {
    it('should split on commas when braces are inside extglobs', function() {
      equal('*(a|{b|c,d})', ['*(a|b|c)', '*(a|d)']);
    });

    it('should not split on commas in extglobs when inside braces', function() {
      equal('{a,@(b,c)}', ['a', '@(b,c)']);
      equal('{a,*(b|c,d)}', ['a', '*(b|c,d)']);
    });
  });

  describe('escaping', function() {
    it('should not expand escaped braces', function() {
      equal('y{\\},a}x', ['y}x', 'yax']);
      equal('{a,\\\\{a,b}c}', ['a', '\\\\ac', '\\\\bc']);
      equal('\\{a,b,c,d,e}', ['{a,b,c,d,e}']);
      equal('a/b/c/{x,y\\}', ['a/b/c/{x,y}']);
      equal('a/\\{x,y}/cde', ['a/{x,y}/cde']);
      equal('abcd{efgh', ['abcd{efgh']);
      equal('{abc}', ['{abc}']);
      equal('{x,y,\\{a,b,c\\}}', ['x', 'y', '{a', 'b', 'c}']);
      equal('{x,y,{a,b,c\\}}', ['{x,y,a', '{x,y,b', '{x,y,c}']);
      equal('{x,y,{abc},trie}', ['x', 'y', '{abc}', 'trie']);
      equal('{x\\,y,\\{abc\\},trie}', ['x,y', '{abc}', 'trie']);
    });

    it('should handle empty braces', function() {
      equal('{ }', ['{ }']);
      equal('{', ['{']);
      equal('{}', ['{}']);
      equal('}', ['}']);
    });

    it('should handle empty sets', function() {
      equal('{ }', ['{ }']);
      equal('{', ['{']);
      equal('{}', ['{}']);
      equal('}', ['}']);
    });

    it('should escape braces when only one value is defined', function() {
      equal('a{b}c', ['a{b}c']);
      equal('a/b/c{d}e', ['a/b/c{d}e']);
    });

    it('should escape closing braces when open is not defined', function() {
      equal('{a,b}c,d}', ['ac,d}', 'bc,d}']);
    });

    it('should not expand braces in sets with es6/bash-like variables', function() {
      equal('abc/${ddd}/xyz', ['abc/${ddd}/xyz']);
      equal('a${b}c', ['a${b}c']);
      equal('a/{${b},c}/d', ['a/${b}/d', 'a/c/d']);
      equal('a${b,d}/{foo,bar}c', ['a${b,d}/fooc', 'a${b,d}/barc']);
    });

    it('should not expand escaped commas.', function() {
      equal('a{b\\,c\\,d}e', ['a{b,c,d}e']);
      equal('a{b\\,c}d', ['a{b,c}d']);
      equal('{abc\\,def}', ['{abc,def}']);
      equal('{abc\\,def,ghi}', ['abc,def', 'ghi']);
      equal('a/{b,c}/{x\\,y}/d/e', ['a/b/{x,y}/d/e', 'a/c/{x,y}/d/e']);
    });

    it('should return sets with escaped commas', function() {
    });

    it('should not expand escaped braces.', function() {
      equal('{a,b\\}c,d}', ['a', 'b}c', 'd']);
      equal('\\{a,b,c,d,e}', ['{a,b,c,d,e}']);
      equal('a/{z,\\{a,b,c,d,e}/d', ['a/{a/d', 'a/b/d', 'a/c/d', 'a/d/d', 'a/e/d', 'a/z/d']);
      equal('a/\\{b,c}/{d,e}/f', ['a/{b,c}/d/f', 'a/{b,c}/e/f']);
      equal('./\\{x,y}/{a..z..3}/', ['./{x,y}/a/', './{x,y}/d/', './{x,y}/g/', './{x,y}/j/', './{x,y}/m/', './{x,y}/p/', './{x,y}/s/', './{x,y}/v/', './{x,y}/y/']);
    });

    it('should not expand escaped braces or commas.', function() {
      equal('{x\\,y,\\{abc\\},trie}', ['{abc}', 'trie', 'x,y']);
    });
  });

  describe('multipliers', function() {
    it('should support multipliers', function() {
      equal('{{d,d},e}{,}', ['d', 'd', 'd', 'd', 'e', 'e']);
      equal('{d{,},e}{,}', ['d', 'd', 'd', 'd', 'e', 'e']);
      equal('a/{,}{c,d}/e', ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']);
      equal('a/{c,d}{,}/e', ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']);
      equal('a/{b,c{,}}', ['a/b', 'a/c', 'a/c']);
      equal('a{,,}', ['a', 'a', 'a']);
      equal('a{,}', ['a', 'a']);
      equal('a{,}/{c,d}/e', ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']);
      equal('a{,}{,}', ['a', 'a', 'a', 'a']);
      equal('a{,}{,}{,}', ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
      equal('a{,}{,}{,}{,}', ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
      equal('{,}', []);
      equal('{a,b{,}{,}{,},c}d', ['ad', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'cd']);
      equal('{a,b{,}{,}{,}}', ['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']);
      equal('{a{,,}b{,}}', ['{ab}', '{ab}', '{ab}', '{ab}', '{ab}', '{ab}']);
      equal('{d{,},e}{,}', ['d', 'd', 'd', 'd', 'e', 'e']);
      equal('a/{b,c}{,}/{d{,},e}{,}', ['a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/e', 'a/b/e', 'a/b/e', 'a/b/e', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/e', 'a/c/e', 'a/c/e', 'a/c/e']);
      equal('a/{b,c{,}}', ['a/b', 'a/c', 'a/c']);
      equal('a{,,}', ['a', 'a', 'a']);
      equal('a{,}', ['a', 'a']);
      equal('a{,}/{c,d}/e', ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']);
      equal('a/{,}{c,d}/e', ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']);
      equal('a/{c,d}{,}/e', ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']);
      equal('a{,}{,}', ['a', 'a', 'a', 'a']);
      equal('a{,}{,}{,}', ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
      equal('a{,}{,}{,}{,}', ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
      equal('{,}', []);
      equal('{a,b{,}{,}{,},c}d', ['ad', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'cd']);
      equal('{a,b{,}{,}{,}}', ['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']);
      equal('{a{,,}b{,}}', ['{ab}', '{ab}', '{ab}', '{ab}', '{ab}', '{ab}']);
    });
  });

  describe('set expansion', function() {
    it('should support sequence brace operators', function() {
      equal('{a,b,c}', ['a', 'b', 'c']);
      equal('{1..10}', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    });

    it('should support sequence braces with leading characters', function() {
      equal('/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', ['/usr/lib/ex', '/usr/lib/how_ex', '/usr/ucb/edit', '/usr/ucb/ex']);
      equal('ff{c,b,a}', ['ffa', 'ffb', 'ffc']);
    });

    it('should support sequence braces with trailing characters', function() {
      equal('f{d,e,f}g', ['fdg', 'feg', 'ffg']);
      equal('{l,n,m}xyz', ['lxyz', 'mxyz', 'nxyz']);
    });

    it('should support sequence braces with trailing characters', function() {
      equal('{braces,{0..10}}', ['braces', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
      equal('{{0..10},braces}', ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces']);
      equal('{{1..10..2},braces}', ['1', '3', '5', '7', '9', 'braces']);
      equal('{{1..10},braces}', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces']);
    });

    it('should support nested sequence braces with trailing characters', function() {
      equal('x{{0..10},braces}y', ['xbracesy', 'x0y', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'x10y']);
    });

    it('should expand multiple sets', function() {
      equal('a/{a,b}/{c,d}/e', ['a/a/c/e', 'a/a/d/e', 'a/b/c/e', 'a/b/d/e']);
      equal('a{b,c}d{e,f}g', ['abdeg', 'abdfg', 'acdeg', 'acdfg']);
      equal('a/{x,y}/c{d,e}f.{md,txt}', ['a/x/cdf.md', 'a/x/cdf.txt', 'a/x/cef.md', 'a/x/cef.txt', 'a/y/cdf.md', 'a/y/cdf.txt', 'a/y/cef.md', 'a/y/cef.txt']);
    });

    it('should expand nested sets', function() {
      equal('{{d,d},e}{}', ['d{}', 'd{}', 'e{}']);
      equal('{{d,d},e}a', ['da', 'da', 'ea']);
      equal('{{d,d},e}{a,b}', ['da', 'da', 'db', 'db', 'ea', 'eb']);
      equal('{d,d,{d,d},{e,e}}', ['d', 'd', 'd', 'd', 'e', 'e']);
      equal('{{d,d},e}{a,b}', ['da', 'da', 'db', 'db', 'ea', 'eb']);
      equal('{{d,d},e}', ['d', 'd', 'e']);
      equal('{a,b}{{a,b},a,b}', ['aa', 'aa', 'ab', 'ab', 'ba', 'ba', 'bb', 'bb']);
      equal('a{b,c{d,e}f}g', ['abg', 'acdfg', 'acefg']);
      equal('a{{x,y},z}b', ['axb', 'ayb', 'azb']);
      equal('f{x,y{g,z}}h', ['fxh', 'fygh', 'fyzh']);
      equal('a{b,c{d,e},h}x/z', ['abx/z', 'acdx/z', 'acex/z', 'ahx/z']);
      equal('a{b,c{d,e},h}x{y,z}', ['abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'ahxy', 'ahxz']);
      equal('a{b,c{d,e},{f,g}h}x{y,z}', ['abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'afhxy', 'afhxz', 'aghxy', 'aghxz']);
      equal('a-{b{d,e}}-c', ['a-{bd}-c', 'a-{be}-c']);
    });

    it('should expand with globs.', function() {
      equal('a/b/{d,e}/*.js', ['a/b/d/*.js', 'a/b/e/*.js']);
      equal('a/**/c/{d,e}/f*.js', ['a/**/c/d/f*.js', 'a/**/c/e/f*.js']);
      equal('a/**/c/{d,e}/f*.{md,txt}', ['a/**/c/d/f*.md', 'a/**/c/d/f*.txt', 'a/**/c/e/f*.md', 'a/**/c/e/f*.txt']);
      equal('a/b/{d,e,[1-5]}/*.js', ['a/b/d/*.js', 'a/b/e/*.js', 'a/b/[1-5]/*.js']);
    });
  });

  describe('commas', function() {
    it('should work with leading and trailing commas.', function() {
      equal('a{b,}c', ['abc', 'ac']);
      equal('a{,b}c', ['abc', 'ac']);
      equal('{{a,b},a}c', ['ac', 'ac', 'bc']);
      equal('{{a,b},}c', ['ac', 'bc', 'c']);
      equal('a{{a,b},}c', ['aac', 'abc', 'ac']);
    });
  });

  describe('spaces', function() {
    it('should handle spaces', function() {
      equal('0{1..9} {10..20}', ['01 10', '01 11', '01 12', '01 13', '01 14', '01 15', '01 16', '01 17', '01 18', '01 19', '01 20', '02 10', '02 11', '02 12', '02 13', '02 14', '02 15', '02 16', '02 17', '02 18', '02 19', '02 20', '03 10', '03 11', '03 12', '03 13', '03 14', '03 15', '03 16', '03 17', '03 18', '03 19', '03 20', '04 10', '04 11', '04 12', '04 13', '04 14', '04 15', '04 16', '04 17', '04 18', '04 19', '04 20', '05 10', '05 11', '05 12', '05 13', '05 14', '05 15', '05 16', '05 17', '05 18', '05 19', '05 20', '06 10', '06 11', '06 12', '06 13', '06 14', '06 15', '06 16', '06 17', '06 18', '06 19', '06 20', '07 10', '07 11', '07 12', '07 13', '07 14', '07 15', '07 16', '07 17', '07 18', '07 19', '07 20', '08 10', '08 11', '08 12', '08 13', '08 14', '08 15', '08 16', '08 17', '08 18', '08 19', '08 20', '09 10', '09 11', '09 12', '09 13', '09 14', '09 15', '09 16', '09 17', '09 18', '09 19', '09 20']);
      equal('a{ ,c{d, },h}x', ['acdx', 'ac x', 'ahx', 'a x']);
      equal('a{ ,c{d, },h} ', ['a  ', 'ac  ', 'acd ', 'ah ']);

      // see https://github.com/jonschlinkert/micromatch/issues/66
      equal('/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.{html,ejs}', ['/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.ejs', '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.html' ]);

      // Bash 4.3 says the following should be equivalent to `foo|(1|2)|bar`,
      // That makes sense in Bash, since ' ' is a separator, but not here.
      equal('foo {1,2} bar', ['foo 1 bar', 'foo 2 bar']);
    });
  });
});
