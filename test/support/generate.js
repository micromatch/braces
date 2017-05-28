'use strict';

var braces = require('../..');
var mm = require('minimatch');
var text = require('text-table');
var Time = require('time-diff');
var time = new Time();

var table = [
  ['**Pattern**', '**braces**', '**minimatch**'],
  ['---', '---', '---']
];

// warm up both libs
mm.braceExpand('{a,b}');
braces('{a,b}');

function generate(pattern) {
  time.start('braces');
  var bval = braces(pattern, {rangeLimit: false}).join('|');
  var b = [wrap(format(bval.length)), '(' + time.end('braces', 'μs') + ')'].join(' ');

  time.start('minimatch');
  var mval = mm.braceExpand(pattern).join('|');
  var m = [wrap(format(mval.length)), '(' + time.end('minimatch', 'μs') + ')'].join(' ');

  table.push([wrap(pattern), b, m]);
  return table;
}

function wrap(str) {
  return '`' + str + '`';
}

var patterns = [
  // '{1..9007199254740991}',
  // '{1..1000000000000000}',
  // '{1..100000000000000}',
  // '{1..10000000000000}',
  // '{1..1000000000000}',
  // '{1..100000000000}',
  // '{1..10000000000}',
  // '{1..1000000000}',
  // '{1..100000000}',
  '{1..10000000}',
  '{1..1000000}',
  '{1..100000}',
  '{1..10000}',
  '{1..1000}',
  '{1..100}',
  '{1..10}',
  '{1..3}',
  // '/some/file/path/id-{0001..2017}',
  // '/some/file/path/id-{0100..2017}',
  // '/some/file/path/id-{1000..2017}',
  // '/some/file/path/id-{1900..2017}',
  // '/some/file/path/id-{2000..2017}',
];

for (var i = 0; i < patterns.length; i++) {
  generate(patterns[i]);
}

console.log(text(table, {hsep: ' | '}));

function format(number, precision) {
  if (typeof precision !== 'number') {
    precision = 2;
  }

  var abbr = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  precision = Math.pow(10, precision);
  number = Number(number);

  var len = abbr.length - 1;
  while (len-- >= 0) {
    var size = Math.pow(10, len * 3);
    if (size <= (number + 1)) {
      number = Math.round(number * precision / size) / precision;
      number += ' ' + abbr[len];
      break;
    }
  }
  return number;
}

