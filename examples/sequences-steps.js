'use strict';

var mm = require('minimatch');
var braces = require('..');

console.log(braces('{0..10..2}', {expand: true}));
//=> [ '0', '2', '4', '6', '8', '10' ]
