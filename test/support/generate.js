'use strict';

var braces = require('../..');
var mm = require('minimatch');
var size = require('pretty-bytes');
var text = require('text-table');
var Time = require('time-diff');
var time = new Time();

var table = [
  ['**Pattern**', '**minimatch**', '**braces**'],
  ['---', '---', '---'],
];

function generate(pattern) {
  // time.start('minimatch');

  // var mval = mm.braceExpand(pattern).join('|');
  // var m = [wrap(size(mval.length)), '(' + time.end('minimatch', 'μs') + ')'].join(' ');

  time.start('braces');
  var bval = braces.expand(pattern).join('|');
  var b = [wrap(size(bval.length)), '(' + time.end('braces', 'μs') + ')'].join(' ');

  table.push([wrap(pattern), 'm', b]);
  return table;
}

function wrap(str) {
  return '`' + str + '`';
}

var patterns = [
  '{1..9007199254740991}',
  // 'a/{1..10000000}',
  // 'a/{1..1000000}',
  // 'a/{1..100000}',
  // 'a/{1..10000}',
  // 'a/{1..1000}',
  // 'a/{1..100}',
  // 'a/{1..10}',
  // 'a/{1..3}',
  // 'a/{2000..2016}/bar/{a..j}/baz',
  // 'a/{1900..2016}/bar/{a..j}/baz',
  // 'a/{1000..2016}/bar/{a..j}/baz',
  // 'a/{100..2016}/bar/{a..j}/baz',
];

var len = patterns.length;
var idx = -1;
var res = [];

while (++idx < len) {
  generate(patterns[idx]);
}

console.log(text(table, {hsep: ' | '}));
