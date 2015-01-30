/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var argv = require('minimist')(process.argv.slice(2));
var should = require('should');
var expand = require('..');

if ('minimatch' in argv) {
  expand = require('minimatch').braceExpand;
}


describe('braces', function () {
  describe('brace expansion', function () {
    it('should return an empty array when no braces are found', function () {
      expand('').should.eql([]);
    });

    it('should repeat strings followed by {,}', function () {
      expand('a{,}', {nodupes: false}).should.eql(['a', 'a']);
      expand('a{,}{,}', {nodupes: false}).should.eql(['a', 'a', 'a', 'a']);
      expand('a{,}{,}{,}', {nodupes: false}).should.eql(['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
      expand('{a,b{,}{,}{,}}', {nodupes: false}).should.eql(['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']);
      expand('a{,}/{c,d}/e', {nodupes: false}).should.eql(['a/c/e','a/c/e','a/d/e','a/d/e']);
      expand('{a,b{,}{,}{,},c}d', {nodupes: false}).should.eql(['ad', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'cd']);
    });

    it('should eliminate dupes in repeated strings when `nodupes` is true', function () {
      expand('a{,}', {nodupes: true}).should.eql(['a']);
      expand('a{,}{,}', {nodupes: true}).should.eql(['a']);
      expand('a{,}{,}{,}', {nodupes: true}).should.eql(['a']);
      expand('{a,b{,}{,}{,}}', {nodupes: true}).should.eql(['a', 'b']);
      expand('{a,b{,}{,}{,},c}d', {nodupes: true}).should.eql(['ad', 'bd', 'cd']);
      expand('{a,b{,}{,}{,},c}d', {nodupes: true}).should.eql(['ad', 'bd', 'cd']);
    });

    it('should work with no braces', function () {
      expand('abc').should.eql(['abc']);
    });

    it('should work with no braces', function () {
      expand('a{,}').should.eql(['a']);
      expand('{,}b').should.eql(['b']);
      expand('a{,}b').should.eql(['ab']);
      expand('a{b}c').should.eql(['abc']);
    });

    it('should work with no braces in `bash` mode', function () {
      expand('a{b}c', {bash: true}).should.eql(['a{b}c']);
    });

    it('should handle spaces', function () {
      expand('0{1..9} {10..20}').should.eql(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']);
      expand('a{ ,c{d, },h}x').should.eql(['a{',',c{d,','},h}x']);
      expand('a{ ,c{d, },h} ').should.eql(['a{', ',c{d,', '},h}']);
    });

    it('should handle empty braces', function () {
      expand('{ }').should.eql(['{', '}']);
      expand('{}').should.eql(['{}']);
      expand('}').should.eql(['}']);
      expand('{').should.eql(['{']);
      expand('{,}').should.eql([]);
    });

    it('should handle imbalanced braces', function () {
      expand('a-{bdef-{g,i}-c').should.eql(['a-{bdef-g-c', 'a-{bdef-i-c']);
      expand('abc{').should.eql(['abc{']);
      expand('{abc{').should.eql(['{abc{']);
      expand('{abc').should.eql(['{abc']);
      expand('}abc').should.eql(['}abc']);
      expand('ab{c').should.eql(['ab{c']);
      expand('ab{c').should.eql(['ab{c']);
      expand('{{a,b}').should.eql(['{a','{b']);
      expand('{a,b}}').should.eql(['a}','b}']);
      expand('abcd{efgh').should.eql(['abcd{efgh']);
      expand('a{b{c{d,e}f}g}h').should.eql(['abcdfgh','abcefgh']);
      expand('f{x,y{{g,z}}h}').should.eql(['fx','fygh','fyzh']);
      expand('z{a,b},c}d').should.eql(['za,c}d','zb,c}d']);
      expand('a{b{c{d,e}f{x,y{{g}h').should.eql(['a{b{cdf{x,y{gh','a{b{cef{x,y{gh']);
      expand('f{x,y{{g}h').should.eql(['f{x,y{gh']);
      expand('f{x,y{{g}}h').should.eql(['f{x,ygh']);
      expand('a{b{c{d,e}f{x,y{}g}h').should.eql(['a{b{cdfxh','a{b{cefxh','a{b{cdfy{}gh','a{b{cefy{}gh']);
      expand('f{x,y{}g}h').should.eql(['fxh','fy{}gh']);
      expand('z{a,b{,c}d').should.eql(['z{a,bd', 'z{a,bcd']);
    });

    it('should handle invalid braces in `bash mode`:', function () {
      expand('a{b{c{d,e}f}g}h', {bash: true}).should.eql(['a{b{cdf}g}h','a{b{cef}g}h']);
      expand('f{x,y{{g,z}}h}', {bash: true}).should.eql(['fx','fy{g}h','fy{z}h']);
      expand('z{a,b},c}d', {bash: true}).should.eql(['za,c}d','zb,c}d']);
      expand('a{b{c{d,e}f{x,y{{g}h', {bash: true}).should.eql(['a{b{cdf{x,y{{g}h','a{b{cef{x,y{{g}h']);
      expand('f{x,y{{g}h', {bash: true}).should.eql(['f{x,y{{g}h']);
      expand('f{x,y{{g}}h', {bash: true}).should.eql(['f{x,y{{g}}h']);
    });

    it('should return invalid braces:', function () {
      expand('{0..10,braces}').should.eql(['0..10', 'braces']);
    });

    it('should not expand quoted strings.', function () {
      expand('{"x,x"}').should.eql(['{x,x}']);
      expand('{"klklkl"}{1,2,3}').should.eql(['{klklkl}1', '{klklkl}2', '{klklkl}3']);
    });

    it('should work with one value', function () {
      expand('a{b}c').should.eql(['abc']);
      expand('a/b/c{d}e').should.eql(['a/b/cde']);
    });

    it('should work with one value in `bash` mode', function () {
      expand('a{b}c', {bash: true}).should.eql(['a{b}c']);
      expand('a/b/c{d}e', {bash: true}).should.eql(['a/b/c{d}e']);
    });

    it('should work with nested non-sets', function () {
      expand('foo {1,2} bar').should.eql(['foo', '1', '2', 'bar']);
      expand('{a-{b,c,d}}').should.eql(['a-b', 'a-c', 'a-d']);
      expand('{a,{a-{b,c,d}}}').should.eql(['a','a-b','a-c','a-d']);
    });

    it('should work with nested non-sets in `bash` mode', function () {
      expand('{a-{b,c,d}}', {bash: true}).should.eql(['{a-b}', '{a-c}', '{a-d}']);
      expand('{a,{a-{b,c,d}}}', {bash: true}).should.eql(['a','{a-b}','{a-c}','{a-d}']);
    });

    it('should not expand dots with leading slashes (escaped or paths).', function () {
      expand('a{b,c/*/../d}e').should.eql(['abe', 'ac/*/../de']);
      expand('a{b,b,c/../b}d').should.eql(['abd', 'ac/../bd']);
    });

    it('should work with commas.', function () {
      expand('a{b,}c').should.eql(['abc', 'ac']);
      expand('a{,b}c').should.eql(['ac', 'abc']);
    });

    it('should expand sets', function () {
      expand('a/{x,y}/cde').should.eql(['a/x/cde', 'a/y/cde']);
      expand('a/b/c/{x,y}').should.eql(['a/b/c/x', 'a/b/c/y']);
      expand('ff{c,b,a}').should.eql(['ffc', 'ffb', 'ffa']);
      expand('f{d,e,f}g').should.eql(['fdg', 'feg', 'ffg']);
      expand('{l,n,m}xyz').should.eql(['lxyz', 'nxyz', 'mxyz']);
      expand('{x,y,{abc},trie}').should.eql(['x', 'y', 'abc', 'trie']);
    });

    it('should use `bash` mode to expand sets', function () {
      expand('{x,y,{abc},trie}', {bash: true}).should.eql(['x', 'y', '{abc}', 'trie']);
    });

    it('should expand multiple sets', function () {
      expand('a/{a,b}/{c,d}/e').should.eql(['a/a/c/e', 'a/b/c/e', 'a/a/d/e', 'a/b/d/e']);
      expand('a{b,c}d{e,f}g').should.eql(['abdeg', 'acdeg', 'abdfg', 'acdfg']);
      expand('a/{x,y}/c{d,e}f.{md,txt}').should.eql(['a/x/cdf.md', 'a/y/cdf.md', 'a/x/cef.md', 'a/y/cef.md', 'a/x/cdf.txt', 'a/y/cdf.txt', 'a/x/cef.txt', 'a/y/cef.txt']);
    });

    it('should expand nested sets', function () {
      expand('{a,b}{{a,b},a,b}').should.eql(['aa', 'ab', 'ba', 'bb']); // Bash does not remove duplicates
      expand('/usr/{ucb/{ex,edit},lib/{ex,how_ex}}').should.eql(['/usr/ucb/ex', '/usr/lib/ex', '/usr/ucb/edit', '/usr/lib/how_ex']);
      expand('a{b,c{d,e}f}g').should.eql(['abg', 'acdfg', 'acefg']);
      expand('a{{x,y},z}b').should.eql(['axb','azb','ayb']);
      expand('f{x,y{g,z}}h').should.eql(['fxh','fygh','fyzh']);
      expand('a{b,c{d,e},h}x/z').should.eql(['abx/z', 'acdx/z', 'ahx/z', 'acex/z']);
      expand('a{b,c{d,e},h}x{y,z}').should.eql(['abxy', 'acdxy', 'ahxy', 'acexy', 'abxz', 'acdxz', 'ahxz', 'acexz']);
      expand('a{b,c{d,e},{f,g}h}x{y,z}').should.eql(['abxy', 'acdxy', 'afhxy', 'acexy', 'aghxy', 'abxz', 'acdxz', 'afhxz', 'acexz', 'aghxz']);
      expand('a-{b{d,e}}-c').should.eql(['a-bd-c', 'a-be-c']);
    });

    it('should use `bash` mode to expand nested sets.', function () {
      expand('a-{b{d,e}}-c', {bash: true}).should.eql(['a-{bd}-c', 'a-{be}-c']);
    });

    it('should expand with globs.', function () {
      expand('a/b/{d,e}/*.js').should.eql(['a/b/d/*.js', 'a/b/e/*.js']);
      expand('a/**/c/{d,e}/f*.js').should.eql(['a/**/c/d/f*.js', 'a/**/c/e/f*.js']);
      expand('a/**/c/{d,e}/f*.{md,txt}').should.eql(['a/**/c/d/f*.md', 'a/**/c/e/f*.md', 'a/**/c/d/f*.txt', 'a/**/c/e/f*.txt']);
    });

    it('should expand with extglobs.', function () {
      expand('a/b/{d,e,[1-5]}/*.js').should.eql(['a/b/d/*.js', 'a/b/e/*.js', 'a/b/[1-5]/*.js']);
    });
  });

  describe('escaping:', function () {
    it('should not expand strings with es6/bash-like variables.', function () {
      expand('abc/${ddd}/xyz').should.eql(['abc/${ddd}/xyz']);
      expand('a${b}c').should.eql(['a${b}c']);
      expand('a/{${b},c}/d').should.eql(['a/${b}/d', 'a/c/d']);
      expand('a${b,d}/{foo,bar}c').should.eql(['a${b,d}/fooc', 'a${b,d}/barc']);
    });

    it('should not expand escaped commas.', function () {
      expand('a{b\\,c}d').should.eql(['a{b,c}d']);
      expand('a{b\\,c\\,d}e').should.eql(['a{b,c,d}e']);
      expand('{abc\\,def}').should.eql(['{abc,def}']);
      expand('{abc\\,def,ghi}').should.eql(['abc,def', 'ghi']);
      expand('a/{b,c}/{x\\,y}/d/e').should.eql(['a/b/x,y/d/e', 'a/c/x,y/d/e']);
    });

    it('should return sets with escaped commas in `bash` mode.', function () {
      expand('a/{b,c}/{x\\,y}/d/e', {bash: true}).should.eql(['a/b/{x,y}/d/e', 'a/c/{x,y}/d/e']);
    });

    it('should not expand escaped braces.', function () {
      expand('{a,b\\}c,d}').should.eql(['{a,b}c,d}']); // Bash expects ['a','b}c','d']
      expand('\\{a,b,c,d,e}').should.eql(['{a,b,c,d,e}']);
      expand('a/{b,\\{a,b,c,d,e}/d').should.eql(['a/b/d','a/{a/d','a/c/d','a/d/d','a/e/d']);
      expand('a/{b,\\{a,b,c,d,e}/d', {nodupes: false}).should.eql(['a/b/d','a/{a/d','a/b/d','a/c/d','a/d/d','a/e/d']);
      expand('a/\\{b,c}/{d,e}/f').should.eql(['a/{b,c}/d/f', 'a/{b,c}/e/f']);
      expand('./\\{x,y}/{a..z..3}/', {makeRe: true}).should.eql(['./{x,y}/(a|d|g|j|m|p|s|v|y)/']);
    });

    it('should not expand escaped braces or commas.', function () {
      expand('{x\\,y,\\{abc\\},trie}').should.eql(['x,y','{abc}','trie']);
    });
  });

  describe('options', function () {
    it('should remove empty values and `\\` when `options.strict` is true.', function () {
      expand('{a..A}', {strict: true}).should.eql(['a', '`', '_', '^', ']', '[', 'Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']);
    });
  });

  describe('custom functions', function () {
    it('should expose the current value as the first param.', function () {
      var res = expand('{1..5}', function (val, isNumber, pad, i) {
        return val;
      });
      res.should.eql(['1', '2', '3', '4', '5']);
    });

    it('should expose the `isNumber` boolean as the second param.', function () {
      var res = expand('{a..e}', function (val, isNumber, pad, i) {
        if (!isNumber) {
          return String.fromCharCode(val);
        }
        return val;
      });
      res.should.eql(['a', 'b', 'c', 'd', 'e']);
    });

    it('should expose the index as the third param.', function () {
      var res = expand('{a..e}', function (val, isNumber, pad, i) {
        if (!isNumber) {
          return String.fromCharCode(val) + i;
        }
        return val;
      });
      res.should.eql(['a0', 'b1', 'c2', 'd3', 'e4']);
    });
  });

  describe('complex', function () {
    it('should expand a complex combination of ranges and sets:', function () {
      expand('a/{x,y}/{1..5}c{d,e}f.{md,txt}').should.eql(['a/x/1cdf.md', 'a/y/1cdf.md', 'a/x/2cdf.md', 'a/y/2cdf.md', 'a/x/3cdf.md', 'a/y/3cdf.md', 'a/x/4cdf.md', 'a/y/4cdf.md', 'a/x/5cdf.md', 'a/y/5cdf.md', 'a/x/1cef.md', 'a/y/1cef.md', 'a/x/2cef.md', 'a/y/2cef.md', 'a/x/3cef.md', 'a/y/3cef.md', 'a/x/4cef.md', 'a/y/4cef.md', 'a/x/5cef.md', 'a/y/5cef.md', 'a/x/1cdf.txt', 'a/y/1cdf.txt', 'a/x/2cdf.txt', 'a/y/2cdf.txt', 'a/x/3cdf.txt', 'a/y/3cdf.txt', 'a/x/4cdf.txt', 'a/y/4cdf.txt', 'a/x/5cdf.txt', 'a/y/5cdf.txt', 'a/x/1cef.txt', 'a/y/1cef.txt', 'a/x/2cef.txt', 'a/y/2cef.txt', 'a/x/3cef.txt', 'a/y/3cef.txt', 'a/x/4cef.txt', 'a/y/4cef.txt', 'a/x/5cef.txt', 'a/y/5cef.txt']);
    });

    it('should expand complex sets and ranges in `bash` mode:', function () {
      expand('a/{x,{1..5},y}/c{d}e', {bash: true}).should.eql(['a/x/c{d}e', 'a/1/c{d}e', 'a/y/c{d}e', 'a/2/c{d}e', 'a/3/c{d}e', 'a/4/c{d}e', 'a/5/c{d}e']);
    });
  });
});

describe('range expansion', function () {
  it('should expand numerical ranges', function () {
    expand('a{0..3}d').should.eql(['a0d', 'a1d', 'a2d', 'a3d']);
    expand('x{10..1}y').should.eql(['x10y', 'x9y', 'x8y', 'x7y', 'x6y', 'x5y', 'x4y', 'x3y', 'x2y', 'x1y']);
    expand('x{3..3}y').should.eql(['x3y']);
    expand('{-1..-10}').should.eql(['-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
    expand('{-20..0}').should.eql(['-20', '-19', '-18', '-17', '-16', '-15', '-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0']);
    expand('{1..10}').should.eql(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    expand('{1..3}').should.eql(['1', '2', '3']);
    expand('{1..9}').should.eql(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    expand('{3..3}').should.eql(['3']);
    expand('{5..8}').should.eql(['5', '6', '7', '8']);
  });

  it('should expand alphabetical ranges', function () {
    expand('0{a..d}0').should.eql(['0a0', '0b0', '0c0', '0d0']);
    expand('0{a..d}0').should.not.eql(['0a0', '0b0', '0c0']);
    expand('a/{b..d}/e').should.eql(['a/b/e', 'a/c/e', 'a/d/e']);
    expand('{a..A}').should.eql(['a', '`', '_', '^', ']', '\\', '[', 'Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']);
    expand('{A..a}').should.eql(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a']);
    expand('{a..e}').should.eql(['a', 'b', 'c', 'd', 'e']);
    expand('{A..E}').should.eql(['A', 'B', 'C', 'D', 'E']);
    expand('{a..f}').should.eql(['a', 'b', 'c', 'd', 'e', 'f']);
    expand('{a..z}').should.eql(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
    expand('{E..A}').should.eql(['E', 'D', 'C', 'B', 'A']);
    expand('{f..a}').should.eql(['f', 'e', 'd', 'c', 'b', 'a']);
    expand('{f..f}').should.eql(['f']);
  });

  it('should use steps with alphabetical ranges', function () {
    expand('{a..e..2}').should.eql(['a','c', 'e']);
    expand('{E..A..2}').should.eql(['E', 'C', 'A']);
  });

  it('should not try to expand ranges with decimals', function () {
    expand('{1.1..2.1}').should.eql(['{1.1..2.1}']);
    expand('{1.1..2.1}', {makeRe: true}).should.eql(['{1.1..2.1}']);
    expand('{1.1..~2.1}', {makeRe: true}).should.eql(['{1.1..~2.1}']);
  });

  it('should expand negative ranges', function () {
    expand('{z..a..-2}').should.eql(['z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b']);
    expand('{-10..-1}').should.eql(['-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1']);
    expand('{0..-5}').should.eql(['0', '-1', '-2', '-3', '-4', '-5']);
    expand('{9..-4}').should.eql(['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4']);
  });

  it('should expand multiple ranges:', function () {
    expand('a/{b..d}/e/{f..h}').should.eql(['a/b/e/f', 'a/c/e/f', 'a/d/e/f', 'a/b/e/g', 'a/c/e/g', 'a/d/e/g', 'a/b/e/h', 'a/c/e/h', 'a/d/e/h']);
  });

  it('should work with dots in file paths', function () {
    expand('../{1..3}/../foo').should.eql(['../1/../foo', '../2/../foo', '../3/../foo']);
  });

  it('should make a regex-string when `options.makeRe` is defined:', function () {
    expand('../{1..3}/../foo', {makeRe: true}).should.eql(['../[1-3]/../foo']);
    expand('../{2..10..2}/../foo', {makeRe: true}).should.eql(['../(2|4|6|8|10)/../foo']);
    expand('../{1..3}/../{a,b,c}/foo', {makeRe: true}).should.eql(['../[1-3]/../(a|b|c)/foo']);
    expand('./{a..z..3}/', {makeRe: true}).should.eql(['./(a|d|g|j|m|p|s|v|y)/']);
    expand('./{"x,y"}/{a..z..3}/', {makeRe: true}).should.eql(['./{x,y}/(a|d|g|j|m|p|s|v|y)/']);
  });

  it('should expand ranges using steps:', function () {
    expand('{-1..-10..-2}').should.eql(['-1', '-3', '-5', '-7', '-9']);
    expand('{-1..-10..2}').should.eql(['-1', '-3', '-5', '-7', '-9']);
    expand('{-50..-0..5}').should.eql(['-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0']);
    expand('{1..10..2}').should.eql(['1', '3', '5', '7', '9']);
    expand('{1..20..20}').should.eql(['1']);
    expand('{1..20..2}').should.eql(['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
    expand('{10..0..-2}').should.eql(['10', '8', '6', '4', '2', '0']);
    expand('{10..0..2}').should.eql(['10', '8', '6', '4', '2', '0']);
    expand('{10..1..-2}').should.eql(['10', '8', '6', '4', '2']);
    expand('{10..1..2}').should.eql(['10', '8', '6', '4', '2']);
    expand('{10..1}').should.eql(['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']);
    expand('{10..1}y').should.eql(['10y', '9y', '8y', '7y', '6y', '5y', '4y', '3y', '2y', '1y']);
    expand('{100..0..-5}').should.eql(['100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0']);
    expand('{100..0..5}').should.eql(['100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0']);
    expand('{a..z..2}').should.eql(['a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y']);
    expand('{1..10..1}').should.eql(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    expand('{1..10..2}').should.eql(['1', '3', '5', '7', '9']);
    expand('{1..20..20}').should.eql(['1']);
    expand('{1..20..2}').should.eql(['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
    expand('{10..1..-2}').should.eql(['10', '8', '6', '4', '2']);
    expand('{10..1..2}').should.eql(['10', '8', '6', '4', '2']);
    expand('{2..10..1}').should.eql(['2', '3', '4', '5', '6', '7', '8', '9', '10']);
    expand('{2..10..2}').should.eql(['2', '4', '6', '8', '10']);
    expand('{2..10..3}').should.eql(['2', '5', '8']);
  });

  it('should expand negative ranges using steps:', function () {
    expand('{-1..-10..-2}').should.eql(['-1', '-3', '-5', '-7', '-9']);
    expand('{-1..-10..2}').should.eql(['-1', '-3', '-5', '-7', '-9']);
    expand('{-10..-2..2}').should.eql(['-10', '-8', '-6', '-4', '-2']);
    expand('{-2..-10..1}').should.eql(['-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
    expand('{-2..-10..2}').should.eql(['-2', '-4', '-6', '-8', '-10']);
    expand('{-2..-10..3}').should.eql(['-2', '-5', '-8']);
    expand('{-9..9..3}').should.eql(['-9', '-6', '-3', '0', '3', '6', '9']);
  });

  it('should expand mixed ranges and sets:', function () {
    expand('x{{0..10},braces}y').should.eql(['x0y', 'xbracesy', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'x10y']);
    expand('{{0..10},braces}').should.eql(['0', 'braces', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    expand('{2147483645..2147483649}').should.eql(['2147483645', '2147483646', '2147483647', '2147483648', '2147483649']);
  });

  it('should return invalid ranges:', function () {
    expand('{1.20..2}').should.eql(['{1.20..2}']);
    expand('{1..0f}').should.eql(['{1..0f}']);
    expand('{1..10..ff}').should.eql(['{1..10..ff}']);
    expand('{1..10.f}').should.eql(['{1..10.f}']);
    expand('{1..10f}').should.eql(['{1..10f}']);
    expand('{1..20..2f}').should.eql(['{1..20..2f}']);
    expand('{1..20..f2}').should.eql(['{1..20..f2}']);
    expand('{1..2f..2}').should.eql(['{1..2f..2}']);
    expand('{1..ff..2}').should.eql(['{1..ff..2}']);
    expand('{1..ff}').should.eql(['{1..ff}']);
    expand('{1..f}').should.eql(['{1..f}']);
    expand('{f..1}').should.eql(['{f..1}']);
  });

  it('should handle special characters:', function () {

  });
});
