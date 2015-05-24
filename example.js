var braces = require('./');


var a = 'a{,}';
var b = 'a{,}{,}';
var c = '{a,b,c}/a{,}{,}{,}';

console.log(braces(c, {nodupes: false}).join(''))
