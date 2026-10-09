'use strict';

require('mocha');
const assert = require('assert').strict;
const braces = require('..');

const nest = n => '{'.repeat(n) + 'a,b' + '}'.repeat(n);

describe('maxDepth (stack exhaustion, CVE-2026-93687)', () => {
  it('should throw a SyntaxError for deeply nested braces instead of overflowing the stack', () => {
    for (const fn of [braces, braces.expand, braces.parse, braces.compile]) {
      assert.throws(() => fn(nest(4900)), { name: 'SyntaxError', message: /max depth/ });
    }
  });

  it('should throw for deeply nested unbalanced braces', () => {
    assert.throws(() => braces.parse('{'.repeat(4900)), SyntaxError);
  });

  it('should throw for deeply nested parens', () => {
    assert.throws(() => braces.parse('('.repeat(4900)), SyntaxError);
  });

  it('should still handle nesting at exactly the default limit (256)', () => {
    assert.doesNotThrow(() => braces(nest(256)));
    assert.doesNotThrow(() => braces.expand(nest(256)));
    assert.throws(() => braces(nest(257)), SyntaxError);
  });

  it('should respect options.maxDepth', () => {
    assert.deepEqual(braces.expand('{{a,b},c}', { maxDepth: 2 }), ['a', 'b', 'c']);
    assert.throws(() => braces('{{{a,b}}}', { maxDepth: 2 }), SyntaxError);
  });

  it('should not allow raising maxDepth above the default', () => {
    assert.throws(() => braces(nest(257), { maxDepth: 1e9 }), SyntaxError);
  });

  describe('hand-built ASTs (bypass parse)', () => {
    const build = n => {
      const root = { type: 'root', nodes: [] };
      let cur = root;
      for (let i = 0; i < n; i++) {
        const next = { type: 'brace', nodes: [] };
        cur.nodes.push(next);
        cur = next;
      }
      cur.nodes.push({ type: 'text', value: 'a' });
      return root;
    };

    it('should throw instead of overflowing in compile, expand and stringify', () => {
      const ast = build(4900);
      assert.throws(() => braces.compile(ast), { name: 'SyntaxError', message: /max depth/ });
      assert.throws(() => braces.expand(ast), { name: 'SyntaxError', message: /max depth/ });
      assert.throws(() => braces.stringify(ast), { name: 'SyntaxError', message: /max depth/ });
    });

    it('should respect options.maxDepth in the walkers', () => {
      assert.throws(() => braces.stringify(build(5), { maxDepth: 3 }), SyntaxError);
      assert.equal(braces.stringify(build(3), { maxDepth: 3 }), 'a');
    });
  });
});
