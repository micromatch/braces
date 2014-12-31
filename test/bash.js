'use strict';

var path = require('path');
var should = require('should');
var argv = require('minimist')(process.argv.slice(2));
var fixtures = require('./fixtures/bash-node');
var mm;

if ('minimatch' in argv) {
  mm = require('minimatch').braceExpand;
} else {
  mm = require('..');
}

if (argv.t) {
  fixtures = require('./fixtures/bash-' + argv.t);
}

function expand(pattern) {
  return mm(pattern).sort();
}

describe('bash', function () {
  describe('bash 4.3 support', function () {
    fixtures.forEach(function(test, i) {
      it('test: ' + i, function () {
        mm(test[0]).sort().should.eql(test[1].sort());
      });
    });
  });
});
