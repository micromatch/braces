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

  it('should still handle nesting at exactly the default limit', () => {
    assert.doesNotThrow(() => braces(nest(1000)));
    assert.doesNotThrow(() => braces.expand(nest(1000)));
    assert.throws(() => braces(nest(1001)), SyntaxError);
  });

  it('should respect options.maxDepth', () => {
    assert.deepEqual(braces.expand('{{a,b},c}', { maxDepth: 2 }), ['a', 'b', 'c']);
    assert.throws(() => braces('{{{a,b}}}', { maxDepth: 2 }), SyntaxError);
  });

  it('should not allow raising maxDepth above the default', () => {
    assert.throws(() => braces(nest(1001), { maxDepth: 1e9 }), SyntaxError);
  });
});
