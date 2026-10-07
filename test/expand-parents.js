'use strict';

require('mocha');
const assert = require('assert').strict;
const path = require('path');
const { spawnSync } = require('child_process');
const braces = require('..');
const expand = require('../lib/expand');

const foreignQueue = kind => {
  let value = ['b'];
  if (kind === 'cycle') {
    value = [];
    value.push(value);
  }
  if (kind === 'deep') {
    for (let i = 0; i < 20000; i++) value = [value];
  }
  return [value];
};

const withForeignParent = queue => ({
  type: 'root',
  nodes: [{
    type: 'paren',
    parent: { type: 'root', queue },
    nodes: [{ type: 'text', value: 'a' }]
  }]
});

describe('expansion uses its actual traversal rather than parent metadata', () => {
  for (const entry of [{ name: 'public API', expand: braces.expand }, { name: 'lib import', expand }]) {
    for (const kind of ['cycle', 'deep']) {
      it(`ignores a ${kind} queue from an external parent via ${entry.name}`, () => {
        const queue = foreignQueue(kind);
        assert.deepEqual(entry.expand(withForeignParent(queue)), ['a']);
        assert.equal(queue.length, 1);
      });

      it(`ignores a ${kind} external queue with a smaller stack via ${entry.name}`, function() {
        this.timeout(5000);
        const modulePath = entry.name === 'public API' ? '..' : '../lib/expand';
        const probe = spawnSync(process.execPath, ['--stack-size=256', '-e', `
          const assert = require('assert');
          const api = require(${JSON.stringify(path.join(__dirname, modulePath))});
          const expand = typeof api.expand === 'function' ? api.expand : api;
          const makeQueue = ${foreignQueue.toString()};
          const makeAst = ${withForeignParent.toString()};
          assert.deepEqual(expand(makeAst(makeQueue(${JSON.stringify(kind)}))), ['a']);
        `], { timeout: 2000, encoding: 'utf8' });
        assert.equal(probe.status, 0, String(probe.error || probe.stderr));
      });
    }

    it(`does not consume an ordinary external queue via ${entry.name}`, () => {
      const queue = [['b']];
      assert.deepEqual(entry.expand(withForeignParent(queue)), ['a']);
      assert.deepEqual(queue, [['b']]);
    });

    it(`does not read parent metadata getters via ${entry.name}`, () => {
      const ast = withForeignParent([]);
      Object.defineProperty(ast.nodes[0], 'parent', {
        get() { throw new Error('parent metadata must not be read'); }
      });
      assert.deepEqual(entry.expand(ast), ['a']);
    });

    it(`expands a standalone parsed parenthesis subtree via ${entry.name}`, () => {
      const ast = braces.parse('(a{b,c})');
      const subtree = ast.nodes.find(node => node.type === 'paren');
      assert.deepEqual(entry.expand(subtree), ['(ab)', '(ac)']);
    });

    it(`allows a shared parenthesis node with inconsistent backlinks via ${entry.name}`, () => {
      const shared = { type: 'paren', nodes: [{ type: 'text', value: 'a' }] };
      const ast = { type: 'root', nodes: [shared, shared] };
      shared.parent = shared;
      assert.deepEqual(entry.expand(ast), ['aa']);
    });

    for (const example of [
      { input: '{(a)', expected: ['{(a)'] },
      { input: '{({1..3})', expected: ['{(1)', '{(2)', '{(3)'] }
    ]) {
      it(`handles parser-reparented nodes in ${example.input} via ${entry.name}`, () => {
        assert.deepEqual(entry.expand(braces.parse(example.input)), example.expected);
      });
    }
  }
});
