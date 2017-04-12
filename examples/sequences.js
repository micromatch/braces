'use strict';

var mm = require('minimatch');
var braces = require('..');

console.log(braces('{1..5}', {expand: true}));
//=> [ '1', '2', '3', '4', '5' ]

console.log(braces('{"1..5"}', {expand: true}))
