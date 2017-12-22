'use strict';

var braces = require('..');

console.log(braces('foo*{/*,*}'));
console.log(braces('foo (abc, 1990)'));
