'use strict';

require('mocha');
const assert = require('assert').strict;
const parse = require('../lib/parse');

describe('braces.parse()', () => {
  describe('errors', () => {
    it('should throw an error when string exceeds max safe length', () => {
      const MAX_LENGTH = 1024 * 64;
      assert.throws(() => parse('.'.repeat(MAX_LENGTH + 2)));
    });

    it('should throw an error when nesting exceeds the maximum depth', () => {
      assert.throws(
        () => parse('{'.repeat(101) + 'a,b' + '}'.repeat(101)),
        /exceeds max depth/
      );
      assert.throws(() => parse('('.repeat(101) + ')'.repeat(101)), /exceeds max depth/);
    });

    it('should accept patterns at the maximum nesting depth', () => {
      assert.doesNotThrow(() => parse('{'.repeat(100) + 'a,b' + '}'.repeat(100)));
      assert.doesNotThrow(() => parse('('.repeat(100) + 'a' + ')'.repeat(100)));
    });

    it('should support a lower maximum depth', () => {
      assert.throws(() => parse('{{a,b},c}', { maxDepth: 1 }), /exceeds max depth/);
      assert.doesNotThrow(() => parse('{{a,b},c}', { maxDepth: 2 }));
    });

    it('should enforce fractional maximum depth values', () => {
      assert.doesNotThrow(() => parse('{a,b}', { maxDepth: 1.5 }));
      assert.throws(() => parse('{{a,b},c}', { maxDepth: 1.5 }), /exceeds max depth/);
      assert.doesNotThrow(() => parse('(a)', { maxDepth: 1.5 }));
      assert.throws(() => parse('((a))', { maxDepth: 1.5 }), /exceeds max depth/);
    });
  });

  describe('valid', () => {
    it('should return an AST', () => {
      const ast = parse('a/{b,c}/d');
      const brace = ast.nodes.find(node => node.type === 'brace');
      assert.ok(brace);
      assert.equal(brace.nodes.length, 5);
    });

    it('should ignore braces inside brackets', () => {
      const ast = parse('a/[{b,c}]/d');
      assert.equal(ast.nodes[1].type, 'text');
      assert.equal(ast.nodes[1].value, 'a/[{b,c}]/d');
    });

    it('should parse braces with brackets inside', () => {
      const ast = parse('a/{a,b,[{c,d}]}/e');
      const brace = ast.nodes[2];
      const bracket = brace.nodes.find(node => node.value[0] === '[');
      assert.ok(bracket);
      assert.equal(bracket.value, '[{c,d}]');
    });
  });

  describe('invalid', () => {
    it('should escape standalone closing braces', () => {
      const one = parse('}');
      assert.equal(one.nodes[1].type, 'text');
      assert.equal(one.nodes[1].value, '}');

      const two = parse('a}b');
      assert.equal(two.nodes[1].type, 'text');
      assert.equal(two.nodes[1].value, 'a}b');
    });
  });
});
