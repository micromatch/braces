'use strict';

require('mocha');
const assert = require('assert').strict;
const braces = require('..');

const nested = (open, close, depth) => open.repeat(depth) + 'a,b' + close.repeat(depth);

describe('nesting depth', () => {
  describe('deeply nested patterns', () => {
    // 4,995 levels stays under the default maxLength of 10,000
    const deepBraces = nested('{', '}', 4995);
    const deepParens = nested('(', ')', 4995);

    it('should not overflow the stack when compiling', () => {
      assert.equal(typeof braces(deepBraces)[0], 'string');
      assert.equal(typeof braces(deepParens)[0], 'string');
    });

    it('should not overflow the stack when expanding', () => {
      assert.ok(Array.isArray(braces.expand(deepBraces)));
      assert.ok(Array.isArray(braces.expand(deepParens)));
    });

    it('should not overflow the stack when stringifying', () => {
      assert.equal(braces.stringify(deepBraces), deepBraces);
      assert.equal(braces.stringify(deepParens), deepParens);
    });
  });

  describe('options.maxDepth', () => {
    it('should not change results for patterns within the limit', () => {
      assert.deepEqual(braces.expand('a{b,{c,{d,e}}}f'), ['abf', 'acf', 'adf', 'aef']);
    });

    it('should treat nesting beyond the limit as literal text', () => {
      assert.deepEqual(braces.expand('{{a,b},c}', { maxDepth: 1 }), ['{a,b}', 'c']);
      assert.deepEqual(braces.expand('{{a,b},c}', { maxDepth: 2 }), ['a', 'b', 'c']);
    });

    it('should keep escaped characters beyond the limit', () => {
      assert.deepEqual(braces.expand('{{a,\\}b},c}', { maxDepth: 1 }), ['{a,\\}b}', 'c']);
    });

    it('should only close a literal group with its own delimiter type', () => {
      assert.deepEqual(braces.expand('{{a),b},c}', { maxDepth: 1 }), ['{a),b}', 'c']);
      assert.deepEqual(braces.expand('{(a},b),c}', { maxDepth: 1 }), ['(a},b)', 'c']);
    });

    it('should keep brackets and quotes intact beyond the limit', () => {
      assert.deepEqual(braces.expand('{{[}],a},b}', { maxDepth: 1 }), ['{[}],a}', 'b']);
      assert.deepEqual(braces.expand('{{a,"}"},b}', { maxDepth: 1 }), ['{a,"}"}', 'b']);
    });

    it('should treat an unclosed group beyond the limit as text to the end', () => {
      assert.deepEqual(braces.expand('{{a(,b},c}', { maxDepth: 1 }), ['{{a(,b},c}']);
      assert.deepEqual(braces.expand('{a,{b', { maxDepth: 1 }), ['{a,{b']);
    });

    it('should apply the same rules at the default limit', () => {
      const wrap = str => '('.repeat(255) + str + ')'.repeat(255);
      assert.deepEqual(braces.expand(wrap('{{a),b},c}')), [wrap('{a),b}'), wrap('c')]);
    });

    it('should not allow the limit to be raised above the default', () => {
      assert.ok(Array.isArray(braces.expand(nested('{', '}', 4995), { maxDepth: Infinity })));
    });

    it('should fall back to the default when the value is invalid', () => {
      for (const maxDepth of [NaN, -1, '1']) {
        assert.deepEqual(braces.expand('{{a,b},c}', { maxDepth }), ['a', 'b', 'c']);
      }
    });
  });
});
