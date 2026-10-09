'use strict';

require('mocha');
const assert = require('assert').strict;
const stringify = require('../lib/stringify');
const parse = require('../lib/parse');

describe('braces.stringify()', () => {
  it('should reject deeply nested ASTs', () => {
    let ast = { type: 'text', value: 'a' };
    for (let i = 0; i < 101; i++) ast = { type: 'brace', nodes: [ast] };
    ast = { type: 'root', nodes: [ast] };
    assert.throws(() => stringify(ast), /exceeds max depth/);
  });

  it('should stringify patterns at the maximum nesting depth', () => {
    const pattern = '{'.repeat(100) + 'a,b' + '}'.repeat(100);
    assert.equal(stringify(parse(pattern)), pattern);
    assert.throws(() => stringify(parse('{a,b}'), { maxDepth: 0 }), /exceeds max depth/);
  });

  it('should not escape valid nested braces when escapeInvalid is set', () => {
    for (const pattern of ['{{a}}', '{a,{b}}', '{{x}y}', '{a,{b,{c}}', '{}{a}']) {
      assert.equal(stringify(parse(pattern), { escapeInvalid: true }), pattern);
    }
  });
});
