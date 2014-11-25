'use strict';

var path = require('path');
var should = require('should');
var mm = require('minimatch').braceExpand;
var expand = require('..');

var failing = require('./fixtures/failing');
var spec = require('./fixtures/spec');

// describe('braces: bash 4.3 support (passing)', function () {
//   spec.forEach(function(test, i) {
//     it('test: ' + i, function () {
//       expand(test[0]).should.eql(test[1]);
//     });
//   });
// });

// describe('braces: bash 4.3 support (failing)', function () {
//   failing.forEach(function(test, i) {
//     it('test: ' + i, function () {
//       expand(test[0]).should.eql(test[1]);
//     });
//   });
// });

describe('minimatch: bash 4.3 support (passing)', function () {
  spec.forEach(function(test, i) {
    it('test: ' + i, function () {
      mm(test[0]).should.eql(test[1]);
    });
  });
});

describe('minimatch: bash 4.3 support (failing)', function () {
  failing.forEach(function(test, i) {
    it('test: ' + i, function () {
      mm(test[0]).should.eql(test[1]);
    });
  });
});
