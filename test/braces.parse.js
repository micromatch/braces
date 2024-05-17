'use strict';

require('mocha');
const assert = require('assert').strict;
const parse = require('../lib/parse');

describe('braces.parse()', () => {
  describe('errors', () => {
    it('should throw an error when string exceeds max safe length', () => {
      let MAX_LENGTH = 1024 * 64;
      assert.throws(() => parse('.'.repeat(MAX_LENGTH + 2)));
    });
    it('should throw an error when symbols exceeds max symbols count default', () => {
      let SYMBOLS= 1024;
      assert.throws(() => parse('.'.repeat(MAX_SYMBOLS * 2)));
    });
    it('should throw an error when symbols exceeds max symbols count ', () => {
      let SYMBOLS= 2;
      assert.throws(() => parse('...', {
        maxSymbols: 2,
      }));
    });
  });

  describe('valid', () => {
    it('should return an AST', () => {
      let ast = parse('a/{b,c}/d');
      let brace = ast.nodes.find(node => node.type === 'brace');
      assert(brace);
      assert.equal(brace.nodes.length, 5);
    });

    it('should ignore braces inside brackets', () => {
      let ast = parse('a/[{b,c}]/d');
      assert.equal(ast.nodes[1].type, 'text');
      assert.equal(ast.nodes[1].value, 'a/[{b,c}]/d');
    });

    it('should parse braces with brackets inside', () => {
      let ast = parse('a/{a,b,[{c,d}]}/e');
      let brace = ast.nodes[2];
      let bracket = brace.nodes.find(node => node.value[0] === '[');
      assert(bracket);
      assert.equal(bracket.value, '[{c,d}]');
    });
  });

  describe('invalid', () => {
    it('should escape standalone closing braces', () => {
      let one = parse('}');
      assert.equal(one.nodes[1].type, 'text');
      assert.equal(one.nodes[1].value, '}');

      let two = parse('a}b');
      assert.equal(two.nodes[1].type, 'text');
      assert.equal(two.nodes[1].value, 'a}b');
    });
  });
});
