'use strict';

const compile = require('../lib/compile');
const parse = require('../lib/parse');
console.log(compile(parse('{a,b,c}')));
console.log(compile(parse('{01..09}')));
