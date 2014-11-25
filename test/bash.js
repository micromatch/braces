'use strict';

var path = require('path');
// var utils = require('./utils');
var should = require('should');
var expand = require('..');

describe('braces', function () {
  // utils.addSpecTests(path.join(__dirname, 'fixtures/bash/spec.txt'), braces);

  it('should expand numerical ranges', function () {
    expand('{1..10.f}').should.eql([ '{1..10.f}' ]);
  });
  it('should expand numerical ranges', function () {
    expand('{1..ff}').should.eql([ '{1..ff}' ]);
  });
  it('should expand numerical ranges', function () {
    expand('{1..10..ff}').should.eql([ '{1..10..ff}' ]);
  });
  it('should expand numerical ranges', function () {
    expand('{1.20..2}').should.eql([ '{1.20..2}' ]);
  });
  it('should expand numerical ranges', function () {
    expand('{1..20..f2}').should.eql([ '{1..20..f2}' ]);
  });
  it('should expand numerical ranges', function () {
    expand('{1..20..2f}').should.eql([ '{1..20..2f}' ]);
  });
  it('should expand numerical ranges', function () {
    expand('{1..2f..2}').should.eql([ '{1..2f..2}' ]);
  });
  it('should expand numerical ranges', function () {
    expand('{1..ff..2}').should.eql([ '{1..ff..2}' ]);
  });
  it('should expand numerical ranges', function () {
    expand('{1..ff}').should.eql([ '{1..ff}' ]);
  });
  it('should expand numerical ranges', function () {
    expand('{1..f}').should.eql([ '{1..f}' ]);
  });
  it('should expand numerical ranges', function () {
    expand('{1..0f}').should.eql([ '{1..0f}' ]);
  });
  it('should expand numerical ranges', function () {
    expand('{1..10f}').should.eql([ '{1..10f}' ]);
  });
  it('should expand numerical ranges', function () {
    expand('{1..10.f}').should.eql([ '{1..10.f}' ]);
  });
  it('should expand numerical ranges', function () {
    expand('{1..10.f}').should.eql([ '{1..10.f}' ]);
  });
});
