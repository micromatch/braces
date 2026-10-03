'use strict';

require('mocha');
const assert = require('assert').strict;
const braces = require('..');

const nest = (n) => '{'.repeat(n) + '}'.repeat(n);
const isDepthError = (err) => {
  return err instanceof RangeError && /maximum nesting depth/.test(err.message);
};

describe('depth guards on recursive walkers (CWE-674)', () => {
  it('compile: deeply nested input throws a controlled RangeError', () => {
    assert.throws(() => braces.compile(nest(3500)), isDepthError);
  });

  it('expand: deeply nested input throws a controlled RangeError', () => {
    assert.throws(() => braces.expand(nest(3500)), isDepthError);
  });

  it('shallow and normally nested patterns are unaffected', () => {
    assert.deepEqual(braces.expand('a{1..3}b{c,d}'), ['a1bc', 'a1bd', 'a2bc', 'a2bd', 'a3bc', 'a3bd']);
    assert.deepEqual(braces.expand('{a,b{1..2}}'), ['a', 'b1', 'b2']);
    assert.deepEqual(braces('a{1..3}b{c,d}'), ['a([1-3])b(c|d)']);
    assert.deepEqual(braces('{a,b{1..2}}'), ['(a|b(1|2))']);
    assert.equal(braces.compile('a{1..3}b{c,d}'), 'a([1-3])b(c|d)');
    assert.doesNotThrow(() => braces.compile(nest(32)));
  });

  it('options.maxDepth raises or lowers the limit', () => {
    assert.doesNotThrow(() => braces.compile(nest(50), { maxDepth: 100 }));
    assert.throws(() => braces.compile(nest(200), { maxDepth: 100 }), isDepthError);
    assert.throws(() => braces.compile(nest(3500), { maxDepth: 100 }), isDepthError);
  });
});
