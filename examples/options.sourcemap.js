'use strict';

var mm = require('minimatch');
var braces = require('..');

console.log(braces('a/b{1,3}/{x,y,z}', {quantifiers: true}));
