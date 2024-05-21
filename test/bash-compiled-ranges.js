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
  assert.deepEqual(braces.compile(input, options), expected);
};

/**
 * Bash 4.3 unit tests with `braces.compile()`
 */

describe('bash ranges - braces.compile()', () => {
  const fixtures = [
    ['a{b,c{1..100}/{foo,bar}/,h}x/z', {}, 'a(b|c([1-9]|[1-9][0-9]|100)/(foo|bar)/|h)x/z'],
    ['0{1..9} {10..20}', {}, '0([1-9]) (1[0-9]|20)'],

    // should not try to expand ranges with decimals
    ['{1.1..2.1}', {}, '{1.1..2.1}'],
    ['{1.1..~2.1}', {}, '{1.1..~2.1}'],

    // should escape invalid ranges
    ['{1..0f}', {}, '{1..0f}'],
    ['{1..10..ff}', {}, '{1..10..ff}'],
    ['{1..10.f}', {}, '{1..10.f}'],
    ['{1..10f}', {}, '{1..10f}'],
    ['{1..20..2f}', {}, '{1..20..2f}'],
    ['{1..20..f2}', {}, '{1..20..f2}'],
    ['{1..2f..2}', {}, '{1..2f..2}'],
    ['{1..ff..2}', {}, '{1..ff..2}'],
    ['{1..ff}', {}, '{1..ff}'],
    ['{1.20..2}', {}, '{1.20..2}'],

    // should handle weirdly-formed brace expansions (fixed in post-bash-3.1)
    ['a-{b{d,e}}-c', {}, 'a-{b(d|e)}-c'],
    ['a-{bdef-{g,i}-c', {}, 'a-{bdef-(g|i)-c'],

    // should not expand quoted strings
    ['{"klklkl"}{1,2,3}', {}, '{klklkl}(1|2|3)'],
    ['{"x,x"}', {}, '{x,x}'],

    // should escaped outer braces in nested non-sets
    ['{a-{b,c,d}}', {}, '{a-(b|c|d)}'],
    ['{a,{a-{b,c,d}}}', {}, '(a|{a-(b|c|d)})'],

    // should escape imbalanced braces
    ['abc{', {}, 'abc{'],
    ['{abc{', {}, '{abc{'],
    ['{abc', {}, '{abc'],
    ['}abc', {}, '}abc'],
    ['ab{c', {}, 'ab{c'],
    ['{{a,b}', {}, '{(a|b)'],
    ['{a,b}}', {}, '(a|b)}'],
    ['abcd{efgh', {}, 'abcd{efgh'],
    ['a{b{c{d,e}f}gh', {}, 'a{b{c(d|e)f}gh'],
    ['a{b{c{d,e}f}g}h', {}, 'a{b{c(d|e)f}g}h'],
    ['f{x,y{{g,z}}h}', {}, 'f(x|y{(g|z)}h)'],
    ['z{a,b},c}d', {}, 'z(a|b),c}d'],
    ['a{b{c{d,e}f{x,y{{g}h', {}, 'a{b{c(d|e)f{x,y{{g}h'],
    ['f{x,y{{g}h', {}, 'f{x,y{{g}h'],
    ['f{x,y{{g}}h', {}, 'f{x,y{{g}}h'],
    ['a{b{c{d,e}f{x,y{}g}h', {}, 'a{b{c(d|e)f(x|y{}g)h'],
    ['f{x,y{}g}h', {}, 'f(x|y{}g)h'],
    ['z{a,b{,c}d', {}, 'z{a,b(|c)d'],

    // should expand numeric ranges
    ['a{0..3}d', {}, 'a([0-3])d'],
    ['x{10..1}y', {}, 'x([1-9]|10)y'],
    ['x{3..3}y', {}, 'x3y'],
    ['{1..10}', {}, '([1-9]|10)'],
    ['{1..3}', {}, '([1-3])'],
    ['{1..9}', {}, '([1-9])'],
    ['{10..1}', {}, '([1-9]|10)'],
    ['{10..1}y', {}, '([1-9]|10)y'],
    ['{3..3}', {}, '3'],
    ['{5..8}', {}, '([5-8])'],

    // should expand ranges with negative numbers
    ['{-10..-1}', {}, '(-[1-9]|-10)'],
    ['{-20..0}', {}, '(-[1-9]|-1[0-9]|-20|0)'],
    ['{0..-5}', {}, '(-[1-5]|0)'],
    ['{9..-4}', {}, '(-[1-4]|[0-9])'],

    // should expand alphabetical ranges
    ['0{1..9}/{10..20}', {}, '0([1-9])/(1[0-9]|20)'],
    ['0{a..d}0', {}, '0([a-d])0'],
    ['a/{b..d}/e', {}, 'a/([b-d])/e'],
    ['{1..f}', {}, '([1-f])'],
    ['{a..A}', {}, '([A-a])'],
    ['{A..a}', {}, '([A-a])'],
    ['{a..e}', {}, '([a-e])'],
    ['{A..E}', {}, '([A-E])'],
    ['{a..f}', {}, '([a-f])'],
    ['{a..z}', {}, '([a-z])'],
    ['{E..A}', {}, '([A-E])'],
    ['{f..1}', {}, '([1-f])'],
    ['{f..a}', {}, '([a-f])'],
    ['{f..f}', {}, 'f'],

    // should expand multiple ranges
    ['a/{b..d}/e/{f..h}', {}, 'a/([b-d])/e/([f-h])'],

    // should expand numerical ranges - positive and negative
    ['{-10..10}', {}, '(-[1-9]|-?10|[0-9])'],

    // HEADS UP! If you're using the `--mm` flag minimatch freezes on these
    // should expand large numbers
    ['{2147483645..2147483649}', {}, '(214748364[5-9])'],
    ['{214748364..2147483649}', {}, '(21474836[4-9]|2147483[7-9][0-9]|214748[4-9][0-9]{2}|214749[0-9]{3}|2147[5-9][0-9]{4}|214[89][0-9]{5}|21[5-9][0-9]{6}|2[2-9][0-9]{7}|[3-9][0-9]{8}|1[0-9]{9}|20[0-9]{8}|21[0-3][0-9]{7}|214[0-6][0-9]{6}|2147[0-3][0-9]{5}|21474[0-7][0-9]{4}|214748[0-2][0-9]{3}|2147483[0-5][0-9]{2}|21474836[0-4][0-9])'],

    // should expand ranges using steps
    ['{1..10..1}', { bash: false }, '([1-9]|10)'],
    ['{1..10..2}', { bash: false }, '(1|3|5|7|9)'],
    ['{1..20..20}', { bash: false }, '1'],
    ['{1..20..2}', { bash: false }, '(1|3|5|7|9|11|13|15|17|19)'],
    ['{10..1..2}', { bash: false }, '(2|4|6|8|10)'],
    ['{100..0..5}', { bash: false }, '(0|5|10|15|20|25|30|35|40|45|50|55|60|65|70|75|80|85|90|95|100)'],
    ['{2..10..1}', { bash: false }, '([2-9]|10)'],
    ['{2..10..2}', { bash: false }, '(2|4|6|8|10)'],
    ['{2..10..3}', { bash: false }, '(2|5|8)'],

    // should expand negative ranges using steps
    ['{-1..-10..-2}', { bash: false }, '(-(?:1|3|5|7|9))'],
    ['{-1..-10..2}', { bash: false }, '(-(?:1|3|5|7|9))'],
    ['{-10..-2..2}', { bash: false }, '(-(?:2|4|6|8|10))'],
    ['{-2..-10..1}', { bash: false }, '(-[2-9]|-10)'],
    ['{-2..-10..2}', { bash: false }, '(-(?:2|4|6|8|10))'],
    ['{-2..-10..3}', { bash: false }, '(-(?:2|5|8))'],
    ['{-9..9..3}', { bash: false }, '(0|3|6|9|-(?:3|6|9))'],
    ['{10..1..-2}', { bash: false }, '(2|4|6|8|10)'],
    ['{100..0..-5}', { bash: false }, '(0|5|10|15|20|25|30|35|40|45|50|55|60|65|70|75|80|85|90|95|100)'],

    // should expand alpha ranges with steps
    ['{a..e..2}', { bash: false }, '(a|c|e)'],
    ['{E..A..2}', { bash: false }, '(E|C|A)'],
    ['{a..z..2}', { bash: false }, '(a|c|e|g|i|k|m|o|q|s|u|w|y)'],

    // should expand alpha ranges with negative steps
    ['{z..a..-2}', { bash: false }, '(z|x|v|t|r|p|n|l|j|h|f|d|b)'],

    // unwanted zero-padding (fixed post-bash-4.0)
    ['{10..0..2}', { bash: false }, '(0|2|4|6|8|10)'],
    ['{10..0..-2}', { bash: false }, '(0|2|4|6|8|10)'],
    ['{-50..-0..5}', { bash: false }, '(0|-(?:5|10|15|20|25|30|35|40|45|50))'],

    // should work with dots in file paths
    ['../{1..3}/../foo', {}, '../([1-3])/../foo'],
    ['../{2..10..2}/../foo', {}, '../(2|4|6|8|10)/../foo'],
    ['../{1..3}/../{a,b,c}/foo', {}, '../([1-3])/../(a|b|c)/foo'],
    ['./{a..z..3}/', {}, './(a|d|g|j|m|p|s|v|y)/'],
    ['./{"x,y"}/{a..z..3}/', { keepQuotes: true }, './{"x,y"}/(a|d|g|j|m|p|s|v|y)/'],

    // should expand a complex combination of ranges and sets
    ['a/{x,y}/{1..5}c{d,e}f.{md,txt}', {}, 'a/(x|y)/([1-5])c(d|e)f.(md|txt)'],

    // should expand complex sets and ranges in `bash` mode
    ['a/{x,{1..5},y}/c{d}e', {}, 'a/(x|([1-5])|y)/c{d}e'],

    // should treat glob characters as literal
    ['**/{1..5}/a.js', {}, '**/([1-5])/a.js'],
    ['x{{0..10},braces}y', {}, 'x(([0-9]|10)|braces)y'],

    // should handle sets with invalid ranges
    ['{0..10,braces}', {}, '(0..10|braces)'],
    ['{1..10,braces}', {}, '(1..10|braces)'],

    ['./\\{x,y}/{a..z..3}/', {}, './{x,y}/(a|d|g|j|m|p|s|v|y)/'],
    ['{braces,{0..10}}', {}, '(braces|([0-9]|10))'],
    ['{{0..10},braces}', {}, '(([0-9]|10)|braces)'],
    ['{{1..10..2},braces}', { bash: false }, '((1|3|5|7|9)|braces)'],
    ['{{1..10..2},braces}', {}, '((1|3|5|7|9)|braces)']
  ];

  fixtures.forEach(arr => {
    if (typeof arr === 'string') {
      return;
    }

    const options = { ...arr[1] };
    const pattern = arr[0];
    const expected = arr[2];

    if (options.skip === true) {
      return;
    }

    it('should compile: ' + pattern, () => {
      equal(pattern, expected, options);
    });
  });
});

