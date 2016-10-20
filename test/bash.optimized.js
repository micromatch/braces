'use strict';

var extend = require('extend-shallow');
var assert = require('assert');
var braces = require('..');

function match(pattern, expected, options) {
  var actual = braces.optimize(pattern, options).sort();
  assert.deepEqual(actual, expected.sort(), pattern);
}

/**
 * Bash 4.3 unit tests with `braces.optimize()`
 */

describe('bash.expanded', function() {
  var fixtures = [
    ['a{b,c{1..100}/{foo,bar}/,h}x/z', {}, ['a(b|c([1-9]|[1-9][0-9]|100)/(foo|bar)/|h)x/z']],
    ['0{1..9} {10..20}', {}, ['0([1-9]) (1[0-9]|20)']],
    ['{a,b,c,d,e}', {}, ['(a|b|c|d|e)']],
    ['\\{a,b,c,d,e}', {}, ['{a,b,c,d,e}']],
    ['a${b}c', {}, ['a${b}c']],
    ['a/\\{b,c,d,{x,y}}{e,f\\}/g', {}, ['a/{b,c,d,(x|y)}{e,f}/g']],
    ['a/\\{b,c,d\\}\\{e,f\\}/g', {}, ['a/{b,c,d}{e,f}/g']],
    ['a/\\{b,c,d\\}\\{e,f}/g', {}, ['a/{b,c,d}{e,f}/g']],
    ['a/\\{b,c,d\\}{e,f}/g', {}, ['a/{b,c,d}(e|f)/g']],
    ['a/\\{b,c,d{x,y}}{e,f\\}/g', {}, ['a/{b,c,d(x|y)}{e,f}/g']],
    ['a/\\{b,c,d}{e,f\\}/g', {}, ['a/{b,c,d}{e,f}/g']],
    ['a/\\{b,c,d}{e,f}/g', {}, ['a/{b,c,d}(e|f)/g']],
    ['a/\\{x,y}/cde', {}, ['a/{x,y}/cde']],
    ['a/\\{{b,c}{e,f}/g', {}, ['a/{(b|c)(e|f)/g']],
    ['a/\\{{b,c}{e,f}\\}/g', {}, ['a/{(b|c)(e|f)}/g']],
    ['a/\\{{b,c}{e,f}}/g', {}, ['a/{(b|c)(e|f)}/g']],
    ['a/b/c/{x,y\\}', {}, ['a/b/c/{x,y}']],
    ['a/b/c{d}e', {}, ['a/b/c{d}e']],
    ['a/b/{b,c,{d,e{f,g},{w,x}/{y,z}}}/h/i', {}, ['a/b/(b|c|(d|e(f|g)|(w|x)/(y|z)))/h/i']],
    ['a/{${b},c}/d', {}, ['a/(${b}|c)/d']],
    ['a/{b,c}}{e,f}/g', {}, ['a/(b|c)}(e|f)/g']],
    ['a/{b,c\\,d}{e,f}/g', {}, ['a/(b|c,d)(e|f)/g']],
    ['a/{b,c\\}}{e,f}/g', {}, ['a/(b|c})(e|f)/g']],
    ['a/{b,c}', {}, ['a/(b|c)']],
    ['a/{b,c}d{e,f}/g', {}, ['a/(b|c)d(e|f)/g']],
    ['a/{b,c}{e,f}/g', {}, ['a/(b|c)(e|f)/g']],
    ['a/{b,c}{e,f}{g,h,i}/k', {}, ['a/(b|c)(e|f)(g|h|i)/k']],
    ['a/{b,{c,d},e}/f', {}, ['a/(b|(c|d)|e)/f']],
    ['a/{b,{c,d}/{e,f},g}/h', {}, ['a/(b|(c|d)/(e|f)|g)/h']],
    ['a/{b{c,d},e{f,g}h{i,j}}/k', {}, ['a/(b(c|d)|e(f|g)h(i|j))/k']],
    ['a/{b{c,d},e}/f', {}, ['a/(b(c|d)|e)/f']],
    ['a/{b{c,d}e{f,g}h{i,j}}/k', {}, ['a/(b(c|d)e(f|g)h(i|j))/k']],
    ['a/{b{c,d}e{f,g},h{i,j}}/k', {}, ['a/(b(c|d)e(f|g)|h(i|j))/k']],
    ['a/{x,y}/{1..5}c{d,e}f.{md,txt}', {}, ['a/(x|y)/([1-5])c(d|e)f.(md|txt)']],
    ['a/{x,z}{b,{c,d}/{e,f},g}/h', {}, ['a/(x|z)(b|(c|d)/(e|f)|g)/h']],
    ['a/{x,{1..5},y}/c{d}e', {}, ['a/(x|([1-5])|y)/c{d}e']],
    ['a/{{a,b}/{c,d}}/z', {}, ['a/((a|b)/(c|d))/z']],
    ['a/{{b,c}/{d,e}}', {}, ['a/((b|c)/(d|e))']],
    ['a/{{b,c}/{d,e}}/f', {}, ['a/((b|c)/(d|e))/f']],
    ['abc/${ddd}/xyz', {}, ['abc/${ddd}/xyz']],
    ['abcd{efgh', {}, ['abcd{efgh']],
    ['a{ ,c{d, },h} ', {}, ['a( |c(d| )|h) ']],
    ['a{ ,c{d, },h}x', {}, ['a( |c(d| )|h)x']],
    ['a{0..3}d', {}, ['a([0-3])d']],
    ['a{b{c{d,e}f{x,y{{g}h', {}, ['a{b{c(d|e)f{x,y{{g}h']],
    ['a{b}c', {}, ['a{b}c']],
    ['foo {1,2} bar', {}, ['foo (1|2) bar']],
    ['x{10..1}y', {}, ['x([1-9]|10)y']],
    ['x{3..3}y', {}, ['x3y']],
    ['{ }', {}, ['{ }']],
    ['{', {}, ['{']],
    ['{0..10,braces}', {}, ['(0..10|braces)']],
    ['{1..0f}', {}, ['{1..0f}']],
    ['{1..10,braces}', {}, ['(1..10|braces)']],
    ['{1..10..ff}', {}, ['{1..10..ff}']],
    ['{1..10.f}', {}, ['{1..10.f}']],
    ['{1..10f}', {}, ['{1..10f}']],
    ['{1..10}', {}, ['([1-9]|10)']],
    ['{1..3}', {}, ['([1-3])']],
    ['{1..9}', {}, ['([1-9])']],
    ['{1..ff}', {}, ['{1..ff}']],
    ['{1.20..2}', {}, ['{1.20..2}']],
    ['{10..1}', {}, ['([1-9]|10)']],
    ['{214748364..2147483649}', {}, ['(21474836[4-9]|2147483[7-9][0-9]|214748[4-9][0-9]{2}|214749[0-9]{3}|2147[5-9][0-9]{4}|214[8-9][0-9]{5}|21[5-9][0-9]{6}|2[2-9][0-9]{7}|[3-9][0-9]{8}|1[0-9]{9}|20[0-9]{8}|21[0-3][0-9]{7}|214[0-6][0-9]{6}|2147[0-3][0-9]{5}|21474[0-7][0-9]{4}|214748[0-2][0-9]{3}|2147483[0-5][0-9]{2}|21474836[0-4][0-9])']],
    ['{2147483645..2147483649}', {}, ['(214748364[5-9])']],
    ['{3..3}', {}, ['3']],
    ['{5..8}', {}, ['([5-8])']],
    ['{9..-4}', {}, ['(-[1-4]|[0-9])']],
    ['{a,b,{c,d},e}', {}, ['(a|b|(c|d)|e)']],
    ['{a,b,{c,d}e}', {}, ['(a|b|(c|d)e)']],
    ['{a,b,{c,d}}', {}, ['(a|b|(c|d))']],
    ['{a,b{c,d}}', {}, ['(a|b(c|d))']],
    ['{a,b}/{c,d}', {}, ['(a|b)/(c|d)']],
    ['{a,b}{c,d}', {}, ['(a|b)(c|d)']],

    ['{{0..10},braces}', {}, ['(([0-9]|10)|braces)']],
    ['{{a,b},{c,d}}', {}, ['((a|b)|(c|d))']],
    ['{{a,b}/{c,d}}', {}, ['((a|b)/(c|d))']],
    ['{{a,b}/{c,d}}/z', {}, ['((a|b)/(c|d))/z']],
    ['{}', {}, ['{}']],
    ['}', {}, ['}']],

    // should not process glob characters
    ['{generate,{assemble,update,verb}{file,-generate-*},generator}.js', {}, ['(generate|(assemble|update|verb)(file|-generate-*)|generator).js']],
    ['**/{foo,bar}.js', {}, ['**/(foo|bar).js']],
    ['**/{1..5}/a.js', {}, ['**/([1-5])/a.js']],
    ['**/{a,b,c}/*.js', {}, ['**/(a|b|c)/*.js']],
    ['**/{a,b,*}/*.js', {}, ['**/(a|b|*)/*.js']],
    ['**/{**,b,*}/*.js', {}, ['**/(**|b|*)/*.js']],

    ['/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', {}, ['/usr/(ucb/(ex|edit)|lib/(ex|how_ex))']],
    ['ff{c,b,a}', {}, ['ff(c|b|a)']],
    ['f{d,e,f}g', {}, ['f(d|e|f)g']],
    ['x{{0..10},braces}y', {}, ['x(([0-9]|10)|braces)y']],
    ['{1..10}', {}, ['([1-9]|10)']],
    ['{a,b,c}', {}, ['(a|b|c)']],
    ['{braces,{0..10}}', {}, ['(braces|([0-9]|10))']],
    ['{l,n,m}xyz', {}, ['(l|n|m)xyz']],
    ['{{0..10},braces}', {}, ['(([0-9]|10)|braces)']],
    ['{{1..10..2},braces}', {bash: false }, ['((1|3|5|7|9)|braces)']],
    ['{{1..10},braces}', {}, ['(([1-9]|10)|braces)']],

    ['a/{a,b}/{c,d}/e', {}, ['a/(a|b)/(c|d)/e']],
    ['a{b,c}d{e,f}g', {}, ['a(b|c)d(e|f)g']],
    ['a/{x,y}/c{d,e}f.{md,txt}', {}, ['a/(x|y)/c(d|e)f.(md|txt)']],
    ['{a,b}{{a,b},a,b}', {}, ['(a|b)((a|b)|a|b)']],
    ['/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', {}, ['/usr/(ucb/(ex|edit)|lib/(ex|how_ex))']],
    ['a{b,c{d,e}f}g', {}, ['a(b|c(d|e)f)g']],
    ['a{{x,y},z}b', {}, ['a((x|y)|z)b']],
    ['f{x,y{g,z}}h', {}, ['f(x|y(g|z))h']],
    ['a{b,c{d,e},h}x/z', {}, ['a(b|c(d|e)|h)x/z']],
    ['a{b,c{d,e},h}x{y,z}', {}, ['a(b|c(d|e)|h)x(y|z)']],
    ['a{b,c{d,e},{f,g}h}x{y,z}', {}, ['a(b|c(d|e)|(f|g)h)x(y|z)']],

    // should handle invalid sets
    ['{0..10,braces}', {}, ['(0..10|braces)']],
    ['{1..10,braces}', {}, ['(1..10|braces)']],

    // should not expand escaped braces
    ['\\{a,b,c,d,e}', {}, ['{a,b,c,d,e}']],
    ['a/b/c/{x,y\\}', {}, ['a/b/c/{x,y}']],
    ['a/\\{x,y}/cde', {}, ['a/{x,y}/cde']],
    ['abcd{efgh', {}, ['abcd{efgh']],
    ['\\{abc\\}', {}, ['{abc}']],
    ['{x,y,\\{a,b,c\\}}', {}, ['(x|y|{a|b|c})']],
    ['{x,y,{a,b,c\\}}', {}, ['{x,y,(a|b|c})']],
    ['{x\\,y,\\{abc\\},trie}', {}, ['(x,y|{abc}|trie)']],
    ['{x,y,{abc},trie}', {}, ['(x|y|{abc}|trie)']],
    ['x,y,{abc},trie', {}, ['x,y,{abc},trie']],
    ['{b{c,d},e}', {}, ['(b(c|d)|e)']],
    ['{b{c,d},e}/f', {}, ['(b(c|d)|e)/f']],
    ['{abc}', {}, ['{abc}']],

    // should handle empty braces
    ['{ }', {}, ['{ }']],
    ['{', {}, ['{']],
    ['{}', {}, ['{}']],
    ['}', {}, ['}']],

    // should escape braces when only one value is defined
    ['a{b}c', {}, ['a{b}c']],
    ['a/b/c{d}e', {}, ['a/b/c{d}e']],

    // should escape closing braces when open is not defined
    ['{a,b}c,d}', {}, ['(a|b)c,d}']],
    ['a,b,c,d}', {}, ['a,b,c,d}']],

    // should not expand braces in sets with es6/bash-like variables
    ['abc/${ddd}/xyz', {}, ['abc/${ddd}/xyz']],
    ['a${b}c', {}, ['a${b}c']],
    ['a/{${b},c}/d', {}, ['a/(${b}|c)/d']],
    ['a${b,d}/{foo,bar}c', {}, ['a${b,d}/(foo|bar)c']],

    // should not expand escaped commas
    ['a{b\\,c\\,d}e', {}, ['a{b,c,d}e']],
    ['a{b\\,c}d', {}, ['a{b,c}d']],
    ['{abc\\,def}', {}, ['{abc,def}']],
    ['{abc\\,def,ghi}', {}, ['(abc,def|ghi)']],
    ['a/{b,c}/{x\\,y}/d/e', {}, ['a/(b|c)/{x,y}/d/e']],

    // should not expand escaped braces
    ['{a,b\\}c,d}', {}, ['(a|b}c|d)']],
    ['\\{a,b,c,d,e}', {}, ['{a,b,c,d,e}']],
    ['a/{z,\\{a,b,c,d,e}/d', {}, ['a/(z|{a|b|c|d|e)/d']],
    ['a/\\{b,c}/{d,e}/f', {}, ['a/{b,c}/(d|e)/f']],
    ['./\\{x,y}/{a..z..3}/', {}, ['./{x,y}/(a|d|g|j|m|p|s|v|y)/']],

    // should not expand escaped braces or commas
    ['{x\\,y,\\{abc\\},trie}', {}, ['(x,y|{abc}|trie)']],

    // should support sequence brace operators
    ['/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', {}, ['/usr/(ucb/(ex|edit)|lib/(ex|how_ex))']],
    ['ff{c,b,a}', {}, ['ff(c|b|a)']],
    ['f{d,e,f}g', {}, ['f(d|e|f)g']],
    ['x{{0..10},braces}y', {}, ['x(([0-9]|10)|braces)y']],
    ['{1..10}', {}, ['([1-9]|10)']],
    ['{a,b,c}', {}, ['(a|b|c)']],
    ['{braces,{0..10}}', {}, ['(braces|([0-9]|10))']],
    ['{l,n,m}xyz', {}, ['(l|n|m)xyz']],
    ['{{0..10},braces}', {}, ['(([0-9]|10)|braces)']],
    ['{{1..10..2},braces}', {}, ['((1|3|5|7|9)|braces)']],
    ['{{1..10},braces}', {}, ['(([1-9]|10)|braces)']],

    // should expand multiple sets
    ['a/{a,b}/{c,d}/e', {}, ['a/(a|b)/(c|d)/e']],
    ['a{b,c}d{e,f}g', {}, ['a(b|c)d(e|f)g']],
    ['a/{x,y}/c{d,e}f.{md,txt}', {}, ['a/(x|y)/c(d|e)f.(md|txt)']],

    // should expand nested sets
    ['{a,b}{{a,b},a,b}', {}, ['(a|b)((a|b)|a|b)']],
    ['/usr/{ucb/{ex,edit},lib/{ex,how_ex}}', {}, ['/usr/(ucb/(ex|edit)|lib/(ex|how_ex))']],
    ['a{b,c{d,e}f}g', {}, ['a(b|c(d|e)f)g']],
    ['a{{x,y},z}b', {}, ['a((x|y)|z)b']],
    ['f{x,y{g,z}}h', {}, ['f(x|y(g|z))h']],
    ['a{b,c{d,e},h}x/z', {}, ['a(b|c(d|e)|h)x/z']],
    ['a{b,c{d,e},h}x{y,z}', {}, ['a(b|c(d|e)|h)x(y|z)']],
    ['a{b,c{d,e},{f,g}h}x{y,z}', {}, ['a(b|c(d|e)|(f|g)h)x(y|z)']],
    ['a-{b{d,e}}-c', {}, ['a-{b(d|e)}-c']],

    // should expand not modify non-brace characters
    ['a/b/{d,e}/*.js', {}, ['a/b/(d|e)/*.js']],
    ['a/**/c/{d,e}/f*.js', {}, ['a/**/c/(d|e)/f*.js']],
    ['a/**/c/{d,e}/f*.{md,txt}', {}, ['a/**/c/(d|e)/f*.(md|txt)']],

    // should work with leading and trailing commas
    ['a{b,}c', {}, ['a(b|)c']],
    ['a{,b}c', {}, ['a(|b)c']],

    // should handle spaces
    // Bash 4.3 says the this first one should be equivalent to `foo|(1|2)|bar
    // That makes sense in Bash, since ' ' is a separator, but not here.
    ['foo {1,2} bar', {}, ['foo (1|2) bar']],
    ['0{1..9} {10..20}', {}, ['0([1-9]) (1[0-9]|20)']],
    ['a{ ,c{d, },h}x', {}, ['a( |c(d| )|h)x']],
    ['a{ ,c{d, },h} ', {}, ['a( |c(d| )|h) ']],

    // see https://github.com/jonschlinkert/micromatch/issues/66
    ['/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.{html,ejs}', {}, ['/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.(html|ejs)']],

    /**
    * Ranges
    */

    // should not try to expand ranges with decimals
    ['{1.1..2.1}', {}, ['{1.1..2.1}']],
    ['{1.1..~2.1}', {}, ['{1.1..~2.1}']],

    // should escape invalid ranges
    ['{1..0f}', {}, ['{1..0f}']],
    ['{1..10..ff}', {}, ['{1..10..ff}']],
    ['{1..10.f}', {}, ['{1..10.f}']],
    ['{1..10f}', {}, ['{1..10f}']],
    ['{1..20..2f}', {}, ['{1..20..2f}']],
    ['{1..20..f2}', {}, ['{1..20..f2}']],
    ['{1..2f..2}', {}, ['{1..2f..2}']],
    ['{1..ff..2}', {}, ['{1..ff..2}']],
    ['{1..ff}', {}, ['{1..ff}']],
    ['{1.20..2}', {}, ['{1.20..2}']],

    // should handle weirdly-formed brace expansions (fixed in post-bash-3.1)
    ['a-{b{d,e}}-c', {}, ['a-{b(d|e)}-c']],
    ['a-{bdef-{g,i}-c', {}, ['a-{bdef-(g|i)-c']],

    // should not expand quoted strings
    ['{"klklkl"}{1,2,3}', {}, ['{klklkl}(1|2|3)']],
    ['{"x,x"}', {}, ['{x,x}']],

    // should escaped outer braces in nested non-sets
    ['{a-{b,c,d}}', {}, ['{a-(b|c|d)}']],
    ['{a,{a-{b,c,d}}}', {}, ['(a|{a-(b|c|d)})']],

    // should escape imbalanced braces
    ['a-{bdef-{g,i}-c', {}, ['a-{bdef-(g|i)-c']],
    ['abc{', {}, ['abc{']],
    ['{abc{', {}, ['{abc{']],
    ['{abc', {}, ['{abc']],
    ['}abc', {}, ['}abc']],
    ['ab{c', {}, ['ab{c']],
    ['ab{c', {}, ['ab{c']],
    ['{{a,b}', {}, ['{(a|b)']],
    ['{a,b}}', {}, ['(a|b)}']],
    ['abcd{efgh', {}, ['abcd{efgh']],
    ['a{b{c{d,e}f}gh', {}, ['a{b(c(d|e)f)gh']],
    ['a{b{c{d,e}f}g}h', {}, ['a(b(c(d|e)f)g)h']],
    ['f{x,y{{g,z}}h}', {}, ['f(x|y((g|z))h)']],
    ['z{a,b},c}d', {}, ['z(a|b),c}d']],
    ['a{b{c{d,e}f{x,y{{g}h', {}, ['a{b{c(d|e)f{x,y{{g}h']],
    ['f{x,y{{g}h', {}, ['f{x,y{{g}h']],
    ['f{x,y{{g}}h', {}, ['f{x,y{{g}}h']],
    ['a{b{c{d,e}f{x,y{}g}h', {}, ['a{b{c(d|e)f(x|y{}g)h']],
    ['f{x,y{}g}h', {}, ['f(x|y{}g)h']],
    ['z{a,b{,c}d', {}, ['z{a,b(|c)d']],

    // should expand numeric ranges
    ['a{0..3}d', {}, ['a([0-3])d']],
    ['x{10..1}y', {}, ['x([1-9]|10)y']],
    ['x{3..3}y', {}, ['x3y']],
    ['{1..10}', {}, ['([1-9]|10)']],
    ['{1..3}', {}, ['([1-3])']],
    ['{1..9}', {}, ['([1-9])']],
    ['{10..1}', {}, ['([1-9]|10)']],
    ['{10..1}y', {}, ['([1-9]|10)y']],
    ['{3..3}', {}, ['3']],
    ['{5..8}', {}, ['([5-8])']],

    // should expand ranges with negative numbers
    ['{-10..-1}', {}, ['(-[1-9]|-10)']],
    ['{-20..0}', {}, ['(-[1-9]|-1[0-9]|-20|0)']],
    ['{0..-5}', {}, ['(-[1-5]|0)']],
    ['{9..-4}', {}, ['(-[1-4]|[0-9])']],

    // should expand alphabetical ranges
    ['0{1..9}/{10..20}', {}, ['0([1-9])/(1[0-9]|20)']],
    ['0{a..d}0', {}, ['0([a-d])0']],
    ['a/{b..d}/e', {}, ['a/([b-d])/e']],
    ['{1..f}', {}, ['([1-f])']],
    ['{a..A}', {}, ['([A-a])']],
    ['{A..a}', {}, ['([A-a])']],
    ['{a..e}', {}, ['([a-e])']],
    ['{A..E}', {}, ['([A-E])']],
    ['{a..f}', {}, ['([a-f])']],
    ['{a..z}', {}, ['([a-z])']],
    ['{E..A}', {}, ['([A-E])']],
    ['{f..1}', {}, ['([1-f])']],
    ['{f..a}', {}, ['([a-f])']],
    ['{f..f}', {}, ['f']],

    // should expand multiple ranges
    ['a/{b..d}/e/{f..h}', {}, ['a/([b-d])/e/([f-h])']],

    // should expand numerical ranges - positive and negative
    ['{-10..10}', {}, ['(-[1-9]|-?10|[0-9])']],

    // HEADS UP! If you're using the `--mm` flag minimatch freezes on these
    // should expand large numbers
    ['{2147483645..2147483649}', {}, ['(214748364[5-9])']],
    ['{214748364..2147483649}', {}, ['(21474836[4-9]|2147483[7-9][0-9]|214748[4-9][0-9]{2}|214749[0-9]{3}|2147[5-9][0-9]{4}|214[8-9][0-9]{5}|21[5-9][0-9]{6}|2[2-9][0-9]{7}|[3-9][0-9]{8}|1[0-9]{9}|20[0-9]{8}|21[0-3][0-9]{7}|214[0-6][0-9]{6}|2147[0-3][0-9]{5}|21474[0-7][0-9]{4}|214748[0-2][0-9]{3}|2147483[0-5][0-9]{2}|21474836[0-4][0-9])']],

    // should expand ranges using steps
    ['{1..10..1}', {bash: false}, ['([1-9]|10)']],
    ['{1..10..2}', {bash: false}, ['(1|3|5|7|9)']],
    ['{1..20..20}', {bash: false}, ['1']],
    ['{1..20..2}', {bash: false}, ['(1|3|5|7|9|11|13|15|17|19)']],
    ['{10..0..2}', {bash: false}, ['(10|8|6|4|2|0)']],
    ['{10..1..2}', {bash: false}, ['(10|8|6|4|2)']],
    ['{100..0..5}', {bash: false}, ['(100|95|90|85|80|75|70|65|60|55|50|45|40|35|30|25|20|15|10|5|0)']],
    ['{2..10..1}', {bash: false}, ['([2-9]|10)']],
    ['{2..10..2}', {bash: false}, ['(2|4|6|8|10)']],
    ['{2..10..3}', {bash: false}, ['(2|5|8)']],
    ['{a..z..2}', {bash: false}, ['(a|c|e|g|i|k|m|o|q|s|u|w|y)']],

    // should expand positive ranges with negative steps
    ['{10..0..-2}', {bash: false}, ['(10|8|6|4|2|0)']],

    // should expand negative ranges using steps
    ['{-1..-10..-2}', {bash: false}, ['(-(1|3|5|7|9))']],
    ['{-1..-10..2}', {bash: false}, ['(-(1|3|5|7|9))']],
    ['{-10..-2..2}', {bash: false}, ['(-(10|8|6|4|2))']],
    ['{-2..-10..1}', {bash: false}, ['(-[2-9]|-10)']],
    ['{-2..-10..2}', {bash: false}, ['(-(2|4|6|8|10))']],
    ['{-2..-10..3}', {bash: false}, ['(-(2|5|8))']],
    ['{-50..-0..5}', {bash: false}, ['(0|-(50|45|40|35|30|25|20|15|10|5))']],
    ['{-9..9..3}', {bash: false}, ['(0|3|6|9|-(9|6|3))']],
    ['{10..1..-2}', {bash: false}, ['(10|8|6|4|2)']],
    ['{100..0..-5}', {bash: false}, ['(100|95|90|85|80|75|70|65|60|55|50|45|40|35|30|25|20|15|10|5|0)']],

    // should expand alpha ranges with steps
    ['{a..e..2}', {bash: false}, ['(a|c|e)']],
    ['{E..A..2}', {bash: false}, ['(E|C|A)']],
    ['{a..z..2}', {bash: false}, ['(a|c|e|g|i|k|m|o|q|s|u|w|y)']],
    ['{z..a..-2}', {bash: false}, ['(z|x|v|t|r|p|n|l|j|h|f|d|b)']],

    // should expand alpha ranges with negative steps
    ['{z..a..-2}', {bash: false}, ['(z|x|v|t|r|p|n|l|j|h|f|d|b)']],

    // unwanted zero-padding (fixed post-bash-4.0)
    ['{10..0..2}', {bash: false}, ['(10|8|6|4|2|0)']],
    ['{10..0..-2}', {bash: false}, ['(10|8|6|4|2|0)']],
    ['{-50..-0..5}', {bash: false}, ['(0|-(50|45|40|35|30|25|20|15|10|5))']],

    // should work with dots in file paths
    ['../{1..3}/../foo', {}, ['../([1-3])/../foo']],
    ['../{2..10..2}/../foo', {}, ['../(2|4|6|8|10)/../foo']],
    ['../{1..3}/../{a,b,c}/foo', {}, ['../([1-3])/../(a|b|c)/foo']],
    ['./{a..z..3}/', {}, ['./(a|d|g|j|m|p|s|v|y)/']],
    ['./{"x,y"}/{a..z..3}/', {}, ['./{x,y}/(a|d|g|j|m|p|s|v|y)/']],

    // should expand a complex combination of ranges and sets
    ['a/{x,y}/{1..5}c{d,e}f.{md,txt}', {}, ['a/(x|y)/([1-5])c(d|e)f.(md|txt)']],

    // should expand complex sets and ranges in `bash` mode
    ['a/{x,{1..5},y}/c{d}e', {}, ['a/(x|([1-5])|y)/c{d}e']]
  ];

  fixtures.forEach(function(arr) {
    if (typeof arr === 'string') {
      return;
    }

    var options = extend({}, arr[1]);
    var pattern = arr[0];
    var expected = arr[2];

    if (options.skip === true) {
      return;
    }

    it('should compile: ' + pattern, function() {
      match(pattern, expected, options);
    });
  });
});
