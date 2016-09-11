'use strict';

require('mocha');
var assert = require('assert');
var argv = require('yargs-parser')(process.argv.slice(2));
var minimatch = require('minimatch');
var braces = argv.mm ? minimatch.braceExpand : require('..');

describe('braces', function() {
  describe('brace expansion', function() {
    it('should return an empty array when no braces are found', function() {
      assert.deepEqual(braces(''), []);
    });

    it('should expand bash exponential notation', function() {
      assert.deepEqual(braces('a{,}'), ['a']);
      assert.deepEqual(braces('{,}b'), ['b']);
      assert.deepEqual(braces('a{,}b'), ['ab']);
    });

    // http://www.gnu.org/software/bash/manual/html_node/Brace-Expansion.html
    it('should expand bash exponential notation', function() {
      assert.deepEqual(braces('a{,}', {nodupes: false}), ['a', 'a']);
      assert.deepEqual(braces('a{,}{,}', {nodupes: false}), ['a', 'a', 'a', 'a']);
      assert.deepEqual(braces('a{,}{,}{,}', {nodupes: false}), ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
      assert.deepEqual(braces('{a,b{,}{,}{,}}', {nodupes: false}), ['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']);
      assert.deepEqual(braces('a{,}/{c,d}/e', {nodupes: false}), ['a/c/e','a/c/e','a/d/e','a/d/e']);
      assert.deepEqual(braces('{a,b{,}{,}{,},c}d', {nodupes: false}), ['ad', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'cd']);
    });

    it('should eliminate dupes in repeated strings when `nodupes` is true', function() {
      assert.deepEqual(braces('a{,}', {nodupes: true}), ['a']);
      assert.deepEqual(braces('a{,}{,}', {nodupes: true}), ['a']);
      assert.deepEqual(braces('a{,}{,}{,}', {nodupes: true}), ['a']);
      assert.deepEqual(braces('{a,b{,}{,}{,}}', {nodupes: true}), ['a', 'b']);
      assert.deepEqual(braces('{a,b{,}{,}{,},c}d', {nodupes: true}), ['ad', 'bd', 'cd']);
      assert.deepEqual(braces('{a,b{,}{,}{,},c}d', {nodupes: true}), ['ad', 'bd', 'cd']);
    });

    it('should work with no braces', function() {
      assert.deepEqual(braces('abc'), ['abc']);
    });

    it('should work with no commas', function() {
      assert.deepEqual(braces('a{b}c'), ['abc']);
    });

    it('should work with no commas in `bash` mode', function() {
      assert.deepEqual(braces('a{b}c', {bash: true}), ['a{b}c']);
    });

    it('should handle spaces', function() {
      assert.deepEqual(braces('0{1..9} {10..20}'), ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']);
      assert.deepEqual(braces('a{ ,c{d, },h}x'), ['a{',',c{d,','},h}x']);
      assert.deepEqual(braces('a{ ,c{d, },h} '), ['a{', ',c{d,', '},h}']);

      // see https://github.com/jonschlinkert/micromatch/issues/66
      assert.deepEqual(braces('/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.{html,ejs}'), [
        '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.html',
        '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.ejs'
      ]);
    });

    it('should handle empty braces', function() {
      assert.deepEqual(braces('{ }'), ['{', '}']);
      assert.deepEqual(braces('{}'), ['{}']);
      assert.deepEqual(braces('}'), ['}']);
      assert.deepEqual(braces('{'), ['{']);
      assert.deepEqual(braces('{,}'), []);
    });

    it('should handle imbalanced braces', function() {
      assert.deepEqual(braces('a-{bdef-{g,i}-c'), ['a-{bdef-g-c', 'a-{bdef-i-c']);
      assert.deepEqual(braces('abc{'), ['abc{']);
      assert.deepEqual(braces('{abc{'), ['{abc{']);
      assert.deepEqual(braces('{abc'), ['{abc']);
      assert.deepEqual(braces('}abc'), ['}abc']);
      assert.deepEqual(braces('ab{c'), ['ab{c']);
      assert.deepEqual(braces('ab{c'), ['ab{c']);
      assert.deepEqual(braces('{{a,b}'), ['{a','{b']);
      assert.deepEqual(braces('{a,b}}'), ['a}','b}']);
      assert.deepEqual(braces('abcd{efgh'), ['abcd{efgh']);
      assert.deepEqual(braces('a{b{c{d,e}f}g}h'), ['abcdfgh','abcefgh']);
      assert.deepEqual(braces('f{x,y{{g,z}}h}'), ['fx','fygh','fyzh']);
      assert.deepEqual(braces('z{a,b},c}d'), ['za,c}d','zb,c}d']);
      assert.deepEqual(braces('a{b{c{d,e}f{x,y{{g}h'), ['a{b{cdf{x,y{gh','a{b{cef{x,y{gh']);
      assert.deepEqual(braces('f{x,y{{g}h'), ['f{x,y{gh']);
      assert.deepEqual(braces('f{x,y{{g}}h'), ['f{x,ygh']);
      assert.deepEqual(braces('a{b{c{d,e}f{x,y{}g}h'), ['a{b{cdfxh','a{b{cefxh','a{b{cdfy{}gh','a{b{cefy{}gh']);
      assert.deepEqual(braces('f{x,y{}g}h'), ['fxh','fy{}gh']);
      assert.deepEqual(braces('z{a,b{,c}d'), ['z{a,bd', 'z{a,bcd']);
    });

    it('should handle invalid braces in `bash mode`:', function() {
      assert.deepEqual(braces('a{b{c{d,e}f}g}h', {bash: true}), ['a{b{cdf}g}h','a{b{cef}g}h']);
      assert.deepEqual(braces('f{x,y{{g,z}}h}', {bash: true}), ['fx','fy{g}h','fy{z}h']);
      assert.deepEqual(braces('z{a,b},c}d', {bash: true}), ['za,c}d','zb,c}d']);
      assert.deepEqual(braces('a{b{c{d,e}f{x,y{{g}h', {bash: true}), ['a{b{cdf{x,y{{g}h','a{b{cef{x,y{{g}h']);
      assert.deepEqual(braces('f{x,y{{g}h', {bash: true}), ['f{x,y{{g}h']);
      assert.deepEqual(braces('f{x,y{{g}}h', {bash: true}), ['f{x,y{{g}}h']);
    });

    it('should return invalid braces:', function() {
      assert.deepEqual(braces('{0..10,braces}'), ['0..10', 'braces']);
    });

    it('should not expand quoted strings.', function() {
      assert.deepEqual(braces('{"x,x"}'), ['{x,x}']);
      assert.deepEqual(braces('{"klklkl"}{1,2,3}'), ['{klklkl}1', '{klklkl}2', '{klklkl}3']);
    });

    it('should work with one value', function() {
      assert.deepEqual(braces('a{b}c'), ['abc']);
      assert.deepEqual(braces('a/b/c{d}e'), ['a/b/cde']);
    });

    it('should work with one value in `bash` mode', function() {
      assert.deepEqual(braces('a{b}c', {bash: true}), ['a{b}c']);
      assert.deepEqual(braces('a/b/c{d}e', {bash: true}), ['a/b/c{d}e']);
    });

    it('should work with nested non-sets', function() {
      assert.deepEqual(braces('foo {1,2} bar'), ['foo', '1', '2', 'bar']);
      assert.deepEqual(braces('{a-{b,c,d}}'), ['a-b', 'a-c', 'a-d']);
      assert.deepEqual(braces('{a,{a-{b,c,d}}}'), ['a','a-b','a-c','a-d']);
    });

    it('should work with nested non-sets in `bash` mode', function() {
      assert.deepEqual(braces('{a-{b,c,d}}', {bash: true}), ['{a-b}', '{a-c}', '{a-d}']);
      assert.deepEqual(braces('{a,{a-{b,c,d}}}', {bash: true}), ['a','{a-b}','{a-c}','{a-d}']);
    });

    it('should not expand dots with leading slashes (escaped or paths).', function() {
      assert.deepEqual(braces('a{b,c/*/../d}e'), ['abe', 'ac/*/../de']);
      assert.deepEqual(braces('a{b,b,c/../b}d'), ['abd', 'ac/../bd']);
    });

    it('should work with commas.', function() {
      assert.deepEqual(braces('a{b,}c'), ['abc', 'ac']);
      assert.deepEqual(braces('a{,b}c'), ['ac', 'abc']);
    });

    it('should expand sets', function() {
      assert.deepEqual(braces('a/{x,y}/cde'), ['a/x/cde', 'a/y/cde']);
      assert.deepEqual(braces('a/b/c/{x,y}'), ['a/b/c/x', 'a/b/c/y']);
      assert.deepEqual(braces('ff{c,b,a}'), ['ffc', 'ffb', 'ffa']);
      assert.deepEqual(braces('f{d,e,f}g'), ['fdg', 'feg', 'ffg']);
      assert.deepEqual(braces('{l,n,m}xyz'), ['lxyz', 'nxyz', 'mxyz']);
      assert.deepEqual(braces('{x,y,{abc},trie}'), ['x', 'y', 'abc', 'trie']);
    });

    it('should use `bash` mode to expand sets', function() {
      assert.deepEqual(braces('{x,y,{abc},trie}', {bash: true}), ['x', 'y', '{abc}', 'trie']);
    });

    it('should expand multiple sets', function() {
      assert.deepEqual(braces('a/{a,b}/{c,d}/e'), ['a/a/c/e', 'a/b/c/e', 'a/a/d/e', 'a/b/d/e']);
      assert.deepEqual(braces('a{b,c}d{e,f}g'), ['abdeg', 'acdeg', 'abdfg', 'acdfg']);
      assert.deepEqual(braces('a/{x,y}/c{d,e}f.{md,txt}'), ['a/x/cdf.md', 'a/y/cdf.md', 'a/x/cef.md', 'a/y/cef.md', 'a/x/cdf.txt', 'a/y/cdf.txt', 'a/x/cef.txt', 'a/y/cef.txt']);
    });

    it('should expand nested sets', function() {
      assert.deepEqual(braces('{a,b}{{a,b},a,b}'), ['aa', 'ab', 'ba', 'bb']); // Bash does not remove duplicates
      assert.deepEqual(braces('/usr/{ucb/{ex,edit},lib/{ex,how_ex}}'), ['/usr/ucb/ex', '/usr/lib/ex', '/usr/ucb/edit', '/usr/lib/how_ex']);
      assert.deepEqual(braces('a{b,c{d,e}f}g'), ['abg', 'acdfg', 'acefg']);
      assert.deepEqual(braces('a{{x,y},z}b'), ['axb','azb','ayb']);
      assert.deepEqual(braces('f{x,y{g,z}}h'), ['fxh','fygh','fyzh']);
      assert.deepEqual(braces('a{b,c{d,e},h}x/z'), ['abx/z', 'acdx/z', 'ahx/z', 'acex/z']);
      assert.deepEqual(braces('a{b,c{d,e},h}x{y,z}'), ['abxy', 'acdxy', 'ahxy', 'acexy', 'abxz', 'acdxz', 'ahxz', 'acexz']);
      assert.deepEqual(braces('a{b,c{d,e},{f,g}h}x{y,z}'), ['abxy', 'acdxy', 'afhxy', 'acexy', 'aghxy', 'abxz', 'acdxz', 'afhxz', 'acexz', 'aghxz']);
      assert.deepEqual(braces('a-{b{d,e}}-c'), ['a-bd-c', 'a-be-c']);
    });

    it('should use `bash` mode to expand nested sets.', function() {
      assert.deepEqual(braces('a-{b{d,e}}-c', {bash: true}), ['a-{bd}-c', 'a-{be}-c']);
    });

    it('should expand with globs.', function() {
      assert.deepEqual(braces('a/b/{d,e}/*.js'), ['a/b/d/*.js', 'a/b/e/*.js']);
      assert.deepEqual(braces('a/**/c/{d,e}/f*.js'), ['a/**/c/d/f*.js', 'a/**/c/e/f*.js']);
      assert.deepEqual(braces('a/**/c/{d,e}/f*.{md,txt}'), ['a/**/c/d/f*.md', 'a/**/c/e/f*.md', 'a/**/c/d/f*.txt', 'a/**/c/e/f*.txt']);
    });

    it('should expand with extglobs.', function() {
      assert.deepEqual(braces('a/b/{d,e,[1-5]}/*.js'), ['a/b/d/*.js', 'a/b/e/*.js', 'a/b/[1-5]/*.js']);
    });
  });

  describe('escaping:', function() {
    it('should not expand strings with es6/bash-like variables.', function() {
      assert.deepEqual(braces('abc/${ddd}/xyz'), ['abc/${ddd}/xyz']);
      assert.deepEqual(braces('a${b}c'), ['a${b}c']);
      assert.deepEqual(braces('a/{${b},c}/d'), ['a/${b}/d', 'a/c/d']);
      assert.deepEqual(braces('a${b,d}/{foo,bar}c'), ['a${b,d}/fooc', 'a${b,d}/barc']);
    });

    it('should not expand escaped commas.', function() {
      assert.deepEqual(braces('a{b\\,c}d'), ['a{b,c}d']);
      assert.deepEqual(braces('a{b\\,c\\,d}e'), ['a{b,c,d}e']);
      assert.deepEqual(braces('{abc\\,def}'), ['{abc,def}']);
      assert.deepEqual(braces('{abc\\,def,ghi}'), ['abc,def', 'ghi']);
      assert.deepEqual(braces('a/{b,c}/{x\\,y}/d/e'), ['a/b/x,y/d/e', 'a/c/x,y/d/e']);
    });

    it('should return sets with escaped commas in `bash` mode.', function() {
      assert.deepEqual(braces('a/{b,c}/{x\\,y}/d/e', {bash: true}), ['a/b/{x,y}/d/e', 'a/c/{x,y}/d/e']);
    });

    it('should not expand escaped braces.', function() {
      assert.deepEqual(braces('{a,b\\}c,d}'), ['{a,b}c,d}']); // Bash expects ['a','b}c','d']
      assert.deepEqual(braces('\\{a,b,c,d,e}'), ['{a,b,c,d,e}']);
      assert.deepEqual(braces('a/{b,\\{a,b,c,d,e}/d'), ['a/b/d','a/{a/d','a/c/d','a/d/d','a/e/d']);
      assert.deepEqual(braces('a/{b,\\{a,b,c,d,e}/d', {nodupes: false}), ['a/b/d','a/{a/d','a/b/d','a/c/d','a/d/d','a/e/d']);
      assert.deepEqual(braces('a/\\{b,c}/{d,e}/f'), ['a/{b,c}/d/f', 'a/{b,c}/e/f']);
      assert.deepEqual(braces('./\\{x,y}/{a..z..3}/', {makeRe: true}), ['./{x,y}/(a|d|g|j|m|p|s|v|y)/']);
    });

    it('should not expand escaped braces or commas.', function() {
      assert.deepEqual(braces('{x\\,y,\\{abc\\},trie}'), ['x,y','{abc}','trie']);
    });
  });

  describe('options', function() {
    it('should remove empty values and `\\` when `options.strict` is true.', function() {
      assert.deepEqual(braces('{a..A}', {strict: true}), ['a', '`', '_', '^', ']', '[', 'Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']);
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
      assert.deepEqual(braces('a/{x,y}/{1..5}c{d,e}f.{md,txt}'), ['a/x/1cdf.md', 'a/y/1cdf.md', 'a/x/2cdf.md', 'a/y/2cdf.md', 'a/x/3cdf.md', 'a/y/3cdf.md', 'a/x/4cdf.md', 'a/y/4cdf.md', 'a/x/5cdf.md', 'a/y/5cdf.md', 'a/x/1cef.md', 'a/y/1cef.md', 'a/x/2cef.md', 'a/y/2cef.md', 'a/x/3cef.md', 'a/y/3cef.md', 'a/x/4cef.md', 'a/y/4cef.md', 'a/x/5cef.md', 'a/y/5cef.md', 'a/x/1cdf.txt', 'a/y/1cdf.txt', 'a/x/2cdf.txt', 'a/y/2cdf.txt', 'a/x/3cdf.txt', 'a/y/3cdf.txt', 'a/x/4cdf.txt', 'a/y/4cdf.txt', 'a/x/5cdf.txt', 'a/y/5cdf.txt', 'a/x/1cef.txt', 'a/y/1cef.txt', 'a/x/2cef.txt', 'a/y/2cef.txt', 'a/x/3cef.txt', 'a/y/3cef.txt', 'a/x/4cef.txt', 'a/y/4cef.txt', 'a/x/5cef.txt', 'a/y/5cef.txt']);
    });

    it('should expand complex sets and ranges in `bash` mode:', function() {
      assert.deepEqual(braces('a/{x,{1..5},y}/c{d}e', {bash: true}), ['a/x/c{d}e', 'a/1/c{d}e', 'a/y/c{d}e', 'a/2/c{d}e', 'a/3/c{d}e', 'a/4/c{d}e', 'a/5/c{d}e']);
    });
  });
});

describe('range expansion', function() {
  it('should expand numerical ranges', function() {
    assert.deepEqual(braces('a{0..3}d'), ['a0d', 'a1d', 'a2d', 'a3d']);
    assert.deepEqual(braces('x{10..1}y'), ['x10y', 'x9y', 'x8y', 'x7y', 'x6y', 'x5y', 'x4y', 'x3y', 'x2y', 'x1y']);
    assert.deepEqual(braces('x{3..3}y'), ['x3y']);
    assert.deepEqual(braces('{-1..-10}'), ['-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
    assert.deepEqual(braces('{-20..0}'), ['-20', '-19', '-18', '-17', '-16', '-15', '-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0']);
    assert.deepEqual(braces('{1..10}'), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    assert.deepEqual(braces('{1..3}'), ['1', '2', '3']);
    assert.deepEqual(braces('{1..9}'), ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    assert.deepEqual(braces('{3..3}'), ['3']);
    assert.deepEqual(braces('{5..8}'), ['5', '6', '7', '8']);
  });

  it('should expand alphabetical ranges', function() {
    assert.deepEqual(braces('0{a..d}0'), ['0a0', '0b0', '0c0', '0d0']);
    assert.notDeepEqual(braces('0{a..d}0'), ['0a0', '0b0', '0c0']);
    assert.deepEqual(braces('a/{b..d}/e'), ['a/b/e', 'a/c/e', 'a/d/e']);
    assert.deepEqual(braces('{a..A}'), ['a', '`', '_', '^', ']', '\\', '[', 'Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']);
    assert.deepEqual(braces('{A..a}'), ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a']);
    assert.deepEqual(braces('{a..e}'), ['a', 'b', 'c', 'd', 'e']);
    assert.deepEqual(braces('{A..E}'), ['A', 'B', 'C', 'D', 'E']);
    assert.deepEqual(braces('{a..f}'), ['a', 'b', 'c', 'd', 'e', 'f']);
    assert.deepEqual(braces('{a..z}'), ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
    assert.deepEqual(braces('{E..A}'), ['E', 'D', 'C', 'B', 'A']);
    assert.deepEqual(braces('{f..a}'), ['f', 'e', 'd', 'c', 'b', 'a']);
    assert.deepEqual(braces('{f..f}'), ['f']);
  });

  it('should use steps with alphabetical ranges', function() {
    assert.deepEqual(braces('{a..e..2}'), ['a','c', 'e']);
    assert.deepEqual(braces('{E..A..2}'), ['E', 'C', 'A']);
  });

  it('should not try to expand ranges with decimals', function() {
    assert.deepEqual(braces('{1.1..2.1}'), ['{1.1..2.1}']);
    assert.deepEqual(braces('{1.1..2.1}', {makeRe: true}), ['{1.1..2.1}']);
    assert.deepEqual(braces('{1.1..~2.1}', {makeRe: true}), ['{1.1..~2.1}']);
  });

  it('should expand negative ranges', function() {
    assert.deepEqual(braces('{z..a..-2}'), ['z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b']);
    assert.deepEqual(braces('{-10..-1}'), ['-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1']);
    assert.deepEqual(braces('{0..-5}'), ['0', '-1', '-2', '-3', '-4', '-5']);
    assert.deepEqual(braces('{9..-4}'), ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4']);
  });

  it('should expand multiple ranges:', function() {
    assert.deepEqual(braces('a/{b..d}/e/{f..h}'), ['a/b/e/f', 'a/c/e/f', 'a/d/e/f', 'a/b/e/g', 'a/c/e/g', 'a/d/e/g', 'a/b/e/h', 'a/c/e/h', 'a/d/e/h']);
  });

  it('should work with dots in file paths', function() {
    assert.deepEqual(braces('../{1..3}/../foo'), ['../1/../foo', '../2/../foo', '../3/../foo']);
  });

  it('should make a regex-string when `options.makeRe` is defined:', function() {
    assert.deepEqual(braces('../{1..3}/../foo', {makeRe: true}), ['../[1-3]/../foo']);
    assert.deepEqual(braces('../{2..10..2}/../foo', {makeRe: true}), ['../(2|4|6|8|10)/../foo']);
    assert.deepEqual(braces('../{1..3}/../{a,b,c}/foo', {makeRe: true}), ['../[1-3]/../(a|b|c)/foo']);
    assert.deepEqual(braces('./{a..z..3}/', {makeRe: true}), ['./(a|d|g|j|m|p|s|v|y)/']);
    assert.deepEqual(braces('./{"x,y"}/{a..z..3}/', {makeRe: true}), ['./{x,y}/(a|d|g|j|m|p|s|v|y)/']);
  });

  it('should expand ranges using steps:', function() {
    assert.deepEqual(braces('{-1..-10..-2}'), ['-1', '-3', '-5', '-7', '-9']);
    assert.deepEqual(braces('{-1..-10..2}'), ['-1', '-3', '-5', '-7', '-9']);
    assert.deepEqual(braces('{-50..-0..5}'), ['-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0']);
    assert.deepEqual(braces('{1..10..2}'), ['1', '3', '5', '7', '9']);
    assert.deepEqual(braces('{1..20..20}'), ['1']);
    assert.deepEqual(braces('{1..20..2}'), ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
    assert.deepEqual(braces('{10..0..-2}'), ['10', '8', '6', '4', '2', '0']);
    assert.deepEqual(braces('{10..0..2}'), ['10', '8', '6', '4', '2', '0']);
    assert.deepEqual(braces('{10..1..-2}'), ['10', '8', '6', '4', '2']);
    assert.deepEqual(braces('{10..1..2}'), ['10', '8', '6', '4', '2']);
    assert.deepEqual(braces('{10..1}'), ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']);
    assert.deepEqual(braces('{10..1}y'), ['10y', '9y', '8y', '7y', '6y', '5y', '4y', '3y', '2y', '1y']);
    assert.deepEqual(braces('{100..0..-5}'), ['100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0']);
    assert.deepEqual(braces('{100..0..5}'), ['100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0']);
    assert.deepEqual(braces('{a..z..2}'), ['a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y']);
    assert.deepEqual(braces('{1..10..1}'), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    assert.deepEqual(braces('{1..10..2}'), ['1', '3', '5', '7', '9']);
    assert.deepEqual(braces('{1..20..20}'), ['1']);
    assert.deepEqual(braces('{1..20..2}'), ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
    assert.deepEqual(braces('{10..1..-2}'), ['10', '8', '6', '4', '2']);
    assert.deepEqual(braces('{10..1..2}'), ['10', '8', '6', '4', '2']);
    assert.deepEqual(braces('{2..10..1}'), ['2', '3', '4', '5', '6', '7', '8', '9', '10']);
    assert.deepEqual(braces('{2..10..2}'), ['2', '4', '6', '8', '10']);
    assert.deepEqual(braces('{2..10..3}'), ['2', '5', '8']);
  });

  it('should expand negative ranges using steps:', function() {
    assert.deepEqual(braces('{-1..-10..-2}'), ['-1', '-3', '-5', '-7', '-9']);
    assert.deepEqual(braces('{-1..-10..2}'), ['-1', '-3', '-5', '-7', '-9']);
    assert.deepEqual(braces('{-10..-2..2}'), ['-10', '-8', '-6', '-4', '-2']);
    assert.deepEqual(braces('{-2..-10..1}'), ['-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
    assert.deepEqual(braces('{-2..-10..2}'), ['-2', '-4', '-6', '-8', '-10']);
    assert.deepEqual(braces('{-2..-10..3}'), ['-2', '-5', '-8']);
    assert.deepEqual(braces('{-9..9..3}'), ['-9', '-6', '-3', '0', '3', '6', '9']);
  });

  it('should expand mixed ranges and sets:', function() {
    assert.deepEqual(braces('x{{0..10},braces}y'), ['x0y', 'xbracesy', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'x10y']);
    assert.deepEqual(braces('{{0..10},braces}'), ['0', 'braces', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    assert.deepEqual(braces('{2147483645..2147483649}'), ['2147483645', '2147483646', '2147483647', '2147483648', '2147483649']);
  });

  it('should return invalid ranges:', function() {
    assert.deepEqual(braces('{1.20..2}'), ['{1.20..2}']);
    assert.deepEqual(braces('{1..0f}'), ['{1..0f}']);
    assert.deepEqual(braces('{1..10..ff}'), ['{1..10..ff}']);
    assert.deepEqual(braces('{1..10.f}'), ['{1..10.f}']);
    assert.deepEqual(braces('{1..10f}'), ['{1..10f}']);
    assert.deepEqual(braces('{1..20..2f}'), ['{1..20..2f}']);
    assert.deepEqual(braces('{1..20..f2}'), ['{1..20..f2}']);
    assert.deepEqual(braces('{1..2f..2}'), ['{1..2f..2}']);
    assert.deepEqual(braces('{1..ff..2}'), ['{1..ff..2}']);
    assert.deepEqual(braces('{1..ff}'), ['{1..ff}']);
    assert.deepEqual(braces('{1..f}'), ['{1..f}']);
    assert.deepEqual(braces('{f..1}'), ['{f..1}']);
  });
});
