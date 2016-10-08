'use strict';

var extend = require('extend-shallow');
var reference = require('./support/reference');
var support = require('./support/compare');
var compare;

describe('bash.expanded', function() {
  beforeEach(function() {
    compare = support();
  });

  var fixtures = [
    "{x,x}",
    '{"x,x"}',
    '{x","x}',
    "'{x,x}'",
    '{x`,`x}',
    "'{a,b}{{a,b},a,b}'",
    'A{b,{d,e},{f,g}}Z',
    'PRE-{a,b}{{a,b},a,b}-POST',
    '\\{a,b}{{a,b},a,b}',
    '{{a,b}',
    '{a,b}}',
    '{,}',
    'a{,}',
    '{,}b',
    'a{,}b',
    'a{b}c',
    'a{1..5}b',

    // zero pad (skipped since bash 4.3 needs to be installed)
    'a{01..5}b',
    'a{-01..5}b',
    'a{-01..5..3}b',
    'a{001..9}b',

    'a{b,c{d,e},{f,g}h}x{y,z',
    'a{b,c{d,e},{f,g}h}x{y,z\\}',
    'a{b,c{d,e},{f,g}h}x{y,z}',
    'a{b{c{d,e}f{x,y{{g}h',
    'a{b{c{d,e}f{x,y{}g}h',
    'a{b{c{d,e}f{x,y}}g}h',
    'a{b{c{d,e}f}g}h',
    'a{{x,y},z}b',
    'f{x,y{g,z}}h',
    'f{x,y{{g,z}}h',
    'f{x,y{{g,z}}h}',
    'f{x,y{{g}h',
    'f{x,y{{g}}h',
    'f{x,y{}g}h',
    'z{a,b{,c}d',
    'z{a,b},c}d',
    '{-01..5}',
    '{-05..100..5}',
    '{-05..100}',
    '{0..5..2}',
    '{0001..05..2}',
    '{0001..-5..2}',
    '{0001..-5..-2}',
    '{0001..5..-2}',
    '{01..5}',
    '{1..05}',
    '{1..05..3}',
    '{05..100}',
    '{0a..0z}',
    '{a,b\\}c,d}',
    '{a,b{c,d}',
    '{a,b}c,d}',
    '{a..F}',
    '{A..f}',
    '{a..Z}',
    '{A..z}',
    '{z..A}',
    '{Z..a}',
    '{a..F..2}',
    '{A..f..02}',
    '{a..Z..5}',
    'd{a..Z..5}b',
    '{A..z..10}',
    '{z..A..-2}',
    '{Z..a..20}',
    '{a{,b}',
    '{a\\},b}',
    '{x,y{,}g}',
    '{x,y{}g}',
    '{{a,b}',
    '{{a,b},c}',
    '{{a,b}c}',
    '{{a,b},}',
    'X{{a,b},}X',
    '{{a,b},}c',
    '{{a,b}.}',
    '{{a,b}}',
    'X{a..#}X',

    // // this next one is an empty string
    '',
    '{-10..00}',

    // // Need to escape slashes in here for reasons i guess.
    '{a,\\\\{a,b}c}',
    '{a,\\{a,b}c}',
    'a,\\{b,c}',
    '{-10.\\.00}',

    // bash tests/braces.tests',
    // Note that some tests are edited out because some features of
    // bash are intentionally not supported in this brace expander.
    'ff{c,b,a}',
    'f{d,e,f}g',
    '{l,n,m}xyz',
    '{abc\\,def}',
    '{abc}',
    '{x\\,y,\\{abc\\},trie}',

    // // not impementing back-ticks obviously
    // XXXX\\{`echo a b c | tr ' ' ','`\\}
    '{}',

    // // We only ever have to worry about parsing a single argument,
    // // not a command line, so spaces have a different meaning than bash.
    '{ }',
    '}',
    '{',
    'abcd{efgh',

    // spaces
    'foo {1,2} bar',

    // not impementing back-ticks obviously
    // `zecho foo {1,2} bar`
    // $(zecho foo {1,2} bar)
    // ${var} is not a variable here, like it is in bash. omit.
    // foo{bar,${var}.}
    // foo{bar,${var}}
    // isaacs: skip quotes for now
    '"${var}"{x,y}',
    // '$var{x,y}',
    // ${var}{x,y}
    // new sequence brace operators
    '{1..10}',

    // isaacs: this doesn\'t work yet (it works in braces)
    '{0..10,braces}',

    // but this does
    '{{0..10},braces}',
    'x{{0..10},braces}y',
    '{3..3}',
    'x{3..3}y',
    '{10..1}',
    '{10..1}y',
    'x{10..1}y',
    '{a..f}',
    '{f..a}',
    '{a..A}',
    '{A..a}',
    '{f..f}',

    // mixes are incorrectly-formed brace expansions (these are actually valid
    // and can be expanced by braces but bash cannot expand them)
    // '{1..f}',
    // '{f..1}',

    // spaces
    '0{1..9} {10..20}',

    // do negative numbers work?
    '{-1..-10}',
    '{-20..0}',

    // weirdly-formed brace expansions -- fixed in post-bash-3.1
    'a-{b{d,e}}-c',
    'a-{bdef-{g,i}-c',

    // isaacs: skip quotes for now
    '{"klklkl"}{1,2,3}',
    '{"x,x"}',

    // isaacs: this is a valid test, though
    '{klklkl}{1,2,3}',

    '{1..10..2}',
    '{-1..-10..2}',
    '{-1..-10..-2}',
    '{10..1..-2}',
    '{10..1..2}',
    '{1..20..2}',
    '{1..20..20}',
    '{100..0..5}',
    '{100..0..-5}',
    '{a..z}',
    '{a..z..2}',
    '{z..a..-2}',

    // make sure brace expansion handles ints > 2**31 - 1 using intmax_t
    '{2147483645..2147483649}',

    // unwanted zero-padding -- fixed post-bash-4.0
    '{10..0..2}',
    '{10..0..-2}',
    '{-50..-0..5}',

    // bad
    '{1..10.f}',
    '{1..ff}',
    '{1..10..ff}',
    '{1.20..2}',
    '{1..20..f2}',
    '{1..20..2f}',
    '{1..2f..2}',
    '{1..ff..2}',
    '{1..ff}',
    '{1..0f}',
    '{1..10f}',
    '{1..10.f}',
    '{},b}.h',
    'y{\\},a}x',
    '{}a,b}c'
  ];

  fixtures.forEach(function(pattern) {
    var opts = extend({}, {expand: true});
    it('should compile: ' + pattern, function() {
      compare(pattern, reference(pattern, opts), opts);
    });
  });
});
