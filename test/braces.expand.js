'use strict';

require('mocha');
const assert = require('assert').strict;
const expand = require('../lib/expand');
const parse = require('../lib/parse');

describe('braces.expand()', () => {
  it('should expand an AST', () => {
    let actual = expand(parse('a/{b,c}/d'));
    assert.deepEqual(actual, ['a/b/d', 'a/c/d']);
  });
});
