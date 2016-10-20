'use strict';

var mm = require('minimatch');
var braces = require('..');

console.log(braces.expand('a/{b,c}/d'));
//=> [ 'a/b/d', 'a/c/d' ]
