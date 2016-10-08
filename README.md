# braces [![NPM version](https://img.shields.io/npm/v/braces.svg?style=flat)](https://www.npmjs.com/package/braces) [![NPM downloads](https://img.shields.io/npm/dm/braces.svg?style=flat)](https://npmjs.org/package/braces) [![Build Status](https://img.shields.io/travis/jonschlinkert/braces.svg?style=flat)](https://travis-ci.org/jonschlinkert/braces)

> Fast, comprehensive, bash-like brace expansion implemented in JavaScript. Complete support for the Bash 4.3 braces specification, without sacrificing speed.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save braces
```

## Highlights

* **Accurate**: complete support for the [Bash 4.3 Brace Expansion](www.gnu.org/software/bash/) specification (passes all of the Bash brace expansion tests)
* **[fast and performant](#benchmarks)**: not only runs fast, but scales well as patterns increase in complexity (other libs don't)
* **Organized code base**: with parser and compiler that are easy to maintain and update when edge cases crop up.
* **Source map** support
* **Well-tested**: 840+ unit tests with thousands of actual patterns tested. Passes all of the [minimatch](https://github.com/isaacs/minimatch) and [brace-expansion](https://github.com/juliangruber/brace-expansion) unit tests as well.
* **Optimized braces**: By default returns an optimized string that can be used for creating regular expressions for matching.
* **Expanded braces**: Optionally returns an array (like bash). See a [comparison](#optimized-vs-expanded) between optimized and expanded.

## Usage

The main export is a function that takes a brace `pattern` to expand and an `options` object if necessary.

```js
var braces = require('braces');
braces(pattern[, options]);
```

**Example**

```js
console.log(braces('a/{x,y,z}/b', {expand: true}));
//=> ['a/x/b', 'a/y/b', 'a/z/b']

console.log(braces('a/{x,y,z}/b'));
//=> ['a/(x|y|z)/b']
```

## Examples

**Sequences**

```js
console.log(braces('{1..3}'));
//=> ['1', '2', '3']

console.log(braces('{a..c}'));
//=> ['a', 'b', 'c']

console.log(braces('foo/{a..c}'));
//=> ['foo/a', 'foo/b', 'foo/c']
```

**Nested**

```js
console.log(braces('a/{x,{1..5},y}/c'));
//=> ['a/x/c', 'a/1/c', 'a/2/c', 'a/3/c', 'a/4/c', 'a/5/c', 'a/y/c']
```

## Features

* [lists](#lists): Expands bash "lists": `a/{b,c}/d` => `['a/b/d', 'a/c/d']`
* [sequences](#sequences): Expands alphabetical or numerical "sequences" (ranges): `{1..3}` => `['1', '2', '3']`
* [steps](#steps): Supports "steps" or increments: `{2..10..2}` => `['2', '4', '6', '8', '10']`
* [escaping](#escaping)
* [options](#options)

### Lists

```js
braces('a/{foo,bar,baz}/b');
//=> ['a/(foo|bar|baz)/b']

braces('a/{foo,bar,baz}/b', {expand: true});
//=> ['a/foo/b', 'a/bar/b', 'a/baz/b']

braces('{foo,bar,baz}/*.js');
//=> ['foo/*.js', 'bar/*.js', 'baz/*.js']
```

### Sequences

Uses [fill-range](https://github.com/jonschlinkert/fill-range) for to expand sequence operators:

```js
braces('a{1..3}b')
//=> ['a1b', 'a2b', 'a3b']

braces('a{5..8}b')
//=> ['a5b', 'a6b', 'a7b', 'a8b']

braces('a{00..05}b')
//=> ['a00b', 'a01b', 'a02b', 'a03b', 'a04b', 'a05b']

braces('a{01..03}b')
//=> ['a01b', 'a02b', 'a03b']

braces('a{000..005}b')
//=> ['a000b', 'a001b', 'a002b', 'a003b', 'a004b', 'a005b']

braces('a{a..e}b')
//=> ['aab', 'abb', 'acb', 'adb', 'aeb']

braces('a{A..E}b')
//=> ['aAb', 'aBb', 'aCb', 'aDb', 'aEb']
```

Pass a function as the last argument to customize range expansions:

```js
var range = braces('x{a..e}y', function (str, i) {
  return String.fromCharCode(str) + i;
});

console.log(range);
//=> ['xa0y', 'xb1y', 'xc2y', 'xd3y', 'xe4y']
```

See [expand-range](https://github.com/jonschlinkert/expand-range) for additional documentation and to learn about all available range expansion features.

## Options

### options.expand

Type: `Boolean`

Deafault: `undefined`

### options.optimize

Type: `Boolean`

Deafault: `true`

Enabled by default.

### options.nodupes

Type: `Boolean`

Deafault: `true`

Duplicates are removed by default. To keep duplicates, pass `{nodupes: false}` on the options

### options.quantifiers

Type: `Boolean`

Deafault: `undefined`

In regular expressions, quanitifiers may be used to specify how many times a token can be repeated.

For example, the regex `/ab{1,3}c/` will match `a`, then the letter `b`, from `1` to `3` times, then the letter `c`. In other words, `abc`, `abbc` and `abbbc` would all match, but not `ac` or `abbbbc`.

Unfortunately, regex quantifiers happen to share the same syntax as [Bash lists](#Bash lists)

The `quantifiers` option tells braces to detect when [regex quantifiers](#regex quantifiers) are defined in the given pattern, and not to try to expand them as lists.

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

## Optimized vs. Expanded

TODO

## Benchmarks

### Running benchmarks

Install dev dependencies:

```bash
npm i -d && npm benchmark
```

### Latest results

```bash
Benchmarking: (7 of 7)
 · combination-nested
 · combination
 · escaped
 · list-basic
 · list-multiple
 · sequence-basic
 · sequence-multiple

# benchmark/fixtures/combination-nested.js (52 bytes)
  brace-expansion x 5,326 ops/sec ±1.19% (83 runs sampled)
  braces x 11,510,149 ops/sec ±1.38% (84 runs sampled)
  minimatch x 5,560 ops/sec ±1.18% (82 runs sampled)

  fastest is braces

# benchmark/fixtures/combination.js (51 bytes)
  brace-expansion x 637 ops/sec ±1.39% (84 runs sampled)
  braces x 10,902,159 ops/sec ±1.36% (86 runs sampled)
  minimatch x 686 ops/sec ±1.42% (81 runs sampled)

  fastest is braces

# benchmark/fixtures/escaped.js (44 bytes)
  brace-expansion x 157,111 ops/sec ±1.35% (83 runs sampled)
  braces x 11,238,206 ops/sec ±1.41% (85 runs sampled)
  minimatch x 175,069 ops/sec ±1.25% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/list-basic.js (40 bytes)
  brace-expansion x 105,715 ops/sec ±1.53% (85 runs sampled)
  braces x 11,668,861 ops/sec ±1.39% (85 runs sampled)
  minimatch x 103,579 ops/sec ±1.23% (88 runs sampled)

  fastest is braces

# benchmark/fixtures/list-multiple.js (52 bytes)
  brace-expansion x 35,800 ops/sec ±1.23% (85 runs sampled)
  braces x 9,853,090 ops/sec ±1.42% (82 runs sampled)
  minimatch x 34,487 ops/sec ±1.57% (83 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-basic.js (41 bytes)
  brace-expansion x 5,396 ops/sec ±1.44% (85 runs sampled)
  braces x 9,469,841 ops/sec ±1.33% (81 runs sampled)
  minimatch x 5,409 ops/sec ±1.48% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-multiple.js (51 bytes)
  brace-expansion x 105 ops/sec ±1.96% (70 runs sampled)
  braces x 8,603,064 ops/sec ±1.34% (82 runs sampled)
  minimatch x 116 ops/sec ±1.50% (72 runs sampled)

  fastest is braces
```

## Why is braces [so fast](#benchmarks)?

**Parser/compiler**

Braces uses a "real" parser and compiler to create a highly optimized regex that is often a fraction of the size of the value produced by [minimatch](https://github.com/isaacs/minimatch) (or rather, the library it uses for [brace-expansion](https://github.com/juliangruber/brace-expansion)).

## About

### Related projects

* [expand-range](https://www.npmjs.com/package/expand-range): Fast, bash-like range expansion. Expand a range of numbers or letters, uppercase or lowercase. See… [more](https://github.com/jonschlinkert/expand-range) | [homepage](https://github.com/jonschlinkert/expand-range "Fast, bash-like range expansion. Expand a range of numbers or letters, uppercase or lowercase. See the benchmarks. Used by micromatch.")
* [fill-range](https://www.npmjs.com/package/fill-range): Fill in a range of numbers or letters, optionally passing an increment or `step` to… [more](https://github.com/jonschlinkert/fill-range) | [homepage](https://github.com/jonschlinkert/fill-range "Fill in a range of numbers or letters, optionally passing an increment or `step` to use, or create a regex-compatible range with `options.toRegex`")
* [micromatch](https://www.npmjs.com/package/micromatch): Glob matching for javascript/node.js. A drop-in replacement and faster alternative to minimatch and multimatch. | [homepage](https://github.com/jonschlinkert/micromatch "Glob matching for javascript/node.js. A drop-in replacement and faster alternative to minimatch and multimatch.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Contributors

| **Commits** | **Contributor**<br/> | 
| --- | --- |
| 130 | [jonschlinkert](https://github.com/jonschlinkert) |
| 4 | [doowb](https://github.com/doowb) |
| 1 | [eush77](https://github.com/eush77) |

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

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.1.31, on October 08, 2016._