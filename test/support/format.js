'use strict';

var util = require('util');
var path = require('path');
var write = require('write');
var minimatch = require('minimatch');
var stringify = require('./stringify');
var argv = require('yargs-parser')(process.argv.slice(2), {
  alias: {log: 'l', write: 'w', unit: 'u'}
});

var generate = require('./bash');
var newTests = require('../reference/add');
var tests = require('../reference/');
var braces = require('../..');

function addTests(newTests, existing) {
  for (var key in newTests) {
    if (newTests.hasOwnProperty(key)) {
      var val = newTests[key];
      if (existing.hasOwnProperty(key)) {
        existing[key].units = existing[key].units.concat(val.units);
      } else {
        existing[key] = val;
      }
    }
  }
}

function mapVisit(tests, fn) {
  for (var key in tests) {
    if (tests.hasOwnProperty(key)) {
      var val = tests[key];
      tests[key] = fn(key, val, val.units) || val;
    }
  }
  return tests;
}

function visit(units, fn) {
  var res = [];
  for (var i = 0; i < units.length; i++) {
    res.push(fn(units[i]) || units[i]);
  }
  return res;
}

function compare(one, two) {
  var a = util.inspect(one, {depth: null});
  var b = util.inspect(two, {depth: null});
  return a === b;
}

addTests(newTests, tests);
var updatedTests = mapVisit(tests, function(name, test, units) {
  test.units = visit(units, function(unit) {
    var obj = {
      options: {},
      fixture: unit.fixture,
      expanded: {
        // actual: unit.actual,
        actual: braces.expand(unit.fixture, unit.options)
          .map(function(str) {
            return str.replace(/\\+/g, '');
          })
          .filter(function(str) {
            return str !== '\\' && str !== '';
          }),
        expected: unit.expected,
        minimatch: minimatch.braceExpand(unit.fixture, unit.options),
        bash: generate(unit.fixture)
      },
      optimized: {
        actual: braces(unit.fixture, unit.options).replace(/\\+/g, ''),
        // expected: braces(unit.fixture, unit.options).replace(/\\+/g, '\\')
        expected: ''
      },
      equal: {}
    };

    obj.expanded.expected = obj.expanded.bash;

    // compare results
    obj.equal.braces_to_bash = compare(obj.expanded.actual, obj.expanded.bash);
    obj.equal.braces_to_minimatch = compare(obj.expanded.actual, obj.expanded.minimatch);
    obj.equal.minimatch_to_bash = compare(obj.expanded.bash, obj.expanded.minimatch);

    // fill in "expected"
    obj.expanded.expected = obj.expanded.expected || obj.expanded.bash;
    if (argv.unit) {
      console.log(unit);
    }
    return obj;
  });
  return test;
});

var str = 'module.exports = ' + stringify(updatedTests);

if (argv.log) {
  console.log(str);
}

if (argv.write) {
  write.sync(path.join(__dirname, '../reference/index.js'), str);
}
