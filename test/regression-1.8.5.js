'use strict';

var assert = require('assert');
var braces = require('..');

function equal(pattern, expected, options) {
  options = options || {};
  var fn = braces;
  if (options.optimize !== true) {
    fn = braces.expand;
  }
  var actual = fn(pattern, options).sort();
  assert.deepEqual(actual, expected.sort(), pattern);
}

describe('braces tests from 1.8.5', function() {
  it('braces', function() {
    equal('ff{c,b,a}', ['ffc', 'ffb', 'ffa']);
    equal('f{d,e,f}g', ['fdg', 'feg', 'ffg']);
    equal('{l,n,m}xyz', ['lxyz', 'nxyz', 'mxyz']);
    equal('{abc\\,d,ef}', ['abc,d', 'ef']);
    equal('{abc}', ['{abc}']);

    equal('\\{a,b,c,d,e}', ['{a,b,c,d,e}']);
    equal('{x,y,\\{a,b,c}}', ['x}', 'y}', '{a}', 'b}', 'c}']);
    equal('{x\\,y,\\{abc\\},trie}', ['x,y', '{abc}', 'trie']);

    equal('/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', ['/usr/ucb/ex', '/usr/lib/ex', '/usr/ucb/edit', '/usr/lib/how_ex']);

    equal('{}', ['{}']);
    equal('{ }', ['{ }']);
    equal('}', ['}']);
    equal('{', ['{']);
    equal('abcd{efgh', ['abcd{efgh']);

    equal('foo {1,2} bar', ['foo 1 bar', 'foo 2 bar']);
  });

  it('new sequence brace operators', function() {
    equal('{1..10}', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    equal('{0..10,braces}', ['0..10', 'braces']);
    equal('{braces,{0..10}}', ['braces', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    equal('{{0..10},braces}', ['0', 'braces', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    equal('x{{0..10},braces}y', ['x0y', 'xbracesy', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'x10y']);
  });

  it('ranges', function() {
    equal('{3..3}', ['3']);
    equal('x{3..3}y', ['x3y']);
    equal('{10..1}', ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']);
    equal('{10..1}y', ['10y', '9y', '8y', '7y', '6y', '5y', '4y', '3y', '2y', '1y']);
    equal('x{10..1}y', ['x10y', 'x9y', 'x8y', 'x7y', 'x6y', 'x5y', 'x4y', 'x3y', 'x2y', 'x1y']);
    equal('{a..f}', ['a', 'b', 'c', 'd', 'e', 'f']);
    equal('{f..a}', ['f', 'e', 'd', 'c', 'b', 'a']);

    equal('{a..A}', ['a', '`', '_', '^', ']', '\\', '[', 'Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']);
    equal('{A..a}', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a']);

    equal('{f..f}', ['f']);
    equal('0{1..9} {10..20}', ['01 10', '01 11', '01 12', '01 13', '01 14', '01 15', '01 16', '01 17', '01 18', '01 19', '01 20', '02 10', '02 11', '02 12', '02 13', '02 14', '02 15', '02 16', '02 17', '02 18', '02 19', '02 20', '03 10', '03 11', '03 12', '03 13', '03 14', '03 15', '03 16', '03 17', '03 18', '03 19', '03 20', '04 10', '04 11', '04 12', '04 13', '04 14', '04 15', '04 16', '04 17', '04 18', '04 19', '04 20', '05 10', '05 11', '05 12', '05 13', '05 14', '05 15', '05 16', '05 17', '05 18', '05 19', '05 20', '06 10', '06 11', '06 12', '06 13', '06 14', '06 15', '06 16', '06 17', '06 18', '06 19', '06 20', '07 10', '07 11', '07 12', '07 13', '07 14', '07 15', '07 16', '07 17', '07 18', '07 19', '07 20', '08 10', '08 11', '08 12', '08 13', '08 14', '08 15', '08 16', '08 17', '08 18', '08 19', '08 20', '09 10', '09 11', '09 12', '09 13', '09 14', '09 15', '09 16', '09 17', '09 18', '09 19', '09 20']);
  });

  it('mixes are incorrectly-formed brace expansions', function() {
    // the first one is valid, but Bash fails on it
    equal('{1..f}', ['1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f']);
    equal('{f..1}', ['1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f']);
  });

  it('do negative numbers work?', function() {
    equal('{-1..-10}', ['-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
    equal('{-20..0}', ['-20', '-19', '-18', '-17', '-16', '-15', '-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0']);
  });

  it('weirdly-formed brace expansions -- fixed in post-bash-3.1', function() {
    equal('{-1..-10}', ['-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
    equal('{-20..0}', ['-20', '-19', '-18', '-17', '-16', '-15', '-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0']);
    equal('a-{b{d,e}}-c', ['a-{bd}-c', 'a-{be}-c']);

    equal('a-{bdef-{g,i}-c', ['a-{bdef-g-c', 'a-{bdef-i-c']);

    equal('{"klklkl"}{1,2,3}', ['{klklkl}1', '{klklkl}2', '{klklkl}3']);
    equal('{"x,x"}', ['{x,x}']);
  });

  it('numerical ranges with steps', function() {
    equal('{1..10..2}', ['1', '3', '5', '7', '9']);
    equal('{-1..-10..2}', ['-1', '-3', '-5', '-7', '-9']);
    equal('{-1..-10..-2}', ['-1', '-3', '-5', '-7', '-9']);

    equal('{10..1..-2}', ['10', '8', '6', '4', '2']);
    equal('{10..1..2}', ['10', '8', '6', '4', '2']);

    equal('{1..20..2}', ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
    equal('{1..20..20}', ['1']);

    equal('{100..0..5}', ['100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0']);
    equal('{100..0..-5}', ['100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0']);
  });

  it('alpha ranges with steps', function() {
    equal('{a..z}', ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
    equal('{a..z..2}', ['a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y']);
    equal('{z..a..-2}', ['z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b']);
  });

  it('make sure brace expansion handles ints > 2**31 - 1 using intmax_t', function() {
    equal('{2147483645..2147483649}', ['2147483645', '2147483646', '2147483647', '2147483648', '2147483649']);
  });

  it('unwanted zero-padding -- fixed post-bash-4.0', function() {
    equal('{10..0..2}', ['10', '8', '6', '4', '2', '0']);
    equal('{10..0..-2}', ['10', '8', '6', '4', '2', '0']);
    equal('{-50..-0..5}', ['-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0']);
  });

  it('bad', function() {
    equal('{1..10.f}', ['{1..10.f}']);
    equal('{1..ff}', ['{1..ff}']);
    equal('{1..10..ff}', ['{1..10..ff}']);
    equal('{1.20..2}', ['{1.20..2}']);
    equal('{1..20..f2}', ['{1..20..f2}']);
    equal('{1..20..2f}', ['{1..20..2f}']);
    equal('{1..2f..2}', ['{1..2f..2}']);
    equal('{1..ff..2}', ['{1..ff..2}']);
    equal('{1..ff}', ['{1..ff}']);
    equal('{1..0f}', ['{1..0f}']);
    equal('{1..10f}', ['{1..10f}']);
    equal('{1..10.f}', ['{1..10.f}']);
    equal('{1..10.f}', ['{1..10.f}']);
  });
});

describe('bash tests', function() {
  describe('brace expansion', function() {
    it('should return an empty array when no braces are found', function() {
      equal('', ['']);
    });

    it('should expand emty sets', function() {
      equal('a{,}', ['a', 'a']);
      equal('{,}b', ['b', 'b']);
      equal('a{,}b', ['ab', 'ab']);
      equal('a{,}', ['a', 'a']);
      equal('a{,}{,}', ['a', 'a', 'a', 'a']);
      equal('a{,}{,}{,}', ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']);
      equal('{a,b{,}{,}{,}}', ['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']);
      equal('a{,}/{c,d}/e', ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']);
      equal('{a,b{,}{,}{,},c}d', ['ad', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'cd']);
    });

    it('should eliminate dupes in repeated strings', function() {
      equal('a{,}', ['a'], {nodupes: true});
      equal('a{,}{,}', ['a'], {nodupes: true});
      equal('a{,}{,}{,}', ['a'], {nodupes: true});
      equal('{a,b{,}{,}{,}}', ['a', 'b'], {nodupes: true});
      equal('{a,b{,}{,}{,},c}d', ['ad', 'bd', 'cd'], {nodupes: true});
      equal('{a,b{,}{,}{,},c}d', ['ad', 'bd', 'cd'], {nodupes: true});
    });

    it('should work with no braces', function() {
      equal('abc', ['abc']);
    });

    it('should work with no commas', function() {
      equal('a{b}c', ['a{b}c']);
    });

    it('should work with no commas in `bash` mode', function() {
      equal('a{b}c', ['a{b}c']);
    });

    it('should handle spaces', function() {
      equal('a{ ,c{d, },h}x', ['a x', 'acdx', 'ac x', 'ahx']);
      equal('a{ ,c{d, },h} ', [ 'a  ', 'acd ', 'ac  ', 'ah ' ]);

      // see https://github.com/jonschlinkert/microequal/issues/66
      equal('/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.{html,ejs}', [
        '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.html',
        '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.ejs'
      ]);
    });

    it('should handle empty braces', function() {
      equal('{ }', ['{ }']);
      equal('{}', ['{}']);
      equal('}', ['}']);
      equal('{', ['{']);
      equal('{,}', []);
    });

    it('should handle imbalanced braces', function() {
      equal('a-{bdef-{g,i}-c', ['a-{bdef-g-c', 'a-{bdef-i-c']);
      equal('abc{', ['abc{']);
      equal('{abc{', ['{abc{']);
      equal('{abc', ['{abc']);
      equal('}abc', ['}abc']);
      equal('ab{c', ['ab{c']);
      equal('ab{c', ['ab{c']);
      equal('{{a,b}', ['{a', '{b']);
      equal('{a,b}}', ['a}', 'b}']);
      equal('abcd{efgh', ['abcd{efgh']);
      equal('a{b{c{d,e}f}g}h', ['a{b{cdf}g}h', 'a{b{cef}g}h']);
      equal('f{x,y{{g,z}}h}', ['fx', 'fy{g}h', 'fy{z}h']);
      equal('z{a,b},c}d', ['za,c}d', 'zb,c}d']);
      equal('a{b{c{d,e}f{x,y{{g}h', ['a{b{cdf{x,y{{g}h', 'a{b{cef{x,y{{g}h']);
      equal('f{x,y{{g}h', ['f{x,y{{g}h']);
      equal('f{x,y{{g}}h', ['f{x,y{{g}}h']);
      equal('a{b{c{d,e}f{x,y{}g}h', ['a{b{cdfxh', 'a{b{cefxh', 'a{b{cdfy{}gh', 'a{b{cefy{}gh']);
      equal('f{x,y{}g}h', ['fxh', 'fy{}gh']);
      equal('z{a,b{,c}d', ['z{a,bd', 'z{a,bcd']);
    });

    it('should handle invalid braces in `bash mode`:', function() {
      equal('a{b{c{d,e}f}g}h', ['a{b{cdf}g}h', 'a{b{cef}g}h']);
      equal('f{x,y{{g,z}}h}', ['fx', 'fy{g}h', 'fy{z}h']);
      equal('z{a,b},c}d', ['za,c}d', 'zb,c}d']);
      equal('a{b{c{d,e}f{x,y{{g}h', ['a{b{cdf{x,y{{g}h', 'a{b{cef{x,y{{g}h']);
      equal('f{x,y{{g}h', ['f{x,y{{g}h']);
      equal('f{x,y{{g}}h', ['f{x,y{{g}}h']);
    });

    it('should return invalid braces:', function() {
      equal('{0..10,braces}', ['0..10', 'braces']);
    });

    it('should not expand quoted strings.', function() {
      equal('{"x,x"}', ['{x,x}']);
      equal('{"klklkl"}{1,2,3}', ['{klklkl}1', '{klklkl}2', '{klklkl}3']);
    });

    it('should work with one value', function() {
      equal('a{b}c', ['a{b}c']);
      equal('a/b/c{d}e', ['a/b/c{d}e']);
    });

    it('should work with one value in `bash` mode', function() {
      equal('a{b}c', ['a{b}c']);
      equal('a/b/c{d}e', ['a/b/c{d}e']);
    });

    it('should work with nested non-sets', function() {
      equal('foo {1,2} bar', ['foo 1 bar', 'foo 2 bar']);
      equal('{a-{b,c,d}}', ['{a-b}', '{a-c}', '{a-d}']);
      equal('{a,{a-{b,c,d}}}', ['a', '{a-b}', '{a-c}', '{a-d}']);
    });

    it('should work with nested non-sets in `bash` mode', function() {
      equal('{a-{b,c,d}}', ['{a-b}', '{a-c}', '{a-d}']);
      equal('{a,{a-{b,c,d}}}', ['a', '{a-b}', '{a-c}', '{a-d}']);
    });

    it('should not expand dots with leading slashes (escaped or paths).', function() {
      equal('a{b,c/*/../d}e', ['abe', 'ac/*/../de']);
      equal('a{b,b,c/../b}d', ['abd', 'abd', 'ac/../bd']);
    });

    it('should work with commas.', function() {
      equal('a{b,}c', ['abc', 'ac']);
      equal('a{,b}c', ['ac', 'abc']);
    });

    it('should expand sets', function() {
      equal('a/{x,y}/cde', ['a/x/cde', 'a/y/cde']);
      equal('a/b/c/{x,y}', ['a/b/c/x', 'a/b/c/y']);
      equal('ff{c,b,a}', ['ffc', 'ffb', 'ffa']);
      equal('f{d,e,f}g', ['fdg', 'feg', 'ffg']);
      equal('{l,n,m}xyz', ['lxyz', 'nxyz', 'mxyz']);
      equal('{x,y,{abc},trie}', ['x', 'y', '{abc}', 'trie']);
    });

    it('should expand multiple sets', function() {
      equal('a/{a,b}/{c,d}/e', ['a/a/c/e', 'a/b/c/e', 'a/a/d/e', 'a/b/d/e']);
      equal('a{b,c}d{e,f}g', ['abdeg', 'acdeg', 'abdfg', 'acdfg']);
      equal('a/{x,y}/c{d,e}f.{md,txt}', ['a/x/cdf.md', 'a/y/cdf.md', 'a/x/cef.md', 'a/y/cef.md', 'a/x/cdf.txt', 'a/y/cdf.txt', 'a/x/cef.txt', 'a/y/cef.txt']);
    });

    it('should expand nested sets', function() {
      equal('a/{b,c,{d,e}}/g', ['a/b/g', 'a/c/g', 'a/d/g', 'a/e/g']);
      equal('a/{a,b}/{c,d}/e', ['a/a/c/e', 'a/a/d/e', 'a/b/c/e', 'a/b/d/e']);
      equal('{a,b}{{a,b},a,b}', ['aa', 'aa', 'ab', 'ab', 'ba', 'ba', 'bb', 'bb']);
      equal('/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', ['/usr/ucb/ex', '/usr/lib/ex', '/usr/ucb/edit', '/usr/lib/how_ex']);
      equal('a{b,c{d,e}f}g', ['abg', 'acdfg', 'acefg']);
      equal('a{{x,y},z}b', ['axb', 'azb', 'ayb']);
      equal('f{x,y{g,z}}h', ['fxh', 'fygh', 'fyzh']);
      equal('a{b,c{d,e},h}x/z', ['abx/z', 'acdx/z', 'ahx/z', 'acex/z']);
      equal('a{b,c{d,e},h}x{y,z}', ['abxy', 'acdxy', 'ahxy', 'acexy', 'abxz', 'acdxz', 'ahxz', 'acexz']);
      equal('a{b,c{d,e},{f,g}h}x{y,z}', ['abxy', 'acdxy', 'afhxy', 'acexy', 'aghxy', 'abxz', 'acdxz', 'afhxz', 'acexz', 'aghxz']);
      equal('a-{b{d,e}}-c', ['a-{bd}-c', 'a-{be}-c']);
    });

    it('should expand with globs.', function() {
      equal('a/b/{d,e}/*.js', ['a/b/d/*.js', 'a/b/e/*.js']);
      equal('a/**/c/{d,e}/f*.js', ['a/**/c/d/f*.js', 'a/**/c/e/f*.js']);
      equal('a/**/c/{d,e}/f*.{md,txt}', ['a/**/c/d/f*.md', 'a/**/c/e/f*.md', 'a/**/c/d/f*.txt', 'a/**/c/e/f*.txt']);
    });

    it('should expand with extglobs.', function() {
      equal('a/b/{d,e,[1-5]}/*.js', ['a/b/d/*.js', 'a/b/e/*.js', 'a/b/[1-5]/*.js']);
    });
  });

  describe('escaping:', function() {
    it('should not expand strings with es6/bash-like variables.', function() {
      equal('abc/${ddd}/xyz', ['abc/${ddd}/xyz']);
      equal('a${b}c', ['a${b}c']);
      equal('a/{${b},c}/d', ['a/${b}/d', 'a/c/d']);
      equal('a${b,d}/{foo,bar}c', ['a${b,d}/fooc', 'a${b,d}/barc']);
    });

    it('should not expand escaped commas.', function() {
      equal('a{b\\,c}d', ['a{b,c}d']);
      equal('a{b\\,c\\,d}e', ['a{b,c,d}e']);
      equal('{abc\\,def}', ['{abc,def}']);
      equal('{abc\\,def,ghi}', ['abc,def', 'ghi']);
      equal('a/{b,c}/{x\\,y}/d/e', ['a/b/{x,y}/d/e', 'a/c/{x,y}/d/e']);
    });

    it('should return sets with escaped commas in `bash` mode.', function() {
      equal('a/{b,c}/{x\\,y}/d/e', ['a/b/{x,y}/d/e', 'a/c/{x,y}/d/e']);
    });

    it('should not expand escaped braces.', function() {
      equal('{a,b\\}c,d}', ['a', 'b}c', 'd']);
      equal('\\{a,b,c,d,e}', ['{a,b,c,d,e}']);
      equal('a/{b,\\{a,b,c,d,e}/d', ['a/b/d', 'a/b/d', 'a/{a/d', 'a/c/d', 'a/d/d', 'a/e/d']);
      equal('a/\\{b,c}/{d,e}/f', ['a/{b,c}/d/f', 'a/{b,c}/e/f']);
      equal('./\\{x,y}/{a..z..3}/', ['./{x,y}/(a|d|g|j|m|p|s|v|y)/'], {optimize: true});
    });

    it('should not expand escaped braces or commas.', function() {
      equal('{x\\,y,\\{abc\\},trie}', ['x,y', '{abc}', 'trie']);
    });
  });

  describe('complex', function() {
    it('should expand a complex combination of ranges and sets:', function() {
      equal('a/{x,y}/{1..5}c{d,e}f.{md,txt}', ['a/x/1cdf.md', 'a/y/1cdf.md', 'a/x/2cdf.md', 'a/y/2cdf.md', 'a/x/3cdf.md', 'a/y/3cdf.md', 'a/x/4cdf.md', 'a/y/4cdf.md', 'a/x/5cdf.md', 'a/y/5cdf.md', 'a/x/1cef.md', 'a/y/1cef.md', 'a/x/2cef.md', 'a/y/2cef.md', 'a/x/3cef.md', 'a/y/3cef.md', 'a/x/4cef.md', 'a/y/4cef.md', 'a/x/5cef.md', 'a/y/5cef.md', 'a/x/1cdf.txt', 'a/y/1cdf.txt', 'a/x/2cdf.txt', 'a/y/2cdf.txt', 'a/x/3cdf.txt', 'a/y/3cdf.txt', 'a/x/4cdf.txt', 'a/y/4cdf.txt', 'a/x/5cdf.txt', 'a/y/5cdf.txt', 'a/x/1cef.txt', 'a/y/1cef.txt', 'a/x/2cef.txt', 'a/y/2cef.txt', 'a/x/3cef.txt', 'a/y/3cef.txt', 'a/x/4cef.txt', 'a/y/4cef.txt', 'a/x/5cef.txt', 'a/y/5cef.txt']);
    });

    it('should expand complex sets and ranges in `bash` mode:', function() {
      equal('a/{x,{1..5},y}/c{d}e', ['a/x/c{d}e', 'a/1/c{d}e', 'a/y/c{d}e', 'a/2/c{d}e', 'a/3/c{d}e', 'a/4/c{d}e', 'a/5/c{d}e']);
    });
  });
});

describe('range expansion', function() {
  it('should expand numerical ranges', function() {
    equal('a{0..3}d', ['a0d', 'a1d', 'a2d', 'a3d']);
    equal('x{10..1}y', ['x10y', 'x9y', 'x8y', 'x7y', 'x6y', 'x5y', 'x4y', 'x3y', 'x2y', 'x1y']);
    equal('x{3..3}y', ['x3y']);
    equal('{-1..-10}', ['-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
    equal('{-20..0}', ['-20', '-19', '-18', '-17', '-16', '-15', '-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0']);
    equal('{1..10}', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    equal('{1..3}', ['1', '2', '3']);
    equal('{1..9}', ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
    equal('{3..3}', ['3']);
    equal('{5..8}', ['5', '6', '7', '8']);
  });

  it('should expand alphabetical ranges', function() {
    equal('0{a..d}0', ['0a0', '0b0', '0c0', '0d0']);
    equal('a/{b..d}/e', ['a/b/e', 'a/c/e', 'a/d/e']);
    equal('{a..A}', ['a', '`', '_', '^', ']', '\\', '[', 'Z', 'Y', 'X', 'W', 'V', 'U', 'T', 'S', 'R', 'Q', 'P', 'O', 'N', 'M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A']);
    equal('{A..a}', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a']);
    equal('{a..e}', ['a', 'b', 'c', 'd', 'e']);
    equal('{A..E}', ['A', 'B', 'C', 'D', 'E']);
    equal('{a..f}', ['a', 'b', 'c', 'd', 'e', 'f']);
    equal('{a..z}', ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']);
    equal('{E..A}', ['E', 'D', 'C', 'B', 'A']);
    equal('{f..a}', ['f', 'e', 'd', 'c', 'b', 'a']);
    equal('{f..f}', ['f']);
  });

  it('should use steps with alphabetical ranges', function() {
    equal('{a..e..2}', ['a', 'c', 'e']);
    equal('{E..A..2}', ['E', 'C', 'A']);
  });

  it('should not try to expand ranges with decimals', function() {
    equal('{1.1..2.1}', ['{1.1..2.1}']);
    equal('{1.1..2.1}', ['{1.1..2.1}'], {optimize: true});
    equal('{1.1..~2.1}', ['{1.1..~2.1}'], {optimize: true});
  });

  it('should expand negative ranges', function() {
    equal('{z..a..-2}', ['z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b']);
    equal('{-10..-1}', ['-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1']);
    equal('{0..-5}', ['0', '-1', '-2', '-3', '-4', '-5']);
    equal('{9..-4}', ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4']);
  });

  it('should expand multiple ranges:', function() {
    equal('a/{b..d}/e/{f..h}', ['a/b/e/f', 'a/c/e/f', 'a/d/e/f', 'a/b/e/g', 'a/c/e/g', 'a/d/e/g', 'a/b/e/h', 'a/c/e/h', 'a/d/e/h']);
  });

  it('should work with dots in file paths', function() {
    equal('../{1..3}/../foo', ['../1/../foo', '../2/../foo', '../3/../foo']);
  });

  it('should make a regex-string when `options.optimize` is defined:', function() {
    equal('../{1..3}/../foo', ['../([1-3])/../foo'], {optimize: true});
    equal('../{2..10..2}/../foo', ['../(2|4|6|8|10)/../foo'], {optimize: true});
    equal('../{1..3}/../{a,b,c}/foo', ['../([1-3])/../(a|b|c)/foo'], {optimize: true});
    equal('./{a..z..3}/', ['./(a|d|g|j|m|p|s|v|y)/'], {optimize: true});
    equal('./{"x,y"}/{a..z..3}/', ['./{x,y}/(a|d|g|j|m|p|s|v|y)/'], {optimize: true});
  });

  it('should expand ranges using steps:', function() {
    equal('{-1..-10..-2}', ['-1', '-3', '-5', '-7', '-9']);
    equal('{-1..-10..2}', ['-1', '-3', '-5', '-7', '-9']);
    equal('{-50..-0..5}', ['-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0']);
    equal('{1..10..2}', ['1', '3', '5', '7', '9']);
    equal('{1..20..20}', ['1']);
    equal('{1..20..2}', ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
    equal('{10..0..-2}', ['10', '8', '6', '4', '2', '0']);
    equal('{10..0..2}', ['10', '8', '6', '4', '2', '0']);
    equal('{10..1..-2}', ['10', '8', '6', '4', '2']);
    equal('{10..1..2}', ['10', '8', '6', '4', '2']);
    equal('{10..1}', ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']);
    equal('{10..1}y', ['10y', '9y', '8y', '7y', '6y', '5y', '4y', '3y', '2y', '1y']);
    equal('{100..0..-5}', ['100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0']);
    equal('{100..0..5}', ['100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0']);
    equal('{a..z..2}', ['a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y']);
    equal('{1..10..1}', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    equal('{1..10..2}', ['1', '3', '5', '7', '9']);
    equal('{1..20..20}', ['1']);
    equal('{1..20..2}', ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']);
    equal('{10..1..-2}', ['10', '8', '6', '4', '2']);
    equal('{10..1..2}', ['10', '8', '6', '4', '2']);
    equal('{2..10..1}', ['2', '3', '4', '5', '6', '7', '8', '9', '10']);
    equal('{2..10..2}', ['2', '4', '6', '8', '10']);
    equal('{2..10..3}', ['2', '5', '8']);
  });

  it('should expand negative ranges using steps:', function() {
    equal('{-1..-10..-2}', ['-1', '-3', '-5', '-7', '-9']);
    equal('{-1..-10..2}', ['-1', '-3', '-5', '-7', '-9']);
    equal('{-10..-2..2}', ['-10', '-8', '-6', '-4', '-2']);
    equal('{-2..-10..1}', ['-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10']);
    equal('{-2..-10..2}', ['-2', '-4', '-6', '-8', '-10']);
    equal('{-2..-10..3}', ['-2', '-5', '-8']);
    equal('{-9..9..3}', ['-9', '-6', '-3', '0', '3', '6', '9']);
  });

  it('should expand mixed ranges and sets:', function() {
    equal('x{{0..10},braces}y', ['x0y', 'xbracesy', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'x10y']);
    equal('{{0..10},braces}', ['0', 'braces', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    equal('{2147483645..2147483649}', ['2147483645', '2147483646', '2147483647', '2147483648', '2147483649']);
  });

  it('should return invalid ranges:', function() {
    equal('{1.20..2}', ['{1.20..2}']);
    equal('{1..0f}', ['{1..0f}']);
    equal('{1..10..ff}', ['{1..10..ff}']);
    equal('{1..10.f}', ['{1..10.f}']);
    equal('{1..10f}', ['{1..10f}']);
    equal('{1..20..2f}', ['{1..20..2f}']);
    equal('{1..20..f2}', ['{1..20..f2}']);
    equal('{1..2f..2}', ['{1..2f..2}']);
    equal('{1..ff..2}', ['{1..ff..2}']);
    equal('{1..ff}', ['{1..ff}']);
  });
});
