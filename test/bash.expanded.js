'use strict';

var extend = require('extend-shallow');
var stringify = require('./support/stringify');
var reference = require('./support/reference');
var support = require('./support/compare');
var compare, tests = {};

describe('compiler', function() {
  beforeEach(function() {
    compare = support(tests, 'expand', {expand: true, optimize: false});
  });

  var fixtures = [
    ['0{1..9} {10..20}', {}],
    ['\\{a,b,c,d,e}', {}],
    ['a${b}c', {}],
    ['a/\\{b,c,d,{x,y}}{e,f\\}/g', {}],
    ['a/\\{b,c,d\\}\\{e,f\\}/g', {}],
    ['a/\\{b,c,d\\}\\{e,f}/g', {}],
    ['a/\\{b,c,d\\}{e,f}/g', {}],
    ['a/\\{b,c,d{x,y}}{e,f\\}/g', {}],
    ['a/\\{b,c,d}{e,f\\}/g', {}],
    ['a/\\{b,c,d}{e,f}/g', {}],
    ['a/\\{x,y}/cde', {}],
    ['a/\\{{b,c}{e,f}/g', {}],
    ['a/\\{{b,c}{e,f}\\}/g', {}],
    ['a/\\{{b,c}{e,f}}/g', {}],
    ['a/b/c/{x,y\\}', {}],
    ['a/b/c{d}e', {}],
    ['a/b/{b,c,{d,e{f,g},{w,x}/{y,z}}}/h/i', {}],
    ['a/{${b},c}/d', {}],
    ['a/{b,c,d}{e,f}/g', {}],
    ['a/{b,c\\,d}{e,f}/g', {}],
    ['a/{b,c\\}}{e,f}/g', {}],
    ['a/{b,c}', {}],
    ['a/{b,c}d{e,f}/g', {}],
    ['a/{b,c}{e,f}/g', {}],
    ['a/{b,c}{e,f}{g,h,i}/k', {}],
    ['a/{b,{c,d},e}/f', {}],
    ['a/{b,{c,d}/{e,f},g}/h', {}],
    ['a/{b{c,d},e{f,g}h{i,j}}/k', {}],
    ['a/{b{c,d},e}/f', {}],
    ['a/{b{c,d}e{f,g}h{i,j}}/k', {}],
    ['a/{b{c,d}e{f,g},h{i,j}}/k', {}],
    ['a/{x,y}/{1..5}c{d,e}f.{md,txt}', {}],
    ['a/{x,z}{b,{c,d}/{e,f},g}/h', {}],
    ['a/{x,{1..5},y}/c{d}e', {}],
    ['a/{{a,b}/{c,d}}/z', {}],
    ['a/{{b,c}/{d,e}}', {}],
    ['a/{{b,c}/{d,e}}/f', {}],
    ['abc/${ddd}/xyz', {}],
    ['abcd{efgh', {}],
    ['a{ ,c{d, },h} ', {}],
    ['a{ ,c{d, },h}x', {}],
    ['a{0..3}d', {}],
    ['a{b{c{d,e}f{x,y{{g}h', {}],
    ['a{b}c', {}],
    ['foo {1,2} bar', {}],
    ['x{10..1}y', {}],
    ['x{3..3}y', {}],
    ['{ }', {}],
    ['{', {}],
    ['{0..10,braces}', {}],
    ['{1..0f}', {}],
    ['{1..10,braces}', {}],
    ['{1..10..ff}', {}],
    ['{1..10.f}', {}],
    ['{1..10f}', {}],
    ['{1..10}', {}],
    ['{1..20..2f}', {bash: false}],
    ['{1..20..f2}', {}],
    ['{1..2f..2}', {bash: false}],
    ['{1..3}', {}],
    ['{1..9}', {}],
    ['{1..ff}', {}],
    ['{1.20..2}', {}],
    ['{10..1}', {}],
    // ['{214748364..2147483649}', {}],
    // ['{2147483645..2147483649}', {}],
    ['{3..3}', {}],
    ['{5..8}', {}],
    ['{9..-4}', {}],
    ['{a,b,{c,d},e}', {}],
    ['{a,b,{c,d}e}', {}],
    ['{a,b,{c,d}}', {}],
    ['{a,b{c,d}}', {}],
    ['{a,b}/{c,d}', {}],
    ['{a,b}c,d\\}', {}],
    ['{a,b\\}c,d}', {}],
    ['{a,b}{c,d}', {}],
    ['{abc}', {}],
    ['{b{c,d},e}', {}],
    ['{b{c,d},e}/f', {}],
    ['{x,y,\\{a,b,c\\}}', {}],
    ['{x,y,{a,b,c\\}}', {}],
    ['{x,y,{abc},trie}', {}],
    ['x,y,{abc},trie', {}],
    ['{x\\,y,\\{abc\\},trie}', {}],
    ['{{0..10},braces}', {}],
    ['{{a,b},{c,d}}', {}],
    ['{{a,b}/{c,d}}', {}],
    ['{{a,b}/{c,d}}/z', {}],
    ['{}', {}],
    ['}', {}],

    // should ignore globs
    ['{generate,{assemble,update,verb}{file,-generate-*},generator}.js', {}],
    ['**/{foo,bar}.js', {}],
    ['**/{1..5}/a.js', {}],
    ['**/{a,b,c}/*.js', {}],
    ['**/{a,b,*}/*.js', {}],
    ['**/{**,b,*}/*.js', {}],

    ['/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', {}],
    ['ff{c,b,a}', {}],
    ['f{d,e,f}g', {}],
    ['x{{0..10},braces}y', {}],
    ['{1..10}', {}],
    ['{a,b,c}', {}],
    ['{braces,{0..10}}', {}],
    ['{l,n,m}xyz', {}],
    ['{{0..10},braces}', {}],
    ['{{1..10..2},braces}', {bash: false}],
    ['{{1..10},braces}', {}],

    ['a/{a,b}/{c,d}/e', {}],
    ['a{b,c}d{e,f}g', {}],
    ['a/{x,y}/c{d,e}f.{md,txt}', {}],
    ['{a,b}{{a,b},a,b}', {}],
    ['/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', {}],
    ['a{b,c{d,e}f}g', {}],
    ['a{{x,y},z}b', {}],
    ['f{x,y{g,z}}h', {}],
    ['a{b,c{d,e},h}x/z', {}],
    ['a{b,c{d,e},h}x{y,z}', {}],
    ['a{b,c{d,e},{f,g}h}x{y,z}', {}],

    // should handle invalid sets
    ['{0..10,braces}', {}],
    ['{1..10,braces}', {}],

    // should not expand escaped braces
    ['\\{a,b,c,d,e}', {}],
    ['a/b/c/{x,y\\}', {}],
    ['a/\\{x,y}/cde', {}],
    ['abcd{efgh', {}],
    ['{abc}', {}],
    ['{x,y,\\{a,b,c\\}}', {}],
    ['{x,y,{a,b,c\\}}', {}],
    ['{x,y,{abc},trie}', {}],
    ['{x\\,y,\\{abc\\},trie}', {}],

    // should handle spaces
    // Bash 4.3 says the following should be equivalent to `foo|(1|2)|bar
    // That makes sense in Bash, since ' ' is a separator, but not here
    ['foo {1,2} bar', {}],
    ['0{1..9} {10..20}', {}],
    ['a{ ,c{d, },h}x', {}],
    ['a{ ,c{d, },h} ', {}],

    // should handle empty braces
    ['{ }', {}],
    ['{', {}],
    ['{}', {}],
    ['}', {}],

    // should escape braces when only one value is defined
    ['a{b}c', {}],
    ['a/b/c{d}e', {}],

    // should escape closing braces when open is not defined
    ['{a,b}c,d}', {}],

    // should not expand braces in sets with es6/bash-like variables
    ['abc/${ddd}/xyz', {}],
    ['a${b}c', {}],
    ['a/{${b},c}/d', {}],
    ['a${b,d}/{foo,bar}c', {}],

    // should not expand escaped commas
    ['a{b\\,c\\,d}e', {}],
    ['a{b\\,c}d', {}],
    ['{abc\\,def}', {}],
    ['{abc\\,def,ghi}', {}],
    ['a/{b,c}/{x\\,y}/d/e', {}],

    // should not expand escaped braces
    ['{a,b\\}c,d}', {}],
    ['\\{a,b,c,d,e}', {}],
    ['a/{z,\\{a,b,c,d,e}/d', {}],
    ['a/\\{b,c}/{d,e}/f', {}],
    ['./\\{x,y}/{a..z..3}/', {bash: false}],

    // should not expand escaped braces or commas
    ['{x\\,y,\\{abc\\},trie}', {}],

    // should support sequence brace operators
    ['/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', {}],
    ['ff{c,b,a}', {}],
    ['f{d,e,f}g', {}],
    ['x{{0..10},braces}y', {}],
    ['{1..10}', {}],
    ['{a,b,c}', {}],
    ['{braces,{0..10}}', {}],
    ['{l,n,m}xyz', {}],
    ['{{0..10},braces}', {}],
    ['{{1..10..2},braces}', {bash: false}],
    ['{{1..10},braces}', {}],

    // should expand multiple sets
    ['a/{a,b}/{c,d}/e', {}],
    ['a{b,c}d{e,f}g', {}],
    ['a/{x,y}/c{d,e}f.{md,txt}', {}],

    // should expand nested sets
    ['{a,b}{{a,b},a,b}', {}],
    ['/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', {}],
    ['a{b,c{d,e}f}g', {}],
    ['a{{x,y},z}b', {}],
    ['f{x,y{g,z}}h', {}],
    ['a{b,c{d,e},h}x/z', {}],
    ['a{b,c{d,e},h}x{y,z}', {}],
    ['a{b,c{d,e},{f,g}h}x{y,z}', {}],

    // should expand with globs
    ['a/b/{d,e}/*.js', {}],
    ['a/**/c/{d,e}/f*.js', {}],
    ['a/**/c/{d,e}/f*.{md,txt}', {}],

    // should expand with extglobs (TODO
    ['a/b/{d,e,[1-5]}/*.js', {}],

    // should work with leading and trailing commas
    ['a{b,}c', {}],
    ['a{,b}c', {}],

    // should handle spaces
    ['0{1..9} {10..20}', {}],
    ['a{ ,c{d, },h}x', {}],
    ['a{ ,c{d, },h} ', {}],

    // see https://github.com/jonschlinkert/micromatch/issues/66
    ['/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.{html,ejs}', {}],

    // should not try to expand ranges with decimals
    ['{1.1..2.1}', {}],
    ['{1.1..~2.1}', {}],

    // should escape invalid ranges
    ['{1..0f}', {}],
    ['{1..10..ff}', {}],
    ['{1..10.f}', {}],
    ['{1..10f}', {}],
    ['{1..20..2f}', {bash: false}],
    ['{1..20..f2}', {}],
    ['{1..2f..2}', {bash: false}],
    ['{1..ff..2}', {bash: false}],
    ['{1..ff}', {}],
    ['{1.20..2}', {}],

    // should handle weirdly-formed brace expansions (fixed in post-bash-3.1)
    ['a-{b{d,e}}-c', {}],
    ['a-{bdef-{g,i}-c', {}],

    // should not expand quoted strings
    ['{"klklkl"}{1,2,3}', {}],
    ['{"x,x"}', {}],

    // should escaped outer braces in nested non-sets
    ['{a-{b,c,d}}', {}],
    ['{a,{a-{b,c,d}}}', {}],

    // should escape imbalanced braces
    ['abc{', {}],
    ['{abc{', {}],
    ['{abc', {}],
    ['}abc', {}],
    ['ab{c', {}],
    ['ab{c', {}],
    ['{{a,b}', {}],
    ['{a,b}}', {}],
    ['abcd{efgh', {}],
    ['a{b{c{d,e}f}g}h', {}],
    ['f{x,y{{g,z}}h}', {}],
    ['z{a,b},c}d', {}],
    ['a{b{c{d,e}f{x,y{{g}h', {}],
    ['f{x,y{{g}h', {}],
    ['f{x,y{{g}}h', {skip: true}],
    ['a{b{c{d,e}f{x,y{}g}h', {}],
    ['f{x,y{}g}h', {}],
    ['z{a,b{,c}d', {}],

    // should expand numeric ranges
    ['a{0..3}d', {}],
    ['x{10..1}y', {}],
    ['x{3..3}y', {}],
    ['{1..10}', {}],
    ['{1..3}', {}],
    ['{1..9}', {}],
    ['{10..1}', {}],
    ['{10..1}y', {}],
    ['{3..3}', {}],
    ['{5..8}', {}],

    // should expand ranges with negative numbers
    ['{-10..-1}', {}],
    ['{-20..0}', {}],
    ['{0..-5}', {}],
    ['{9..-4}', {}],

    // should expand alphabetical ranges
    ['0{1..9}/{10..20}', {}],
    ['0{a..d}0', {}],
    ['a/{b..d}/e', {}],
    ['{1..f}', {bash: false, minimatch: false}], //<= minimatch fails
    ['{a..A}', {bash: false}],
    ['{A..a}', {bash: false}],
    ['{a..e}', {}],
    ['{A..E}', {}],
    ['{a..f}', {}],
    ['{a..z}', {}],
    ['{E..A}', {}],
    ['{f..1}', {bash: false, minimatch: false}], //<= minimatch fails
    ['{f..a}', {}],
    ['{f..f}', {}],

    // should expand multiple ranges
    ['a/{b..d}/e/{f..h}', {}],

    // should expand numerical ranges - positive and negative
    ['{-10..10}', {}],

    // HEADS UP! If you're using the `--mm` flag minimatch freezes on these
    // should expand large numbers
    // ['{2147483645..2147483649}', {minimatch: false, bash: false, optimize: true, skip: true}],
    // ['{214748364..2147483649}', {minimatch: false, bash: false, optimize: true, skip: true}],

    // should expand ranges using steps
    ['{1..10..1}', {bash: false, optimize: false}],
    ['{1..10..2}', {bash: false, optimize: false}],
    ['{1..20..20}', {bash: false, optimize: false}],
    ['{1..20..20}', {bash: false, optimize: false}],
    ['{1..20..20}', {bash: false, optimize: false}],
    ['{1..20..2}', {bash: false, optimize: false}],
    ['{10..0..2}', {bash: false, optimize: false}],
    ['{10..1..2}', {bash: false, optimize: false}],
    ['{100..0..5}', {bash: false, optimize: false}],
    ['{2..10..1}', {bash: false, optimize: false}],
    ['{2..10..2}', {bash: false, optimize: false}],
    ['{2..10..3}', {bash: false, optimize: false}],
    ['{a..z..2}', {bash: false, optimize: false}],

    // should expand positive ranges with negative steps
    ['{10..0..-2}', {bash: false, optimize: false}],

    // should expand negative ranges using steps
    ['{-1..-10..-2}', {bash: false, optimize: false}],
    ['{-1..-10..2}', {bash: false, optimize: false}],
    ['{-10..-2..2}', {bash: false, optimize: false}],
    ['{-2..-10..1}', {bash: false, optimize: false}],
    ['{-2..-10..2}', {bash: false, optimize: false}],
    ['{-2..-10..3}', {bash: false, optimize: false}],
    ['{-50..-0..5}', {bash: false, optimize: false}],
    ['{-9..9..3}', {bash: false, optimize: false}],
    ['{10..1..-2}', {bash: false, optimize: false}],
    ['{100..0..-5}', {bash: false, optimize: false}],

    // should expand alpha ranges with steps
    ['{a..e..2}', {bash: false, optimize: false}],
    ['{E..A..2}', {bash: false, optimize: false}],
    ['{a..z}', {}],
    ['{a..z..2}', {bash: false, optimize: false}],
    ['{z..a..-2}', {bash: false, optimize: false}],

    // should expand alpha ranges with negative steps
    ['{z..a..-2}', {bash: false, optimize: false}],

    // should handle unwanted zero-padding (fixed post-bash-4.0)
    ['{10..0..2}', {bash: false, optimize: false}],
    ['{10..0..-2}', {bash: false, optimize: false}],
    ['{-50..-0..5}', {bash: false, optimize: false}],

    // should work with dots in file paths
    ['../{1..3}/../foo', {}],
    ['../{2..10..2}/../foo', {bash: false, optimize: false}],
    ['../{1..3}/../{a,b,c}/foo', {}],
    ['./{a..z..3}/', {bash: false, optimize: false}],
    ['./{"x,y"}/{a..z..3}/', {bash: false, minimatch: false, optimize: false}], //<= minimatch fails

    // should expand a complex combination of ranges and sets
    ['a/{x,y}/{1..5}c{d,e}f.{md,txt}', {}],

    // should expand complex sets and ranges in `bash` mode
    ['a/{x,{1..5},y}/c{d}e', {}]
  ];

  fixtures.forEach(function(arr) {
    var opts = extend({}, arr[1], {optimize: false, expand: true});
    var str = arr[0];
    // if (str !== 'a/{{b,c}/{d,e}}/f') return;

    it('should compile: ' + str, function() {
      if (opts.skip === true) {
        this.skip();
        return;
      }
      compare(str, reference(str, opts), opts);
    });
  });
});
