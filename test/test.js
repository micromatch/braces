/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
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
      expand('').should.eql(['']);
    });

    it('should work with no braces', function () {
      expand('abc').should.eql(['abc']);
    });

    it('should handle spaces', function () {
      expand('a{ ,c{d, },h}x').should.eql(['a x', 'acdx', 'ahx', 'ac x']);
      expand('a{ ,c{d, },h} ').should.eql(['a  ', 'acd ', 'ah ', 'ac  ']);
    });

    it('should handle empty braces', function () {
      expand('{}').should.eql(['{}']);
      expand('}').should.eql(['}']);
      expand('{').should.eql(['{']);
      expand('{,}').should.eql(['']);
    });

    it('should handle unmatched braces', function () {
      expand('abc{').should.eql(['abc{']);
      expand('{abc{').should.eql(['{abc{']);
      expand('{abc').should.eql(['{abc']);
      expand('}abc').should.eql(['}abc']);
      expand('ab{c').should.eql(['ab{c']);
      expand('ab{c').should.eql(['ab{c']);
      expand('{{a,b}').should.eql(['{a','{b']);
      expand('{a,b}}').should.eql(['a}',"b}"]);
      expand('a{,}').should.eql(['a']);
      expand('{,}b').should.eql(['b']);
      expand('a{,}b').should.eql(['ab']);
      expand('a{b}c').should.eql(['abc']);

      // expand('a{b{c{d,e}f{x,y{{g}h').should.eql(['a{b{cdf{x,y{{g}h','a{b{cef{x,y{{g}h']);
      // expand('a{b{c{d,e}f{x,y{}g}h').should.eql(['a{b{cdfxh','a{b{cdfy{}gh','a{b{cefxh','a{b{cefy{}gh']);
      // expand('a{b{c{d,e}f{x,y}}g}h').should.eql(['abcdfxgh', 'abcefxgh', 'abcdfygh', 'abcefygh']);
      // expand('a{b{c{d,e}f}g}h').should.eql(['abcdfgh', 'abcefgh']);
      // expand('a{{x,y},z}b').should.eql(['axb','azb','ayb']);
      // expand('f{x,y{g,z}}h').should.eql(['fxh','fygh','fyzh']);
      // expand('f{x,y{{g,z}}h').should.eql(['f{x,ygh','f{x,yzh']);
      // expand('f{x,y{{g,z}}h}').should.eql(['fx','fy{g}h','fy{z}h']);
      // expand('f{x,y{{g}h').should.eql(['f{x,y{{g}h']);
      // expand('f{x,y{{g}}h').should.eql(['f{x,y{{g}}h']);
      // expand('f{x,y{}g}h').should.eql(['fxh','fy{}gh']);
      // expand('z{a,b{,c}d').should.eql(['z{a,bcd','z{a,bd']);
      // expand('z{a,b},c}d').should.eql(['za,c}d','zb,c}d']);
    });

    it('should not expand quoted strings.', function () {
      expand('{"x,x"}').should.eql(['{x,x}']);
      expand('{"klklkl"}{1,2,3}').should.eql(['{klklkl}1', '{klklkl}2', '{klklkl}3']);
    });

    it('should not expand strings with es6/bash-like variables.', function () {
      expand('abc/${ddd}/xyz').should.eql(['abc/${ddd}/xyz']);
      expand('a${b}c').should.eql(['a${b}c']);
      expand('a/{${b},c}/d').should.eql(['a/${b}/d', 'a/c/d']);
      expand('a${b,d}/{foo,bar}c').should.eql(['a${b,d}/fooc', 'a${b,d}/barc']);
    });

    it('should work with one value', function () {
      expand('a{b}c').should.eql(['abc']);
      expand('a/b/c{d}e').should.eql(['a/b/cde']);
      expand('a/b/c{d}e').should.eql(['a/b/cde']);
    });

    it('should work with nested non-sets', function () {
      expand('{a-{b,c,d}}').should.eql(['a-b', 'a-c', 'a-d']);
      expand('{a,{a-{b,c,d}}}').should.eql(['a', 'a-b', 'a-c', 'a-d']);
    });

    it('should not expand dots with leading slashes (escaped or paths).', function () {
      expand('a{b,c/*/../d}e').should.eql(['abe', 'ac/*/../de']);
      expand('a{b,b,c/../b}d').should.eql(['abd', 'ac/../bd']);
    });

    it('should work with commas.', function () {
      expand('a{b,}c').should.eql(['abc', 'ac']);
      expand('a{,b}c').should.eql(['ac', 'abc']);
    });

    it('should not expand escaped commas.', function () {
      expand('a{b\\,c}d').should.eql(['a{b,c}d']);
      expand('a{b\\,c\\,d}e').should.eql(['a{b,c,d}e']);
    });

    it('should expand sets', function () {
      expand('a/{x,y}/cde').should.eql(['a/x/cde', 'a/y/cde']);
      expand('a/b/c/{x,y}').should.eql(['a/b/c/x', 'a/b/c/y']);
    });

    it('should expand multiple sets', function () {
      expand('a{b,c{d,e}f}g').should.eql(['abg', 'acdfg', 'acefg']);
      expand('a{b,c}d{e,f}g').should.eql(['abdeg', 'acdeg', 'abdfg', 'acdfg']);
    });

    it('should expand nested sets', function () {
      expand('a{b,c{d,e},h}x/z').should.eql(['abx/z', 'acdx/z', 'ahx/z', 'acex/z']);
      expand('a{b,c{d,e},h}x{y,z}').should.eql(['abxy', 'acdxy', 'ahxy', 'acexy', 'abxz', 'acdxz', 'ahxz', 'acexz']);
      expand('a{b,c{d,e},{f,g}h}x{y,z}').should.eql([ 'abxy', 'acdxy', 'afhxy', 'acexy', 'aghxy', 'abxz', 'acdxz', 'afhxz', 'acexz', 'aghxz' ]);
      expand('a/{x,y}/c{d,e}f.{md,txt}').should.eql([ 'a/x/cdf.md', 'a/y/cdf.md', 'a/x/cef.md', 'a/y/cef.md', 'a/x/cdf.txt', 'a/y/cdf.txt', 'a/x/cef.txt', 'a/y/cef.txt' ]);
    });

    it('should expand with globs.', function () {
      expand('a/**/c{d,e}f*.js').should.eql(['a/**/cdf*.js', 'a/**/cef*.js']);
      expand('a/**/c{d,e}f*.{md,txt}').should.eql(['a/**/cdf*.md', 'a/**/cef*.md', 'a/**/cdf*.txt', 'a/**/cef*.txt']);
    });
  });

  describe('range expansion', function () {
    it('should expand numerical ranges', function () {
      expand('{1..3}').should.eql(['1', '2', '3']);
      expand('{5..8}').should.eql(['5', '6', '7', '8']);
      expand('a{0..3}d').should.eql(['a0d', 'a1d', 'a2d', 'a3d']);
      expand('0{a..d}0').should.eql(['0a0', '0b0', '0c0', '0d0']);
      expand('0{a..d}0').should.not.eql(['0a0', '0b0', '0c0']);
    });

    it('should work with dots in file paths', function () {
      expand('../{1..3}/../foo').should.eql(['../1/../foo', '../2/../foo', '../3/../foo']);
    });

    it('should expand alphabetical ranges', function () {
      expand('{a..e}').should.eql(['a', 'b', 'c', 'd', 'e']);
      expand('{A..E}').should.eql(['A', 'B', 'C', 'D', 'E']);
    });
  });

  describe('custom functions', function () {
    it('should expose the current value as the first param.', function () {
      var res = expand('{1..5}', function (val, isLetter, i) {
        return val;
      });
      res.should.eql(['1', '2', '3', '4', '5']);
    });

    it('should expose the `isLetter` boolean as the second param.', function () {
      var res = expand('{a..e}', function (val, isLetter, i) {
        if (isLetter) {
          return String.fromCharCode(val);
        }
        return val;
      });
      res.should.eql(['a', 'b', 'c', 'd', 'e']);
    });

    it('should expose the index as the third param.', function () {
      var res = expand('{a..e}', function (val, isLetter, i) {
        if (isLetter) {
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
    it('should expand a combination of nested sets and ranges:', function () {
      expand('a/{x,{1..5},y}/c{d}e').should.eql(['a/x/cde', 'a/1/cde', 'a/y/cde', 'a/2/cde', 'a/3/cde', 'a/4/cde', 'a/5/cde']);
    });
  });
});


describe('ranges', function () {
 it('should expand numerical ranges', function () {
    expand('{1..3}').should.eql(['1', '2', '3']);
    expand('{5..8}').should.eql(['5', '6', '7', '8']);
  });

  it('should expand negative ranges', function () {
    expand('{0..-5}').should.eql(['0', '-1', '-2', '-3', '-4', '-5']);
  });

  it('should expand alphabetical ranges', function () {
    expand('{a..e}').should.eql(['a', 'b', 'c', 'd', 'e']);
    expand('{A..E}').should.eql(['A', 'B', 'C', 'D', 'E']);
  });

  it('should fill in numerical ranges', function () {
    expand('{1..3}').should.eql(['1', '2', '3']);
    expand('{5..8}').should.eql(['5', '6', '7', '8']);
  });

  it('should fill in numerical ranges when numbers are passed as strings', function () {
    expand('{1..3}').should.eql(['1', '2', '3']);
    expand('{5..8}').should.eql(['5', '6', '7', '8']);
  });

  it('should fill in negative ranges', function () {
    expand('{0..-5}').should.eql([ '0', '-1', '-2', '-3', '-4', '-5' ]);
    expand('{0..-5}').should.eql([ '0', '-1', '-2', '-3', '-4', '-5' ]);
    expand('{9..-4}').should.eql([ '9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4' ]);
    expand('{-10..-1}').should.eql([ '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1' ]);
  });

  it('should fill in rangines using the given increment', function () {
    expand('{1..10}').should.eql([ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ]);
    expand('{1..10..1}').should.eql([ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ]);
    expand('{1..10..2}').should.eql([ '1', '3', '5', '7', '9' ]);
    expand('{1..10..2}').should.eql([ '1', '3', '5', '7', '9' ]);
    expand('{1..10..2}').should.eql([ '1', '3', '5', '7', '9' ]);
    expand('{1..20..2}').should.eql([ '1', '3', '5', '7', '9', '11', '13', '15', '17', '19' ]);
    expand('{1..20..20}').should.eql([ '1' ]);
    expand('{10..1..-2}').should.eql([ '10', '8', '6', '4', '2' ]);
    expand('{10..1..2}').should.eql([ '10', '8', '6', '4', '2' ]);
    expand('{1..9}').should.eql([ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]);
    expand('{2..10..2}').should.eql([ '2', '4', '6', '8', '10' ]);
    expand('{2..10..1}').should.eql([ '2', '3', '4', '5', '6', '7', '8', '9', '10' ]);
    expand('{2..10..2}').should.eql([ '2', '4', '6', '8', '10' ]);
    expand('{2..10..3}').should.eql([ '2', '5', '8' ]);
  });

  it('should fill in negative ranges using the given increment', function () {
    expand('{-1..-10..-2}').should.eql([ '-1', '-3', '-5', '-7', '-9' ]);
    expand('{-1..-10..2}').should.eql([ '-1', '-3', '-5', '-7', '-9' ]);
    expand('{10..1..-2}').should.eql([ '10', '8', '6', '4', '2' ]);
    expand('{-10..-2..2}').should.eql([ '-10', '-8', '-6', '-4', '-2' ]);
    expand('{-2..-10..1}').should.eql([ '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10' ]);
    expand('{-2..-10..2}').should.eql([ '-2', '-4', '-6', '-8', '-10' ]);
    expand('{-2..-10..3}').should.eql([ '-2', '-5', '-8' ]);
    expand('{-9..9..3}').should.eql([ '-9', '-6', '-3', '0', '3', '6', '9' ]);
  });

  it('should fill in negative ranges using the given increment', function () {
    expand('{1..10..2}').should.eql([ '1', '3', '5', '7', '9' ]);
    expand('{-1..-10..2}').should.eql([ '-1', '-3', '-5', '-7', '-9' ]);
    expand('{-1..-10..-2}').should.eql([ '-1', '-3', '-5', '-7', '-9' ]);
    expand('{10..1..-2}').should.eql([ '10', '8', '6', '4', '2' ]);
    expand('{10..1..2}').should.eql([ '10', '8', '6', '4', '2' ]);
    expand('{1..20..2}').should.eql([ '1', '3', '5', '7', '9', '11', '13', '15', '17', '19' ]);
    expand('{1..20..20}').should.eql([ '1' ]);
  });

  it('should fill in alphabetical ranges', function () {
    expand('{a..e}').should.eql(['a', 'b', 'c', 'd', 'e']);
    expand('{A..E}').should.eql(['A', 'B', 'C', 'D', 'E']);
    expand('{E..A}').should.eql(['E', 'D', 'C', 'B', 'A']);
  });

  it('should use increments with alphabetical ranges', function () {
    expand('{a..e..2}').should.eql(['a','c', 'e']);
    expand('{E..A..2}').should.eql(['E', 'C', 'A']);
  });
});
