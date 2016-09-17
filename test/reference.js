'use strict';

require('mocha');
var util = require('util');
var assert = require('assert');
var forOwn = require('for-own');
var minimatch = require('minimatch');
var reference = require('./reference/');
var braces = require('..');

function compare(fixture, expected, options) {
  expected = stringify(expected.sort());
  var output = braces.expand(fixture, options).sort();
  console.log(output)
  var str = stringify(output);
  var msg = ' (' + fixture + ')\n\n      "' + str + '" !== "' + expected + '"\n';
  assert.deepEqual(str, expected, msg);
}

function stringify(arr) {
  return util.inspect(arr.sort(), null, 10);
}

function esc(str) {
  return new RegExp(str.replace(/([{}])/g, '\\$1'));
}

// describe.skip('braces', function() {
//   after(function() {
//     // console.log(util.inspect(reference, null, 10));
//   });

//   reference.forEach(function(section) {
//     forOwn(section, function(tests, str) {
//       // if (!/support sequ/.test(str)) return;

//       describe('"' + str + '"', function() {
//         var i = 0;

//         tests
//           .filter(function(obj) {
//             return obj.only !== true;
//           })
//           .forEach(function(obj) {
//             it((i++) + ' "' + obj.fixture, function() {
//               var actual = stringify(obj.actual);

//               // compare(obj.fixture, obj.expected, obj.options);
//               if (obj.skip !== 'minimatch') {
//                 obj.minimatch = minimatch.braceExpand(obj.fixture);
//                 obj.equal = stringify(obj.minimatch) === actual;
//                 if (!obj.equal) {
//                   console.log(stringify(obj.actual), stringify(obj.minimatch));
//                 }
//               }

//               compare(obj.fixture, obj.expected, obj.options || {makeRe: false});
//             });
//           });

//       });
//     });
//   });
// });
