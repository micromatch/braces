'use strict';

var braces = require('..');
console.log(braces.expand('{!(a|b),!(c|d)}'));
console.log(braces('{!(a|b),!(c|d)}'));
