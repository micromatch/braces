var braces = require('./');

var a = 'a{,}';
var b = 'a{,}{,}';
var c = '{a,b,c}/a{,}{,}{,}';

console.log(braces(a, {nodupes: false}).join(''));
console.log(braces(b, {nodupes: false}).join(''));
console.log(braces(c, {nodupes: false}).join(''));
