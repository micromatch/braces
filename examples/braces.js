'use strict';

var braces = require('..');
// console.log(braces('some/path/{a,b,c}'));
// console.log(braces.expand('some/path/{a,b,c}'));

var res = braces('{1..10000000}');
console.log(res);
console.log(format(res[0].length));

var res = braces('{1..100000000}');
console.log(res);
console.log(format(res[0].length));
