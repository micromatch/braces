'use strict';

require('mocha');
const assert = require('assert').strict;
const path = require('path');
const { spawnSync } = require('child_process');
const braces = require('..');

const nested = (open, close, depth) => open.repeat(depth) + 'a,b' + close.repeat(depth);
const safeError = error => error instanceof SyntaxError && error.code === 'ERR_BRACES_COMPLEXITY';
const astAtDepth = depth => {
  let ast = { type: 'text', value: 'a' };
  while (depth--) ast = { type: 'root', nodes: [ast] };
  return ast;
};

describe('bounded parser and AST traversal', () => {
  for (const method of ['parse', 'compile', 'expand', 'stringify', 'create']) {
    for (const input of [nested('{', '}', 4000), nested('(', ')', 4000), '{'.repeat(4000)]) {
      it(`rejects deeply nested input in ${method}, below maxLength`, () => {
        assert.throws(() => braces[method](input, { maxDepth: Infinity, rangeLimit: false }), safeError);
      });
    }
  }

  for (const method of ['compile', 'expand', 'stringify']) {
    const direct = require(`../lib/${method}`);
    it(`rejects a deep direct AST in ${method} before recursive processing`, () => {
      assert.throws(() => direct(astAtDepth(20000)), safeError);
    });
    it(`rejects child cycles in ${method}`, () => {
      const ast = { type: 'root', nodes: [] };
      ast.nodes.push(ast);
      assert.throws(() => direct(ast), safeError);
    });
    it(`preserves shared child objects in ${method}`, () => {
      const leaf = { type: 'text', value: 'a' };
      assert.deepEqual(direct({ type: 'root', nodes: [leaf, leaf] }), method === 'expand' ? ['aa'] : 'aa');
    });
    it(`accepts the AST depth boundary and rejects the next level in ${method}`, () => {
      direct(astAtDepth(128));
      assert.throws(() => direct(astAtDepth(129)), safeError);
    });
    it(`validates the entire AST before ${method} can mutate it`, () => {
      const ast = { type: 'root', nodes: [{ type: 'brace', nodes: [], open: true }, astAtDepth(129)] };
      const before = JSON.stringify(ast);
      assert.throws(() => direct(ast), safeError);
      assert.equal(JSON.stringify(ast), before);
    });
  }

  it('bounds a wide caller-supplied AST without rejecting ordinary shared leaves', () => {
    const leaf = { type: 'text', value: 'a' };
    assert.equal(braces.compile({ type: 'root', nodes: Array(65535).fill(leaf) }).length, 65535);
    assert.throws(() => braces.compile({ type: 'root', nodes: Array(65536).fill(leaf) }), safeError);
  });

  it('ignores cyclic parent metadata in expand instead of hanging', function() {
    this.timeout(5000);
    const probe = spawnSync(process.execPath, ['-e', `
      const braces = require(${JSON.stringify(path.join(__dirname, '..'))});
      const child = { type: 'paren', nodes: [] };
      child.parent = child;
      const result = braces.expand({ type: 'root', nodes: [child] });
      if (JSON.stringify(result) !== '[]') process.exit(2);
    `], { timeout: 2000, encoding: 'utf8' });
    assert.equal(probe.status, 0, String(probe.error || probe.stderr));
  });

  it('ignores cyclic parent metadata on the entry node in expand', function() {
    this.timeout(5000);
    const probe = spawnSync(process.execPath, ['-e', `
      const braces = require(${JSON.stringify(path.join(__dirname, '..'))});
      const child = { type: 'paren', nodes: [] };
      child.parent = child;
      const result = braces.expand(child);
      if (JSON.stringify(result) !== '[]') process.exit(2);
    `], { timeout: 2000, encoding: 'utf8' });
    assert.equal(probe.status, 0, String(probe.error || probe.stderr));
  });

  it('bounds visits through an acyclic graph with exponentially repeated children', () => {
    let ast = { type: 'text', value: 'a' };
    for (let i = 0; i < 17; i++) ast = { type: 'root', nodes: [ast, ast] };
    assert.throws(() => braces.compile(ast), safeError);
  });

  it('counts mixed braces and parentheses towards the same parser limit', () => {
    const input = '{('.repeat(65) + 'a,b' + ')}'.repeat(65);
    assert.throws(() => braces.parse(input), safeError);
  });

  it('rejects deep strings safely with a smaller engine stack', function() {
    this.timeout(5000);
    const probe = spawnSync(process.execPath, ['--stack-size=256', '-e', `
      const braces = require(${JSON.stringify(path.join(__dirname, '..'))});
      const input = '{'.repeat(4000) + 'a,b' + '}'.repeat(4000);
      for (const method of ['parse', 'compile', 'expand', 'stringify']) {
        try { braces[method](input); process.exit(2); }
        catch (error) { if (error.name !== 'SyntaxError' || error.code !== 'ERR_BRACES_COMPLEXITY') process.exit(3); }
      }
    `], { timeout: 2000, encoding: 'utf8' });
    assert.equal(probe.status, 0, String(probe.error || probe.stderr));
  });

  it('counts parsed containers separately from terminal AST edges', () => {
    assert.equal(braces.stringify(nested('{', '}', 127)), nested('{', '}', 127));
    assert.equal(braces.parse(nested('{', '}', 128)).type, 'root');
    assert.throws(() => braces.parse(nested('{', '}', 129)), safeError);
  });

  it('does not count escaped or quoted braces as nested containers', () => {
    const escaped = '\\{'.repeat(1000);
    assert.equal(braces.stringify(escaped, { keepEscaping: true }), escaped);
    const quoted = '"' + '{'.repeat(1000) + '"';
    assert.equal(braces.stringify(quoted, { keepQuotes: true }), quoted);
  });
});
