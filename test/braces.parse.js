'use strict';

require('mocha');
var assert = require('assert');
var braces = require('..');

describe('.parse', function() {
  it('should return an AST object', function() {
    var ast = braces.parse('a/{b,c}/d');
    assert(ast);
    assert.equal(typeof ast, 'object');
  });

  it('should have an array of nodes', function() {
    var ast = braces.parse('a/{b,c}/d');
    assert(Array.isArray(ast.nodes));
  });
});
