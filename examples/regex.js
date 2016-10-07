'use strict';

var mm = require('minimatch');
var braces = require('..');

// console.log(braces.makeRe('a/b/c/{k,l,m}/d/{w,x,y,z}/d/e', {expand: true}));
// console.log(mm.makeRe('a/b/c/{k,l,m}/d/{w,x,y,z}/d/e'));

console.log('braces.makeRe');
console.log(braces.makeRe('a/b/c/{1..10}/d/{a..z}/d/e'));
console.log();
console.log('minimatch.makeRe');
console.log(mm.makeRe('a/b/c/{1..10}/d/{a..z}/d/e'));
