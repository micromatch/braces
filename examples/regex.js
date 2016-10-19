'use strict';

var mm = require('minimatch');
var braces = require('..');

// console.log(braces.makeRe('a/b/c/{k,l,m}/d/{w,x,y,z}/d/e', {expand: true}));
// console.log(mm.makeRe('a/b/c/{k,l,m}/d/{w,x,y,z}/d/e'));

console.log('braces.makeRe: "foo/{1..20000}/bar/{a..j}/baz"');
console.log(braces.makeRe('foo/{1..20000}/bar/{a..j}/baz'));
console.log();
console.log('minimatch.makeRe: "foo/{1..20000}/bar/{a..j}/baz"');
console.log(mm.makeRe('foo/{1..20000}/bar/{a..j}/baz'));
