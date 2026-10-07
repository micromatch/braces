'use strict';

require('mocha');
const assert = require('assert').strict;
const braces = require('..');
const directCompile = require('../lib/compile');
const directExpand = require('../lib/expand');

describe('compilation preserves shared range arguments', () => {
  const cases = [
    { pattern: '({1..3})', compiled: '(([1-3]))' },
    { pattern: '({a..c})', compiled: '(([a-c]))' },
    { pattern: '({01..02})', compiled: '((01|02))' },
    { pattern: '({3..1})', compiled: '(([1-3]))' },
    { pattern: '({1..4..2})', compiled: '((1|3))' },
    { pattern: '({foo..bar})', compiled: '({foo..bar})' }
  ];
  for (const entry of [
    { name: 'public API', compile: braces.compile, expand: braces.expand },
    { name: 'direct imports', compile: directCompile, expand: directExpand }
  ]) {
    for (const example of cases) {
      it(`compiles both shared occurrences of ${example.pattern} via ${entry.name}`, () => {
        const subtree = braces.parse(example.pattern).nodes.find(node => node.type === 'paren');
        const ast = { type: 'root', nodes: [subtree, subtree] };
        assert.equal(entry.compile(ast), example.compiled + example.compiled);
        assert.equal(entry.compile(ast), example.compiled + example.compiled);
      });
    }
    it(`retains expansion after compiling the same AST twice via ${entry.name}`, () => {
      const ast = braces.parse('x{1..3}');
      assert.equal(entry.compile(ast), 'x([1-3])');
      assert.equal(entry.compile(ast), 'x([1-3])');
      assert.deepEqual(entry.expand(ast), ['x1', 'x2', 'x3']);
    });
    it(`retains an expand-compile-expand sequence via ${entry.name}`, () => {
      const ast = braces.parse('x{1..3}');
      assert.deepEqual(entry.expand(ast), ['x1', 'x2', 'x3']);
      assert.equal(entry.compile(ast), 'x([1-3])');
      assert.deepEqual(entry.expand(ast), ['x1', 'x2', 'x3']);
    });
    it(`uses fresh options when compiling and expanding again via ${entry.name}`, () => {
      const ast = braces.parse('x{1..4}');
      assert.equal(entry.compile(ast, { step: 2 }), 'x(1|3)');
      assert.equal(entry.compile(ast), 'x([1-4])');
      assert.deepEqual(entry.expand(ast, { step: 2 }), ['x1', 'x3']);
      assert.deepEqual(entry.expand(ast), ['x1', 'x2', 'x3', 'x4']);
    });
    it(`preserves a range after an invalid compilation step via ${entry.name}`, () => {
      const ast = braces.parse('x{1..3}');
      assert.throws(() => entry.compile(ast, { step: 1.5, strictRanges: true }), TypeError);
      assert.deepEqual(entry.expand(ast), ['x1', 'x2', 'x3']);
    });
    it(`compiles a range whose original child nodes are frozen via ${entry.name}`, () => {
      const ast = braces.parse('x{1..3}');
      const range = ast.nodes.find(node => node.type === 'brace');
      range.nodes.forEach(Object.freeze);
      Object.freeze(range.nodes);
      assert.equal(entry.compile(ast), 'x([1-3])');
      assert.deepEqual(entry.expand(ast), ['x1', 'x2', 'x3']);
    });
  }
});
