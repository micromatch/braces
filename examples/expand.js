'use strict';

var mm = require('minimatch');
var braces = require('..');

console.log(braces.expand('a/{b,c}/d'));
//=> [ 'a/b/d', 'a/c/d' ]

var ast = braces.parse('a{b{a,b}}c');
var res = braces.compile(ast, {expand: true});
console.log(res)

console.log(braces.expand('{1..100}{1..100}').length);
console.log(braces.expand('{1..10}{1..10}{1..10}').length);
