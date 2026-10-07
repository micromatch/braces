'use strict';

require('mocha');
const assert = require('assert').strict;
const path = require('path');
const { spawnSync } = require('child_process');
const braces = require('..');
const expand = require('../lib/expand');

const sharedPair = pattern => {
  const subtree = braces.parse(pattern).nodes.find(node => node.type === 'paren');
  return { type: 'root', nodes: [subtree, subtree] };
};

describe('expansion preserves ranges in shared subtrees', () => {
  const cases = [
    {
      name: 'numeric ranges', pattern: '(a{1..3})',
      expected: ['(a1)(a1)', '(a1)(a2)', '(a1)(a3)', '(a2)(a1)', '(a2)(a2)', '(a2)(a3)', '(a3)(a1)', '(a3)(a2)', '(a3)(a3)']
    },
    {
      name: 'alphabetic ranges', pattern: '({a..b})',
      expected: ['(a)(a)', '(a)(b)', '(b)(a)', '(b)(b)']
    },
    {
      name: 'padded ranges', pattern: '({01..02})',
      expected: ['(01)(01)', '(01)(02)', '(02)(01)', '(02)(02)']
    },
    {
      name: 'descending ranges', pattern: '({2..1})',
      expected: ['(2)(2)', '(2)(1)', '(1)(2)', '(1)(1)']
    },
    {
      name: 'explicit steps', pattern: '({1..4..2})',
      expected: ['(1)(1)', '(1)(3)', '(3)(1)', '(3)(3)']
    },
    {
      name: 'the step option', pattern: '({1..4})', options: { step: 2 },
      expected: ['(1)(1)', '(1)(3)', '(3)(1)', '(3)(3)']
    },
    {
      name: 'transformed ranges', pattern: '({1..2})',
      options: { transform: value => `n${value}` },
      expected: ['(n1)(n1)', '(n1)(n2)', '(n2)(n1)', '(n2)(n2)']
    },
    {
      name: 'invalid range endpoints', pattern: '({foo..bar})',
      expected: ['({foo..bar})({foo..bar})']
    },
    {
      name: 'invalid steps', pattern: '({1..3..bad})',
      expected: ['({1..3..bad})({1..3..bad})']
    },
    {
      name: 'nested ranges and alternatives', pattern: '({x,{1..2}})',
      expected: ['(x)(x)', '(x)(1)', '(x)(2)', '(1)(x)', '(1)(1)', '(1)(2)', '(2)(x)', '(2)(1)', '(2)(2)']
    }
  ];

  for (const entry of [{ name: 'public API', expand: braces.expand }, { name: 'lib import', expand }]) {
    for (const example of cases) {
      it(`retains ${example.name} at every shared occurrence via ${entry.name}`, () => {
        assert.deepEqual(entry.expand(sharedPair(example.pattern), example.options), example.expected);
      });
    }

    it(`can expand the same parsed range AST twice via ${entry.name}`, () => {
      const ast = braces.parse('x{1..2}');
      assert.deepEqual(entry.expand(ast), ['x1', 'x2']);
      assert.deepEqual(entry.expand(ast), ['x1', 'x2']);
    });

    it(`preserves stringify after expanding a shared range via ${entry.name}`, () => {
      const ast = sharedPair('(a{1..3})');
      entry.expand(ast);
      assert.equal(braces.stringify(ast), '(a{1..3})(a{1..3})');
    });

    it(`preserves compilation after expanding a parsed range via ${entry.name}`, () => {
      const ast = braces.parse('x{1..2}');
      entry.expand(ast);
      assert.equal(braces.compile(ast), 'x(1|2)');
    });

    it(`allows retrying an AST after a range limit rejection via ${entry.name}`, () => {
      const ast = sharedPair('({1..3})');
      assert.throws(() => entry.expand(ast, { rangeLimit: 1 }), RangeError);
      assert.throws(() => entry.expand(ast, { rangeLimit: 1 }), RangeError);
      assert.deepEqual(entry.expand(ast, { rangeLimit: false }), ['(1)(1)', '(1)(2)', '(1)(3)', '(2)(1)', '(2)(2)', '(2)(3)', '(3)(1)', '(3)(2)', '(3)(3)']);
    });

    it(`still rejects an invalid shared range with strictRanges via ${entry.name}`, () => {
      const ast = sharedPair('({foo..bar})');
      assert.throws(() => entry.expand(ast, { strictRanges: true }), RangeError);
      assert.throws(() => entry.expand(ast, { strictRanges: true }), RangeError);
      assert.deepEqual(entry.expand(ast), ['({foo..bar})({foo..bar})']);
    });

    it(`expands a directly shared brace range via ${entry.name}`, () => {
      const range = braces.parse('{1..2}').nodes.find(node => node.type === 'brace');
      assert.deepEqual(entry.expand({ type: 'root', nodes: [range, range] }), ['11', '12', '21', '22']);
    });

    it(`expands a shared numeric range with a smaller stack via ${entry.name}`, function() {
      this.timeout(5000);
      const modulePath = entry.name === 'public API' ? '..' : '../lib/expand';
      const probe = spawnSync(process.execPath, ['--stack-size=256', '-e', `
        const assert = require('assert');
        const braces = require(${JSON.stringify(path.join(__dirname, '..'))});
        const api = require(${JSON.stringify(path.join(__dirname, modulePath))});
        const expand = typeof api.expand === 'function' ? api.expand : api;
        const makeAst = ${sharedPair.toString()};
        assert.deepEqual(expand(makeAst('({1..2})')), ['(1)(1)', '(1)(2)', '(2)(1)', '(2)(2)']);
      `], { timeout: 2000, encoding: 'utf8' });
      assert.equal(probe.status, 0, String(probe.error || probe.stderr));
    });
  }
});
