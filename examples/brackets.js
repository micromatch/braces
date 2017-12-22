'use strict';

var braces = require('..');
var list = ['foo.js', '(a).js', '(b).js', '(c).js'];
console.log(braces.match(list, '{([a-b]),foo}.js'));
console.log(braces.expand('{([a-b]),foo}.js'));
console.log(braces.expand('{[dec-1992],[dec-1993]}.js'));
