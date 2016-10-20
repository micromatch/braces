# braces [![NPM version](https://img.shields.io/npm/v/braces.svg?style=flat)](https://www.npmjs.com/package/braces) [![NPM monthly downloads](https://img.shields.io/npm/dm/braces.svg?style=flat)](https://npmjs.org/package/braces)  [![NPM total downloads](https://img.shields.io/npm/dt/braces.svg?style=flat)](https://npmjs.org/package/braces) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/braces.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/braces) [![Windows Build Status](https://img.shields.io/appveyor/ci/jonschlinkert/braces.svg?style=flat&label=AppVeyor)](https://ci.appveyor.com/project/jonschlinkert/braces)

> Fast, comprehensive, bash-like brace expansion implemented in JavaScript. Complete support for the Bash 4.3 braces specification, without sacrificing speed.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save braces
```

## Usage

The main export is a function that takes a brace `pattern` to expand and an `options` object if necessary.

```js
var braces = require('braces');
braces(pattern[, options]);
```

## Highlights

* **Accurate**: complete support for the [Bash 4.3 Brace Expansion](www.gnu.org/software/bash/) specification (passes all of the Bash braces tests)
* **[fast and performant](#benchmarks)**: not only runs fast, but scales well as patterns increase in complexity (other libs don't - see the notes on [performance](#performance)).
* **Organized code base**: with parser and compiler that are easy to maintain and update when edge cases crop up.
* **Well-tested**: 900+ unit tests with thousands of actual patterns tested. Passes 100% of the [minimatch](https://github.com/isaacs/minimatch) and [brace-expansion](https://github.com/juliangruber/brace-expansion) unit tests as well.
* **Optimized braces**: By default returns an optimized string that can be used for creating regular expressions for matching.
* **Expanded braces**: Optionally returns an array (like bash). See a [comparison](#optimized-vs-expanded) between optimized and expanded.

**Optimized**

Patterns are optimized for regex and matching by default:

```js
console.log(braces('a/{x,y,z}/b'));
//=> ['a/(x|y|z)/b']
```

**Expanded**

To expand patterns the same way as Bash or [minimatch](https://github.com/isaacs/minimatch), use the [.expand](#expand) method:

```js
console.log(braces.expand('a/{x,y,z}/b'));
//=> ['a/x/b', 'a/y/b', 'a/z/b']
```

## Features

* [lists](#lists): Supports "lists": `a/{b,c}/d` => `['a/b/d', 'a/c/d']`
* [sequences](#sequences): Supports alphabetical or numerical "sequences" (ranges): `{1..3}` => `['1', '2', '3']`
* [steps](#steps): Supports "steps" or increments: `{2..10..2}` => `['2', '4', '6', '8', '10']`
* [escaping](#escaping)
* [options](#options)

### Lists

Uses [fill-range](https://github.com/jonschlinkert/fill-range) for expanding alphabetical or numeric lists:

```js
console.log(braces('a/{foo,bar,baz}/*.js'));
//=> ['a/(foo|bar|baz)/*.js']

console.log(braces.expand('a/{foo,bar,baz}/*.js'));
//=> ['a/foo/*.js', 'a/bar/*.js', 'a/baz/*.js']
```

### Sequences

Uses [fill-range](https://github.com/jonschlinkert/fill-range) for expanding alphabetical or numeric ranges (bash "sequences"):

```js
// padding is not retained when string is optimized
console.log(braces('a{01..03}b')); // ['a([1-3])b']
console.log(braces('a{1..3}b'));   // ['a([1-3])b']

console.log(braces.expand('{1..3}'));     // ['1', '2', '3']
console.log(braces.expand('a{01..03}b')); // ['a01b', 'a02b', 'a03b']
console.log(braces.expand('a{1..3}b'));   // ['a1b', 'a2b', 'a3b']
console.log(braces.expand('{a..c}'));     // ['a', 'b', 'c']
console.log(braces.expand('foo/{a..c}')); // ['foo/a', 'foo/b', 'foo/c']
```

### Steps

Steps, or increments, may be used with ranges:

```js
console.log(braces.expand('{2..10..2}'));
//=> ['2', '4', '6', '8', '10']

console.log(braces('{2..10..2}'));
//=> ['(2|4|6|8|10)']
```

When the [.optimize](#optimize) method is used, or [options.optimize](#optionsoptimize) is set to true, sequences are passed to [to-regex-range](https://github.com/jonschlinkert/to-regex-range) for expansion.

### Nesting

Brace patterns may be nested. The results of each expanded string are not sorted, and left to right order is preserved.

**"Expanded" examples**

```js
console.log(braces.expand('a{b,c,/{x,y}}/e'));
//=> ['ab/e', 'ac/e', 'a/x/e', 'a/y/e']

console.log(braces.expand('a/{x,{1..5},y}/c'));
//=> ['a/x/c', 'a/1/c', 'a/2/c', 'a/3/c', 'a/4/c', 'a/5/c', 'a/y/c']
```

**"Optimized" examples**

```js
console.log(braces('a{b,c,/{x,y}}/e'));
//=> ['a(b|c|/(x|y))/e']

console.log(braces('a/{x,{1..5},y}/c'));
//=> ['a/(x|([1-5])|y)/c']
```

### Escaping

**Escaping braces**

Prevent braces from being expanded or evaluted by escaping either the opening or closing brace:

```js
console.log(braces.expand('a\\{d,c,b}e'));
//=> ['a{d,c,b}e']

console.log(braces.expand('a{d,c,b\\}e'));
//=> ['a{d,c,b}e']
```

**Escaping commas**

Commas inside braces may also be escaped:

```js
console.log(braces.expand('a{d\\,c,b}e'));
//=> ['ad,ce', 'abe']
```

**Single items**

A brace pattern is also considered to be escaped when it contains a single item:

```js
console.log(braces.expand('a{b}c'));
//=> ['a{b}c']

console.log(braces.expand('a{b\\,c}d'));
//=> ['a{b,c}d']
```

## Options

### options.expand

Type: `Boolean`

Default: `undefined`

Generate an "expanded" brace pattern (this option is unncessary with the `.expand` method, which does the same thing).

```js
console.log(braces('a/{b,c}/d', {expand: true}));
//=> [ 'a/b/d', 'a/c/d' ]
```

### options.optimize

Type: `Boolean`

Default: `true`

Enabled by default.

```js
console.log(braces('a/{b,c}/d'));
//=> [ 'a/(b|c)/d' ]
```

### options.nodupes

Type: `Boolean`

Default: `true`

Duplicates are removed by default. To keep duplicates, pass `{nodupes: false}` on the options

### options.rangeLimit

Type: `Number`

Default: `250`

When `braces.expand()` is used, or `options.expand` is true, brace patterns will automatically be [optimized](#optionsoptimize) when the difference between the range minimum and range maximum exceeds the `rangeLimit`. This is to prevent huge ranges from freezing your application.

You can set this to any number, or change `options.rangeLimit` to `Inifinity` to disable this altogether.

**Examples**

```js
// pattern exceeds the "rangeLimit", so it's optimized automatically
console.log(braces.expand('{1..1000}'));
//=> ['([1-9]|[1-9][0-9]{1,2}|1000)']

// pattern does not exceed "rangeLimit", so it's NOT optimized
console.log(braces.expand('{1..100}'));
//=> ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '100']
```

### options.transform

Type: `Function`

Default: `undefined`

Customize range expansion.

```js
var range = braces.expand('x{a..e}y', {
  transform: function(str) {
    return 'foo' + str;
  }
});

console.log(range);
//=> [ 'xfooay', 'xfooby', 'xfoocy', 'xfoody', 'xfooey' ]
```

### options.quantifiers

Type: `Boolean`

Default: `undefined`

In regular expressions, quanitifiers can be used to specify how many times a token can be repeated. For example, `a{1,3}` will match the letter `a` one to three times.

Unfortunately, regex quantifiers happen to share the same syntax as [Bash lists](#lists)

The `quantifiers` option tells braces to detect when [regex quantifiers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#quantifiers) are defined in the given pattern, and not to try to expand them as lists.

**Examples**

```js
var braces = require('braces');
console.log(braces('a/b{1,3}/{x,y,z}'));
//=> [ 'a/b(1|3)/(x|y|z)' ]
console.log(braces('a/b{1,3}/{x,y,z}', {quantifiers: true}));
//=> [ 'a/b{1,3}/(x|y|z)' ]
console.log(braces('a/b{1,3}/{x,y,z}', {quantifiers: true, expand: true}));
//=> [ 'a/b{1,3}/x', 'a/b{1,3}/y', 'a/b{1,3}/z' ]
```

## Benchmarks

### Running benchmarks

Install dev dependencies:

```bash
npm i -d && npm benchmark
```

### Latest results

```bash
Benchmarking: (8 of 8)
 · combination-nested
 · combination
 · escaped
 · list-basic
 · list-multiple
 · no-braces
 · sequence-basic
 · sequence-multiple

# benchmark/fixtures/combination-nested.js (52 bytes)
  brace-expansion x 4,756 ops/sec ±1.09% (86 runs sampled)
  braces x 11,202,303 ops/sec ±1.06% (88 runs sampled)
  minimatch x 4,816 ops/sec ±0.99% (87 runs sampled)

  fastest is braces

# benchmark/fixtures/combination.js (51 bytes)
  brace-expansion x 625 ops/sec ±0.87% (87 runs sampled)
  braces x 11,031,884 ops/sec ±0.72% (90 runs sampled)
  minimatch x 637 ops/sec ±0.84% (88 runs sampled)

  fastest is braces

# benchmark/fixtures/escaped.js (44 bytes)
  brace-expansion x 163,325 ops/sec ±1.05% (87 runs sampled)
  braces x 10,655,071 ops/sec ±1.22% (88 runs sampled)
  minimatch x 147,495 ops/sec ±0.96% (88 runs sampled)

  fastest is braces

# benchmark/fixtures/list-basic.js (40 bytes)
  brace-expansion x 99,726 ops/sec ±1.07% (83 runs sampled)
  braces x 10,596,584 ops/sec ±0.98% (88 runs sampled)
  minimatch x 100,069 ops/sec ±1.17% (86 runs sampled)

  fastest is braces

# benchmark/fixtures/list-multiple.js (52 bytes)
  brace-expansion x 34,348 ops/sec ±1.08% (88 runs sampled)
  braces x 9,264,131 ops/sec ±1.12% (88 runs sampled)
  minimatch x 34,893 ops/sec ±0.87% (87 runs sampled)

  fastest is braces

# benchmark/fixtures/no-braces.js (48 bytes)
  brace-expansion x 275,368 ops/sec ±1.18% (89 runs sampled)
  braces x 9,134,677 ops/sec ±0.95% (88 runs sampled)
  minimatch x 3,755,954 ops/sec ±1.13% (89 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-basic.js (41 bytes)
  brace-expansion x 5,492 ops/sec ±1.35% (87 runs sampled)
  braces x 8,485,034 ops/sec ±1.28% (89 runs sampled)
  minimatch x 5,341 ops/sec ±1.17% (87 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-multiple.js (51 bytes)
  brace-expansion x 116 ops/sec ±0.77% (77 runs sampled)
  braces x 9,445,118 ops/sec ±1.32% (84 runs sampled)
  minimatch x 109 ops/sec ±1.16% (76 runs sampled)

  fastest is braces
```

## Performance

### What's the big deal?

If you use globbing a lot, whether in your build tool chain or in your application, the speed of the glob matcher not only impacts your experience, but a slow glob matcher can slow everything else down, limitimg what you thought was possible in your application.

### Braces is fast

> minimatch gets exponentially slower as patterns increase in complexity, braces does not

Brace patterns are meant to be expanded - at least, if you're using Bash, that is. It's not at all unusual for users to want to use brace patterns for dates or similar ranges. It's also very easy to define a brace pattern that appears to be very simple but in fact is fairly complex.

For example, here is how generated regex size and processing time compare as patterns increase in complexity:

_(the following results were generated using `braces()` and `minimatch.braceExpand()`)_

| **Pattern** | **minimatch** | **braces** | 
| --- | --- | --- |
| `{1..9007199254740991}`<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> | N/A (freezes) | `300 B` (12ms 878μs) |
| `{1..10000000}` | `98.9 MB` (20s 193ms 13μs) | `34 B` (11ms 204μs) |
| `{1..1000000}` | `8.89 MB` (1s 838ms 718μs) | `33 B` (1ms 761μs) |
| `{1..100000}` | `789 kB` (181ms 518μs) | `32 B` (1ms 76μs) |
| `{1..10000}` | `68.9 kB` (17ms 436μs) | `31 B` (1ms 382μs) |
| `{1..1000}` | `5.89 kB` (1ms 773μs) | `30 B` (1ms 509μs) |
| `{1..100}` | `491 B` (321μs) | `24 B` (309μs) |
| `{1..10}` | `40 B` (56μs) | `12 B` (333μs) |
| `{1..3}` | `11 B` (80μs) | `9 B` (370μs) |

These numbers are actually pretty small as far as numeric ranges are concerned. Regardless, we shouldn't have to consider such things when creating a glob pattern. The tool should get out of your way and let you be as creative as you want.

### Braces is performant

Even when brace patterns are fully **expanded**, `braces` is still much faster.

_(the following results were generated using `braces.expand()` and `minimatch.braceExpand()`)_

| **Pattern** | **minimatch** | **braces** | 
| --- | --- | --- | --- | --- | --- |
| `a/{1..10000000}` | `98.9 MB` (19s 754ms 376μs) | `98.9 MB` (5s 734ms 419μs) |
| `a/{1..1000000}` | `8.89 MB` (1s 866ms 968μs) | `8.89 MB` (561ms 594μs) |
| `a/{1..100000}` | `789 kB` (178ms 311μs) | `789 kB` (29ms 823μs) |
| `a/{1..10000}` | `68.9 kB` (17ms 692μs) | `68.9 kB` (2ms 351μs) |
| `a/{1..1000}` | `5.89 kB` (1ms 823μs) | `5.89 kB` (706μs) |
| `a/{1..100}` | `491 B` (609μs) | `491 B` (267μs) |
| `a/{1..10}` | `40 B` (61μs) | `40 B` (636μs) |
| `a/{1..3}` | `11 B` (206μs) | `11 B` (207μs) |

### Why is braces so fast?

Braces was built from the ground up to be as performant as possible when matching, using a combination of the following:

* **minimizes loops and iterating**: we try to pass over the pattern once to parse it before passing it to the compiler.
* **generates an optimized string**: sequences/ranges are optimized by [to-regex-range](https://github.com/jonschlinkert/to-regex-range), which is not only highly accurate, but produces patterns that are a fraction of the size of patterns generated by other brace expansion libraries, such as Bash and [minimatch](https://github.com/isaacs/minimatch) (via [brace-expansion](https://github.com/juliangruber/brace-expansion))
* **generates results faster**: can handle even the most complex patterns that cause other implementations like [minimatch](https://github.com/isaacs/minimatch) and Bash to fail.

### Braces is safe

Last, but perhaps most important of all, unlike [brace-expansion](https://github.com/juliangruber/brace-expansion) and [minimatch](https://github.com/isaacs/minimatch), braces will not freeze your application when a user passes a complex brace pattern (feeling brave? try expanding `a/{1..10000000}` with minimatch :)

## About

### Related projects

* [expand-brackets](https://www.npmjs.com/package/expand-brackets): Expand POSIX bracket expressions (character classes) in glob patterns. | [homepage](https://github.com/jonschlinkert/expand-brackets "Expand POSIX bracket expressions (character classes) in glob patterns.")
* [extglob](https://www.npmjs.com/package/extglob): Convert extended globs to regex-compatible strings. Add (almost) the expressive power of regular expressions to… [more](https://github.com/jonschlinkert/extglob) | [homepage](https://github.com/jonschlinkert/extglob "Convert extended globs to regex-compatible strings. Add (almost) the expressive power of regular expressions to glob patterns.")
* [fill-range](https://www.npmjs.com/package/fill-range): Fill in a range of numbers or letters, optionally passing an increment or `step` to… [more](https://github.com/jonschlinkert/fill-range) | [homepage](https://github.com/jonschlinkert/fill-range "Fill in a range of numbers or letters, optionally passing an increment or `step` to use, or create a regex-compatible range with `options.toRegex`")
* [micromatch](https://www.npmjs.com/package/micromatch): Glob matching for javascript/node.js. A drop-in replacement and faster alternative to minimatch and multimatch. | [homepage](https://github.com/jonschlinkert/micromatch "Glob matching for javascript/node.js. A drop-in replacement and faster alternative to minimatch and multimatch.")
* [nanomatch](https://www.npmjs.com/package/nanomatch): Fast, minimal glob matcher for node.js. Similar to micromatch, minimatch and multimatch, but complete Bash… [more](https://github.com/jonschlinkert/nanomatch) | [homepage](https://github.com/jonschlinkert/nanomatch "Fast, minimal glob matcher for node.js. Similar to micromatch, minimatch and multimatch, but complete Bash 4.3 wildcard support only (no support for exglobs, posix brackets or braces)")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Contributors

| **Commits** | **Contributor**<br/> | 
| --- | --- | --- | --- | --- | --- | --- | --- |
| 133 | [jonschlinkert](https://github.com/jonschlinkert) |
| 4 | [doowb](https://github.com/doowb) |
| 1 | [es128](https://github.com/es128) |
| 1 | [eush77](https://github.com/eush77) |
| 1 | [hemanth](https://github.com/hemanth) |

### Building docs

_(This document was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

To generate the readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-generate-readme && verb
```

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

### License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/braces/blob/master/LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.2.0, on October 20, 2016._

<hr class="footnotes-sep">
<section class="footnotes">
<ol class="footnotes-list">
<li id="fn1"  class="footnote-item">this is the largest safe integer allowed in JavaScript. <a href="#fnref1" class="footnote-backref">↩</a>

</li>
</ol>
</section>