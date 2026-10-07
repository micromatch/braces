'use strict';

require('mocha');
const assert = require('assert').strict;
const path = require('path');
const { spawnSync } = require('child_process');
const braces = require('..');
const direct = require('../lib/expand');

describe('range limits count the actual inclusive range before expansion', () => {
  const entries = [
    { name: 'public API', expand: (pattern, options) => braces.expand(pattern, options) },
    { name: 'direct import', expand: (pattern, options) => direct(typeof pattern === 'string' ? braces.parse(pattern) : pattern, options) },
    { name: 'main export', expand: (pattern, options) => braces(pattern, Object.assign({}, options, { expand: true })) }
  ];
  const rejected = [
    { pattern: '{1..4..1}', options: { rangeLimit: 2 } },
    { pattern: '{4..1}', options: { rangeLimit: 2 } },
    { pattern: '{a..d}', options: { rangeLimit: 2 } },
    { pattern: '{D..A}', options: { rangeLimit: 2 } },
    { pattern: '{-1..-4}', options: { rangeLimit: 2 } },
    { pattern: '{01..04..1}', options: { rangeLimit: 2 } },
    { pattern: '{1..5..-2}', options: { rangeLimit: 2 } },
    { pattern: '{5..1..2}', options: { rangeLimit: 2 } },
    { pattern: '{a..e..2}', options: { rangeLimit: 2 } },
    { pattern: '{1..4..0}', options: { rangeLimit: 2 } },
    { pattern: '{1..3}', options: { rangeLimit: 2.5 } },
    { pattern: '{a..a}', options: { rangeLimit: 0 } },
    { pattern: '{1..4..1}', options: { step: 4, rangeLimit: 2 } },
    { pattern: '{01..a}', options: { rangeLimit: 2 } },
    { pattern: '{1..1001..1}' },
    { pattern: '{1001..1}' }
  ];
  const accepted = [
    { pattern: '{1..2..1}', options: { rangeLimit: 2 }, expected: ['1', '2'] },
    { pattern: '{2..1}', options: { rangeLimit: 2 }, expected: ['2', '1'] },
    { pattern: '{a..b}', options: { rangeLimit: 2 }, expected: ['a', 'b'] },
    { pattern: '{B..A}', options: { rangeLimit: 2 }, expected: ['B', 'A'] },
    { pattern: '{1..4..2}', options: { rangeLimit: 2 }, expected: ['1', '3'] },
    { pattern: '{4..1..-2}', options: { rangeLimit: 2 }, expected: ['4', '2'] },
    { pattern: '{a..d..2}', options: { rangeLimit: 2 }, expected: ['a', 'c'] },
    { pattern: '{1..4}', options: { step: 2, rangeLimit: 2 }, expected: ['1', '3'] },
    { pattern: '{1..4..0}', options: { step: 2, rangeLimit: 4 }, expected: ['1', '2', '3', '4'] },
    { pattern: '{1..2}', options: { step: 0, rangeLimit: 2 }, expected: ['1', '2'] },
    { pattern: '{1..2}', options: { step: '0', rangeLimit: 2 }, expected: ['1', '2'] },
    { pattern: '{1..4..2}', options: { step: 1, rangeLimit: 2 }, expected: ['1', '3'] },
    { pattern: '{3..3}', options: { rangeLimit: 1 }, expected: ['3'] },
    { pattern: '{01..02}', options: { rangeLimit: 2 }, expected: ['01', '02'] },
    { pattern: '{1..3..bad}', options: { rangeLimit: 1 }, expected: ['{1..3..bad}'] },
    { pattern: '{1..3}', options: { step: 1.5, rangeLimit: 1 }, expected: ['{1..3}'] },
    { pattern: '{foo..bar}', options: { rangeLimit: 1 }, expected: ['{foo..bar}'] },
    { pattern: '{1..2}', options: { rangeLimit: 1, step: {} }, reject: true },
    { pattern: '{9007199254740990..9007199254740991}', options: { rangeLimit: 2 }, expected: ['9007199254740990', '9007199254740991'] }
  ];
  for (const entry of entries) {
    for (const example of rejected) {
      it(`rejects ${example.pattern} beyond its configured size via ${entry.name}`, () => {
        assert.throws(() => entry.expand(example.pattern, example.options), RangeError);
      });
    }
    for (const example of accepted) {
      it(`respects range semantics for ${example.pattern} ${JSON.stringify(example.options)} via ${entry.name}`, () => {
        if (example.reject) {
          assert.throws(() => entry.expand(example.pattern, example.options), RangeError);
        } else {
          assert.deepEqual(entry.expand(example.pattern, example.options), example.expected);
        }
      });
    }
    for (const limit of [false, Infinity]) {
      it(`allows deliberate size-limit disabling with ${limit} via ${entry.name}`, () => {
        assert.deepEqual(entry.expand('{4..1..1}', { rangeLimit: limit }), ['4', '3', '2', '1']);
      });
    }
    it(`rejects before calling transforms via ${entry.name}`, () => {
      let calls = 0;
      assert.throws(() => entry.expand('{a..d}', { rangeLimit: 2, transform: value => { calls++; return value; } }), RangeError);
      assert.equal(calls, 0);
    });
    it(`preserves invalid-step errors with strictRanges via ${entry.name}`, () => {
      assert.throws(() => entry.expand('{1..3..bad}', { rangeLimit: 1, strictRanges: true }), TypeError);
    });
    it(`counts a transform-valued step in a manual AST via ${entry.name}`, () => {
      let calls = 0;
      const ast = braces.parse('{1..4..1}');
      const range = ast.nodes.find(node => node.type === 'brace');
      range.nodes.filter(node => node.type === 'text')[2].value = value => { calls++; return value; };
      assert.throws(() => entry.expand(ast, { rangeLimit: 2 }), RangeError);
      assert.equal(calls, 0);
    });
    it(`uses the options-valued step in a manual AST via ${entry.name}`, () => {
      const ast = braces.parse('{1..4..1}');
      const range = ast.nodes.find(node => node.type === 'brace');
      range.nodes.filter(node => node.type === 'text')[2].value = { step: 2 };
      assert.deepEqual(entry.expand(ast, { rangeLimit: 2 }), ['1', '3']);
    });
    it(`preserves boxed integer steps via ${entry.name}`, () => {
      assert.deepEqual(entry.expand('{1..4}', { step: new Number(2), rangeLimit: 2 }), ['1', '3']);
    });
  }

  // A timeout keeps the negative control bounded: fill-range can stop making
  // numeric progress beyond the safe integer domain, even for equal bounds.
  for (const limit of ['undefined', 'false', 'Infinity']) {
    it(`rejects unsafe integer bounds without hanging when rangeLimit is ${limit}`, function() {
      this.timeout(5000);
      const probe = spawnSync(process.execPath, ['-e', `
        const assert = require('assert');
        const braces = require(${JSON.stringify(path.join(__dirname, '..'))});
        assert.throws(() => braces.expand('{9007199254740992..9007199254740992}', { rangeLimit: ${limit} }), RangeError);
        assert.throws(() => braces.expand('{-9007199254740992..-9007199254740992}', { rangeLimit: ${limit} }), RangeError);
      `], { timeout: 500, encoding: 'utf8' });
      assert.equal(probe.status, 0, String(probe.error || probe.stderr));
    });
  }
});
