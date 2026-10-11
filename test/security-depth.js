'use strict';
require('mocha');
const assert = require('assert');
const braces = require('..');

describe('bounded parser and supplied AST traversal', () => {
  for (const operation of ['compile', 'expand', 'stringify']) {
    it(`rejects deep and cyclic ASTs in ${operation}`, () => {
      let ast = { type: 'text', value: 'x' };
      for (let i = 0; i < 12000; i++) ast = { type: 'root', nodes: [ast] };
      assert.throws(() => braces[operation](ast), SyntaxError);
      const cycle = { type: 'root', nodes: [] };
      cycle.nodes.push(cycle);
      assert.throws(() => braces[operation](cycle), SyntaxError);
    });
  }
  it('rejects deeply nested parsed patterns', () => {
    for (const pair of [['{', '}'], ['(', ')']]) {
      assert.throws(() => braces.parse(pair[0].repeat(4000) + 'x' + pair[1].repeat(4000)), SyntaxError);
    }
  });
  it('preserves ordinary ranges, nesting and shared acyclic nodes', () => {
    assert.deepStrictEqual(braces.expand('a/{1..3}/{x,y}'), ['a/1/x', 'a/1/y', 'a/2/x', 'a/2/y', 'a/3/x', 'a/3/y']);
    const leaf = { type: 'text', value: 'a' };
    assert.strictEqual(braces.stringify({ type: 'root', nodes: [leaf, leaf] }), 'aa');
    assert.doesNotThrow(() => braces.compile('{'.repeat(64) + 'x,y' + '}'.repeat(64)));
  });
});
