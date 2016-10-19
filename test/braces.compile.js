'use strict';

require('mocha');
var assert = require('assert');
var braces = require('..');

describe('.compile', function() {
  it('should return an object', function() {
    var res = braces.compile('a/{b,c}/d');
    assert(res);
    assert.equal(typeof res, 'object');
  });

  it('should return output as an array', function() {
    var res = braces.compile('a/{b,c}/d');
    assert(Array.isArray(res.output));
    assert.deepEqual(res.output, ['a/(b|c)/d']);
  });
});
