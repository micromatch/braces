'use strict';

var mm = require('minimatch');
var braces = require('..');

console.log(braces.expand('a/{b,c}/d'));
//=> [ 'a/b/d', 'a/c/d' ]

var ast = braces.parse('a${b{a,b}}c', {sourcemap: true});
var res = braces.compile(ast);
console.log(res.ast)


console.log(braces.expand('{1..100}{1..100}').length);
console.log(braces.expand('{1..10}{1..10}{1..10}').length);
