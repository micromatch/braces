'use strict';

require('mocha');
const assert = require('assert').strict;
const bashPath = require('bash-path');
const cp = require('child_process');
const braces = require('..');

const bash = input => {
  return cp.spawnSync(bashPath(), ['-c', `echo ${input}`])
    .stdout.toString()
    .split(/\s+/)
    .filter(Boolean);
};

const equal = (input, expected = bash(input), options) => {
  assert.deepEqual(braces.expand(input, options), expected);
};

/**
 * Bash 4.3 unit tests with `braces.expand()`
 */

describe('bash - expanded brace sets', () => {
  const fixtures = [
    ['a/\\{b,c,d,{x,y}}{e,f\\}/g', {}, ['a/{b,c,d,x}{e,f}/g', 'a/{b,c,d,y}{e,f}/g']],
    ['a/\\{b,c,d\\}\\{e,f\\}/g', {}, ['a/{b,c,d}{e,f}/g']],
    ['a/\\{b,c,d\\}\\{e,f}/g', {}, ['a/{b,c,d}{e,f}/g']],
    ['a/\\{b,c,d\\}{e,f}/g', {}, ['a/{b,c,d}e/g', 'a/{b,c,d}f/g']],
    ['a/\\{b,c,d{x,y}}{e,f\\}/g', {}, ['a/{b,c,dx}{e,f}/g', 'a/{b,c,dy}{e,f}/g']],
    ['a/\\{b,c,d}{e,f\\}/g', {}, ['a/{b,c,d}{e,f}/g']],
    ['a/\\{b,c,d}{e,f}/g', {}, ['a/{b,c,d}e/g', 'a/{b,c,d}f/g']],
    ['a/\\{x,y}/cde', {}, ['a/{x,y}/cde']],
    ['a/\\{{b,c}{e,f}/g', {}, ['a/{be/g', 'a/{bf/g', 'a/{ce/g', 'a/{cf/g']],
    ['a/\\{{b,c}{e,f}\\}/g', {}, ['a/{be}/g', 'a/{bf}/g', 'a/{ce}/g', 'a/{cf}/g']],
    ['a/\\{{b,c}{e,f}}/g', {}, ['a/{be}/g', 'a/{bf}/g', 'a/{ce}/g', 'a/{cf}/g']],
    ['a/b/{b,c,{d,e{f,g},{w,x}/{y,z}}}/h/i', {}, ['a/b/b/h/i', 'a/b/c/h/i', 'a/b/d/h/i', 'a/b/ef/h/i', 'a/b/eg/h/i', 'a/b/w/y/h/i', 'a/b/w/z/h/i', 'a/b/x/y/h/i', 'a/b/x/z/h/i']],
    ['a/{b,c,d}{e,f}/g', {}, ['a/be/g', 'a/bf/g', 'a/ce/g', 'a/cf/g', 'a/de/g', 'a/df/g']],
    ['a/{b,c\\,d}{e,f}/g', {}, ['a/be/g', 'a/bf/g', 'a/c,de/g', 'a/c,df/g']],
    ['a/{b,c\\}}{e,f}/g', {}, ['a/be/g', 'a/bf/g', 'a/c}e/g', 'a/c}f/g']],
    ['a/{b,c}', {}, ['a/b', 'a/c']],
    ['a/{b,c}d{e,f}/g', {}, ['a/bde/g', 'a/bdf/g', 'a/cde/g', 'a/cdf/g']],
    ['a/{b,c}{e,f}/g', {}, ['a/be/g', 'a/bf/g', 'a/ce/g', 'a/cf/g']],
    ['a/{b,c}{e,f}{g,h,i}/k', {}, ['a/beg/k', 'a/beh/k', 'a/bei/k', 'a/bfg/k', 'a/bfh/k', 'a/bfi/k', 'a/ceg/k', 'a/ceh/k', 'a/cei/k', 'a/cfg/k', 'a/cfh/k', 'a/cfi/k']],
    ['a/{b,{c,d},e}/f', {}, ['a/b/f', 'a/c/f', 'a/d/f', 'a/e/f']],
    ['a/{b,{c,d}/{e,f},g}/h', {}, ['a/b/h', 'a/c/e/h', 'a/c/f/h', 'a/d/e/h', 'a/d/f/h', 'a/g/h']],
    ['a/{b{c,d},e{f,g}h{i,j}}/k', {}, ['a/bc/k', 'a/bd/k', 'a/efhi/k', 'a/efhj/k', 'a/eghi/k', 'a/eghj/k']],
    ['a/{b{c,d},e}/f', {}, ['a/bc/f', 'a/bd/f', 'a/e/f']],
    ['a/{b{c,d}e{f,g}h{i,j}}/k', {}, ['a/{bcefhi}/k', 'a/{bcefhj}/k', 'a/{bceghi}/k', 'a/{bceghj}/k', 'a/{bdefhi}/k', 'a/{bdefhj}/k', 'a/{bdeghi}/k', 'a/{bdeghj}/k']],
    ['a/{b{c,d}e{f,g},h{i,j}}/k', {}, ['a/bcef/k', 'a/bceg/k', 'a/bdef/k', 'a/bdeg/k', 'a/hi/k', 'a/hj/k']],
    ['a/{x,z}{b,{c,d}/{e,f},g}/h', {}, ['a/xb/h', 'a/xc/e/h', 'a/xc/f/h', 'a/xd/e/h', 'a/xd/f/h', 'a/xg/h', 'a/zb/h', 'a/zc/e/h', 'a/zc/f/h', 'a/zd/e/h', 'a/zd/f/h', 'a/zg/h']],
    ['a/{{a,b}/{c,d}}/z', {}, ['a/{a/c}/z', 'a/{a/d}/z', 'a/{b/c}/z', 'a/{b/d}/z']],
    ['a/{{b,c}/{d,e}}', {}, ['a/{b/d}', 'a/{b/e}', 'a/{c/d}', 'a/{c/e}']],
    ['a/{{b,c}/{d,e}}/f', {}, ['a/{b/d}/f', 'a/{b/e}/f', 'a/{c/d}/f', 'a/{c/e}/f']],
    ['a{b}c', {}, ['a{b}c']],
    ['foo {1,2} bar', {}, ['foo 1 bar', 'foo 2 bar']],
    ['{ }', {}, ['{ }']],
    ['{', {}, ['{']],
    ['{a,b,{c,d},e}', {}, ['a', 'b', 'c', 'd', 'e']],
    ['{a,b,{c,d}e}', {}, ['a', 'b', 'ce', 'de']],
    ['{a,b,{c,d}}', {}, ['a', 'b', 'c', 'd']],
    ['{a,b{c,d}}', {}, ['a', 'bc', 'bd']],
    ['{a,b}/{c,d}', {}, ['a/c', 'a/d', 'b/c', 'b/d']],
    ['{a,b}c,d\\}', {}, ['ac,d}', 'bc,d}']],
    ['{a,b\\}c,d}', {}, ['a', 'b}c', 'd']],
    ['{a,b}{c,d}', {}, ['ac', 'ad', 'bc', 'bd']],
    ['{abc}', {}, ['{abc}']],
    ['{b{c,d},e}', {}, ['bc', 'bd', 'e']],
    ['{b{c,d},e}/f', {}, ['bc/f', 'bd/f', 'e/f']],
    ['x,y,{abc},trie', {}, ['x,y,{abc},trie']],
    ['{{a,b},{c,d}}', {}, ['a', 'b', 'c', 'd']],
    ['{{a,b}/{c,d}}', {}, ['{a/c}', '{a/d}', '{b/c}', '{b/d}']],
    ['{{a,b}/{c,d}}/z', {}, ['{a/c}/z', '{a/d}/z', '{b/c}/z', '{b/d}/z']],
    ['{}', {}, ['{}']],

    // // should ignore globs
    ['}', {}, ['}']],

    // 'should ignore globs',

    ['{generate,{assemble,update,verb}{file,-generate-*},generator}.js', {}, ['generate.js', 'assemblefile.js', 'assemble-generate-*.js', 'updatefile.js', 'update-generate-*.js', 'verbfile.js', 'verb-generate-*.js', 'generator.js']],
    ['**/{foo,bar}.js', {}, ['**/foo.js', '**/bar.js']],
    ['**/{a,b,c}/*.js', {}, ['**/a/*.js', '**/b/*.js', '**/c/*.js']],
    ['**/{a,b,*}/*.js', {}, ['**/a/*.js', '**/b/*.js', '**/*/*.js']],
    ['**/{**,b,*}/*.js', {}, ['**/**/*.js', '**/b/*.js', '**/*/*.js']],
    ['/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', {}, ['/usr/ucb/ex', '/usr/ucb/edit', '/usr/lib/ex', '/usr/lib/how_ex']],
    ['ff{c,b,a}', {}, ['ffc', 'ffb', 'ffa']],
    ['f{d,e,f}g', {}, ['fdg', 'feg', 'ffg']],
    ['{a,b,c}', {}, ['a', 'b', 'c']],
    ['{l,m,n}xyz', {}, ['lxyz', 'mxyz', 'nxyz']],
    ['a/{a,b}/{c,d}/e', {}, ['a/a/c/e', 'a/a/d/e', 'a/b/c/e', 'a/b/d/e']],
    ['a{b,c}d{e,f}g', {}, ['abdeg', 'abdfg', 'acdeg', 'acdfg']],
    ['a/{x,y}/c{d,e}f.{md,txt}', {}, ['a/x/cdf.md', 'a/x/cdf.txt', 'a/x/cef.md', 'a/x/cef.txt', 'a/y/cdf.md', 'a/y/cdf.txt', 'a/y/cef.md', 'a/y/cef.txt']],
    ['{a,b}{{a,b},a,b}', {}, ['aa', 'ab', 'aa', 'ab', 'ba', 'bb', 'ba', 'bb']],
    ['a{b,c{d,e}f}g', {}, ['abg', 'acdfg', 'acefg']],
    ['a{{x,y},z}b', {}, ['axb', 'ayb', 'azb']],
    ['f{x,y{g,z}}h', {}, ['fxh', 'fygh', 'fyzh']],
    ['a{b,c{d,e},h}x/z', {}, ['abx/z', 'acdx/z', 'acex/z', 'ahx/z']],
    ['a{b,c{d,e},h}x{y,z}', {}, ['abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'ahxy', 'ahxz']],
    ['a{b,c{d,e},{f,g}h}x{y,z}', {}, ['abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'afhxy', 'afhxz', 'aghxy', 'aghxz']],

    // 'should not expand escaped braces',

    ['\\{a,b,c,d,e}', {}, ['{a,b,c,d,e}']],
    ['a/\\{b,c}/{d,e}/f', {}, ['a/{b,c}/d/f', 'a/{b,c}/e/f']],
    ['a/\\{x,y}/cde', {}, ['a/{x,y}/cde']],
    ['a/b/c/{x,y\\}', {}, ['a/b/c/{x,y}']],
    ['a/{z,\\{a,b,c,d,e}/d', {}, ['a/z/d', 'a/{a/d', 'a/b/d', 'a/c/d', 'a/d/d', 'a/e/d']],
    ['abcd{efgh', {}, ['abcd{efgh']],
    ['{a,b\\}c,d}', {}, ['a', 'b}c', 'd']],
    ['{abc}', {}, ['{abc}']],
    ['{x,y,\\{a,b,c\\}}', {}, ['x', 'y', '{a', 'b', 'c}']],
    ['{x,y,{abc},trie}', {}, ['x', 'y', '{abc}', 'trie']],
    ['{x,y,{a,b,c\\}}', {}, ['{x,y,a', '{x,y,b', '{x,y,c}']],

    'should not expand escaped commas',

    ['{x\\,y,\\{abc\\},trie}', {}, ['x,y', '{abc}', 'trie']],
    ['a{b\\,c\\,d}e', {}, ['a{b,c,d}e']],
    ['a{b\\,c}d', {}, ['a{b,c}d']],
    ['{abc\\,def}', {}, ['{abc,def}']],
    ['{abc\\,def,ghi}', {}, ['abc,def', 'ghi']],
    ['a/{b,c}/{x\\,y}/d/e', {}, ['a/b/{x,y}/d/e', 'a/c/{x,y}/d/e']],

    'should handle empty braces',

    ['{ }', {}, ['{ }']],
    ['{', {}, ['{']],
    ['{}', {}, ['{}']],
    ['}', {}, ['}']],

    'should escape braces when only one value is defined',

    ['a{b}c', {}, ['a{b}c']],
    ['a/b/c{d}e', {}, ['a/b/c{d}e']],

    'should escape closing braces when open is not defined',

    ['{a,b}c,d}', {}, ['ac,d}', 'bc,d}']],

    'should not expand braces in sets with es6/bash-like variables',

    ['abc/${ddd}/xyz', {}, ['abc/${ddd}/xyz']],
    ['a${b}c', {}, ['a${b}c']],
    ['a/{${b},c}/d', {}, ['a/${b}/d', 'a/c/d']],
    ['a${b,d}/{foo,bar}c', {}, ['a${b,d}/fooc', 'a${b,d}/barc']],

    'should support sequence brace operators',

    ['ff{a,b,c}', {}, ['ffa', 'ffb', 'ffc']],
    ['f{d,e,f}g', {}, ['fdg', 'feg', 'ffg']],
    ['{a,b,c}', {}, ['a', 'b', 'c']],
    ['{l,m,n}xyz', {}, ['lxyz', 'mxyz', 'nxyz']],

    'should expand multiple sets',

    ['a/{a,b}/{c,d}/e', {}, ['a/a/c/e', 'a/a/d/e', 'a/b/c/e', 'a/b/d/e']],
    ['a{b,c}d{e,f}g', {}, ['abdeg', 'abdfg', 'acdeg', 'acdfg']],
    ['a/{x,y}/c{d,e}f.{md,txt}', {}, ['a/x/cdf.md', 'a/x/cdf.txt', 'a/x/cef.md', 'a/x/cef.txt', 'a/y/cdf.md', 'a/y/cdf.txt', 'a/y/cef.md', 'a/y/cef.txt']],

    'should expand nested sets',

    ['a{b,c{d,e}f}g', {}, ['abg', 'acdfg', 'acefg']],
    ['a{{x,y},z}b', {}, ['axb', 'ayb', 'azb']],
    ['f{x,y{g,z}}h', {}, ['fxh', 'fygh', 'fyzh']],
    ['a{b,c{d,e},h}x/z', {}, ['abx/z', 'acdx/z', 'acex/z', 'ahx/z']],
    ['a{b,c{d,e},h}x{y,z}', {}, ['abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'ahxy', 'ahxz']],
    ['a{b,c{d,e},{f,g}h}x{y,z}', {}, ['abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'afhxy', 'afhxz', 'aghxy', 'aghxz']],
    ['a-{b{d,e}}-c', {}, ['a-{bd}-c', 'a-{be}-c']],

    'should do nothing to glob characters',

    ['a/b/{d,e}/*.js', {}, ['a/b/d/*.js', 'a/b/e/*.js']],
    ['a/**/c/{d,e}/f*.js', {}, ['a/**/c/d/f*.js', 'a/**/c/e/f*.js']],
    ['a/**/c/{d,e}/f*.{md,txt}', {}, ['a/**/c/d/f*.md', 'a/**/c/d/f*.txt', 'a/**/c/e/f*.md', 'a/**/c/e/f*.txt']],
    ['a/b/{d,e,[1-5]}/*.js', {}, ['a/b/d/*.js', 'a/b/e/*.js', 'a/b/[1-5]/*.js']],

    'should work with leading and trailing commas',
    ['a{b,}c', {}, ['abc', 'ac']],
    ['a{,b}c', {}, ['ac', 'abc']],

    'should handle spaces',
    ['a{ ,c{d, },h}x', {}, ['a x', 'acdx', 'ac x', 'ahx']],
    ['a{ ,c{d, },h} ', {}, ['a  ', 'acd ', 'ac  ', 'ah ']],

    'see https://github.com/jonschlinkert/microequal/issues/66',
    ['/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.{html,ejs}', {}, ['/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.html', '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.ejs']],

    'should handle weirdly-formed brace expansions (fixed in post-bash-3.1)',

    ['a-{b{d,e}}-c', {}, ['a-{bd}-c', 'a-{be}-c']],
    ['a-{bdef-{g,i}-c', {}, ['a-{bdef-g-c', 'a-{bdef-i-c']],

    // 'should not expand quoted strings',

    ['{"foo"}{1,2,3}', {}, ['{foo}1', '{foo}2', '{foo}3']],
    ['{"foo"}{1,2,3}', { keepQuotes: true }, ['{"foo"}1', '{"foo"}2', '{"foo"}3']],
    ['{"x,x"}', { keepQuotes: true }, ['{"x,x"}']],
    ['{\'x,x\'}', { keepQuotes: true }, ['{\'x,x\'}']],

    'should escape outer braces in nested non-sets',

    ['{a-{b,c,d}}', {}, ['{a-b}', '{a-c}', '{a-d}']],
    ['{a,{a-{b,c,d}}}', {}, ['a', '{a-b}', '{a-c}', '{a-d}']],

    'should escape imbalanced braces',

    ['abc{', {}, ['abc{']],
    ['{abc{', {}, ['{abc{']],
    ['{abc', {}, ['{abc']],
    ['}abc', {}, ['}abc']],
    ['ab{c', {}, ['ab{c']],
    ['ab{c', {}, ['ab{c']],
    ['{{a,b}', {}, ['{a', '{b']],
    ['{a,b}}', {}, ['a}', 'b}']],
    ['a{b{c{d,e}f}gh', {}, ['a{b{cdf}gh', 'a{b{cef}gh']],
    ['a{b{c{d,e}f}g}h', {}, ['a{b{cdf}g}h', 'a{b{cef}g}h']],
    ['f{x,y{{g,z}}h}', {}, ['fx', 'fy{g}h', 'fy{z}h']],
    ['z{a,b},c}d', {}, ['za,c}d', 'zb,c}d']],
    ['a{b{c{d,e}f{x,y{{g}h', {}, ['a{b{cdf{x,y{{g}h', 'a{b{cef{x,y{{g}h']],
    ['f{x,y{{g}h', {}, ['f{x,y{{g}h']],
    ['f{x,y{{g}}h', {}, ['f{x,y{{g}}h']],
    ['a{b{c{d,e}f{x,y{}g}h', {}, ['a{b{cdfxh', 'a{b{cdfy{}gh', 'a{b{cefxh', 'a{b{cefy{}gh']],
    ['f{x,y{}g}h', {}, ['fxh', 'fy{}gh']],
    ['z{a,b{,c}d', {}, ['z{a,bd', 'z{a,bcd']]
  ];

  fixtures.forEach(arr => {
    if (typeof arr === 'string') {
      return;
    }

    const options = { ...arr[1] };
    const pattern = arr[0];
    const expected = arr[2];

    if (options.skip !== true) {
      it('should compile: ' + pattern, () => equal(pattern, expected, options));
    }
  });
});
