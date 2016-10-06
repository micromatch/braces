/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

require('mocha');
var assert = require('assert');
var support = require('./support/compare');
var braces = require('..');
var compare;

describe('.match', function() {
  beforeEach(function() {
    compare = support();
  });

  it('should return an array of matching strings', function() {
    var fixtures = ['a/b/d', 'a/c/d', 'a/z/d'];
    assert.deepEqual(braces.match(fixtures, 'a/{b,c}/d'), ['a/b/d', 'a/c/d']);
    assert.deepEqual(braces.match(fixtures, 'a/{x..z}/d'), ['a/z/d']);
  });
});
