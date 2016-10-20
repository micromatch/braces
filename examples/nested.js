'use strict';

var minimatch = require('minimatch');
var braces = require('..');

console.log('braces');
console.log(braces.makeRe('a{b,c{1..100}/{foo/bar},h}x/z'));
console.log();
console.log();
console.log('brace-expansion');
console.log(minimatch.makeRe('a{b,c{1..100}/{foo/bar},h}x/z'));

