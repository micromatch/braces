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
 * Bash 4.3 unit tests with `braces.expand()`
 */

describe('bash sets - braces.compile()', () => {
  const fixtures = [
    ['{a,b,c,d,e}', {}, '(a|b|c|d|e)'],
    ['a/\\{b,c,d,{x,y}}{e,f\\}/g', {}, 'a/{b,c,d,(x|y)}{e,f}/g'],
    ['a/\\{b,c,d\\}\\{e,f\\}/g', {}, 'a/{b,c,d}{e,f}/g'],
    ['a/\\{b,c,d\\}\\{e,f}/g', {}, 'a/{b,c,d}{e,f}/g'],
    ['a/\\{b,c,d\\}{e,f}/g', {}, 'a/{b,c,d}(e|f)/g'],
    ['a/\\{b,c,d{x,y}}{e,f\\}/g', {}, 'a/{b,c,d(x|y)}{e,f}/g'],
    ['a/\\{b,c,d}{e,f\\}/g', {}, 'a/{b,c,d}{e,f}/g'],
    ['a/\\{b,c,d}{e,f}/g', {}, 'a/{b,c,d}(e|f)/g'],
    ['a/\\{{b,c}{e,f}/g', {}, 'a/{(b|c)(e|f)/g'],
    ['a/\\{{b,c}{e,f}\\}/g', {}, 'a/{(b|c)(e|f)}/g'],
    ['a/\\{{b,c}{e,f}}/g', {}, 'a/{(b|c)(e|f)}/g'],
    ['a/b/{b,c,{d,e{f,g},{w,x}/{y,z}}}/h/i', {}, 'a/b/(b|c|(d|e(f|g)|(w|x)/(y|z)))/h/i'],
    ['a/{b,c}}{e,f}/g', {}, 'a/(b|c)}(e|f)/g'],
    ['a/{b,c\\,d}{e,f}/g', {}, 'a/(b|c,d)(e|f)/g'],
    ['a/{b,c\\}}{e,f}/g', {}, 'a/(b|c})(e|f)/g'],
    ['a/{b,c}', {}, 'a/(b|c)'],
    ['a/{b,c}d{e,f}/g', {}, 'a/(b|c)d(e|f)/g'],
    ['a/{b,c}{e,f}/g', {}, 'a/(b|c)(e|f)/g'],
    ['a/{b,c}{e,f}{g,h,i}/k', {}, 'a/(b|c)(e|f)(g|h|i)/k'],
    ['a/{b,{c,d},e}/f', {}, 'a/(b|(c|d)|e)/f'],
    ['a/{b,{c,d}/{e,f},g}/h', {}, 'a/(b|(c|d)/(e|f)|g)/h'],
    ['a/{b{c,d},e{f,g}h{i,j}}/k', {}, 'a/(b(c|d)|e(f|g)h(i|j))/k'],
    ['a/{b{c,d},e}/f', {}, 'a/(b(c|d)|e)/f'],
    ['a/{b{c,d}e{f,g}h{i,j}}/k', {}, 'a/{b(c|d)e(f|g)h(i|j)}/k'],
    ['a/{b{c,d}e{f,g},h{i,j}}/k', {}, 'a/(b(c|d)e(f|g)|h(i|j))/k'],
    ['a/{x,z}{b,{c,d}/{e,f},g}/h', {}, 'a/(x|z)(b|(c|d)/(e|f)|g)/h'],
    ['a/{{a,b}/{c,d}}/z', {}, 'a/{(a|b)/(c|d)}/z'],
    ['a/{{b,c}/{d,e}}', {}, 'a/{(b|c)/(d|e)}'],
    ['a/{{b,c}/{d,e}}/f', {}, 'a/{(b|c)/(d|e)}/f'],
    ['a{b{c{d,e}f{x,y{{g}h', {}, 'a{b{c(d|e)f{x,y{{g}h'],
    ['{a,b,{c,d},e}', {}, '(a|b|(c|d)|e)'],
    ['{a,b,{c,d}e}', {}, '(a|b|(c|d)e)'],
    ['{a,b,{c,d}}', {}, '(a|b|(c|d))'],
    ['{a,b{c,d}}', {}, '(a|b(c|d))'],
    ['{a,b}/{c,d}', {}, '(a|b)/(c|d)'],
    ['{a,b}{c,d}', {}, '(a|b)(c|d)'],

    ['{{a,b},{c,d}}', {}, '((a|b)|(c|d))'],
    ['{{a,b}/{c,d}}', {}, '{(a|b)/(c|d)}'],
    ['{{a,b}/{c,d}}/z', {}, '{(a|b)/(c|d)}/z'],

    // should not process glob characters
    ['{generate,{assemble,update,verb}{file,-generate-*},generator}.js', {}, '(generate|(assemble|update|verb)(file|-generate-*)|generator).js'],
    ['**/{foo,bar}.js', {}, '**/(foo|bar).js'],
    ['**/{a,b,c}/*.js', {}, '**/(a|b|c)/*.js'],
    ['**/{a,b,*}/*.js', {}, '**/(a|b|*)/*.js'],
    ['**/{**,b,*}/*.js', {}, '**/(**|b|*)/*.js'],

    // should not expand escaped braces
    ['\\{a,b,c,d,e}', {}, '{a,b,c,d,e}'],
    ['a/b/c/{x,y\\}', {}, 'a/b/c/{x,y}'],
    ['a/\\{x,y}/cde', {}, 'a/{x,y}/cde'],
    ['abcd{efgh', {}, 'abcd{efgh'],
    ['\\{abc\\}', {}, '{abc}'],
    ['{x,y,\\{a,b,c\\}}', {}, '(x|y|{a|b|c})'],
    ['{x,y,{a,b,c\\}}', {}, '{x,y,(a|b|c})'],
    ['{x,y,{abc},trie}', {}, '(x|y|{abc}|trie)'],
    ['x,y,{abc},trie', {}, 'x,y,{abc},trie'],
    ['{b{c,d},e}', {}, '(b(c|d)|e)'],
    ['{b{c,d},e}/f', {}, '(b(c|d)|e)/f'],
    ['{abc}', {}, '{abc}'],

    // should handle empty braces
    ['{ }', {}, '{ }'],
    ['{', {}, '{'],
    ['{}', {}, '{}'],
    ['}', {}, '}'],

    // should escape braces when only one value is defined
    ['a{b}c', {}, 'a{b}c'],
    ['a/b/c{d}e', {}, 'a/b/c{d}e'],

    // should escape closing braces when open is not defined
    ['{a,b}c,d}', {}, '(a|b)c,d}'],
    ['a,b,c,d}', {}, 'a,b,c,d}'],

    // should not expand braces in sets with es6/bash-like variables
    ['abc/${ddd}/xyz', {}, 'abc/${ddd}/xyz'],
    ['a${b}c', {}, 'a${b}c'],
    ['a${b{a,b}}c', {}, 'a${b{a,b}}c'],
    ['a/{${b},c}/d', {}, 'a/(${b}|c)/d'],
    ['a${b,d}/{foo,bar}c', {}, 'a${b,d}/(foo|bar)c'],

    // should not expand escaped commas
    ['a{b\\,c\\,d}e', {}, 'a{b,c,d}e'],
    ['a{b\\,c}d', {}, 'a{b,c}d'],
    ['{abc\\,def}', {}, '{abc,def}'],
    ['{abc\\,def,ghi}', {}, '(abc,def|ghi)'],
    ['a/{b,c}/{x\\,y}/d/e', {}, 'a/(b|c)/{x,y}/d/e'],

    // should not expand escaped braces
    ['{a,b\\}c,d}', {}, '(a|b}c|d)'],
    ['a/{z,\\{a,b,c,d,e}/d', {}, 'a/(z|{a|b|c|d|e)/d'],
    ['a/\\{b,c}/{d,e}/f', {}, 'a/{b,c}/(d|e)/f'],

    // should not expand escaped braces or commas
    ['{x\\,y,\\{abc\\},trie}', {}, '(x,y|{abc}|trie)'],

    // should support sequence brace operators
    ['ff{c,b,a}', {}, 'ff(c|b|a)'],
    ['f{d,e,f}g', {}, 'f(d|e|f)g'],
    ['{a,b,c}', {}, '(a|b|c)'],
    ['{l,n,m}xyz', {}, '(l|n|m)xyz'],

    // should expand multiple sets
    ['a/{a,b}/{c,d}/e', {}, 'a/(a|b)/(c|d)/e'],
    ['a{b,c}d{e,f}g', {}, 'a(b|c)d(e|f)g'],
    ['a/{x,y}/c{d,e}f.{md,txt}', {}, 'a/(x|y)/c(d|e)f.(md|txt)'],

    // should expand nested sets
    ['{a,b}{{a,b},a,b}', {}, '(a|b)((a|b)|a|b)'],
    ['/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', {}, '/usr/(ucb/(ex|edit)|lib/(ex|how_ex))'],
    ['a{b,c{d,e}f}g', {}, 'a(b|c(d|e)f)g'],
    ['a{{x,y},z}b', {}, 'a((x|y)|z)b'],
    ['f{x,y{g,z}}h', {}, 'f(x|y(g|z))h'],
    ['a{b,c{d,e},h}x/z', {}, 'a(b|c(d|e)|h)x/z'],
    ['a{b,c{d,e},h}x{y,z}', {}, 'a(b|c(d|e)|h)x(y|z)'],
    ['a{b,c{d,e},{f,g}h}x{y,z}', {}, 'a(b|c(d|e)|(f|g)h)x(y|z)'],
    ['a-{b{d,e}}-c', {}, 'a-{b(d|e)}-c'],

    // should expand not modify non-brace characters
    ['a/b/{d,e}/*.js', {}, 'a/b/(d|e)/*.js'],
    ['a/**/c/{d,e}/f*.js', {}, 'a/**/c/(d|e)/f*.js'],
    ['a/**/c/{d,e}/f*.{md,txt}', {}, 'a/**/c/(d|e)/f*.(md|txt)'],

    // should work with leading and trailing commas
    ['a{b,}c', {}, 'a(b|)c'],
    ['a{,b}c', {}, 'a(|b)c'],

    // should handle spaces
    // Bash 4.3 says the this first one should be equivalent to `foo|(1|2)|bar
    // That makes sense in Bash, since ' ' is a separator, but not here.
    ['foo {1,2} bar', {}, 'foo (1|2) bar'],
    ['a{ ,c{d, },h}x', {}, 'a( |c(d| )|h)x'],
    ['a{ ,c{d, },h} ', {}, 'a( |c(d| )|h) '],

    // see https://github.com/jonschlinkert/microequal/issues/66
    ['/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.{html,ejs}', {}, '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.(html|ejs)']
  ];

  const seen = new Map();
  const dupes = [];

  for (let i = 0; i < fixtures.length; i++) {
    const fixture = fixtures[i];

    const key = fixture[0] + String(fixture[1].bash);
    if (seen.has(key)) {
      dupes.push(i + 21, fixture[0]);
    } else {

      seen.set(key, i + 21);
    }
  }

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

