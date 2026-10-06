'use strict';

require('mocha');
const assert = require('assert').strict;
const braces = require('..');
const { execFileSync } = require('child_process');

function nestedAst(depth) {
  let ast = { type: 'root', nodes: [] };
  for (let i = 0; i < depth; i++) ast = { type: 'root', nodes: [ast] };
  return ast;
}

function depthError(error) {
  return error instanceof SyntaxError && /nesting depth exceeds/.test(error.message);
}

describe('AST depth limit', () => {
  ['parse', 'compile', 'expand', 'stringify', 'default'].forEach(operation => {
    it('rejects deeply nested strings without stack exhaustion: ' + operation, () => {
      const source = `
        const braces = require('./');
        const pattern = '{'.repeat(4000) + 'x' + '}'.repeat(4000);
        try {
          ${operation === 'default' ? 'braces(pattern)' : 'braces.' + operation + '(pattern)'};
          console.log(JSON.stringify({ name: 'accepted', message: '' }));
        } catch (error) {
          console.log(JSON.stringify({ name: error.name, message: error.message }));
        }
      `;
      const result = JSON.parse(execFileSync(process.execPath, ['--stack_size=512', '-e', source], {
        cwd: require('path').resolve(__dirname, '..'), encoding: 'utf8', timeout: 3000
      }));
      assert.equal(result.name, 'SyntaxError');
      assert.ok(/nesting depth exceeds/.test(result.message));
    });
  });

  ['compile', 'expand', 'stringify'].forEach(operation => {
    it('rejects caller-supplied deep ASTs: ' + operation, () => {
      assert.throws(() => braces[operation](nestedAst(4000)), depthError);
    });
    it('accepts AST depth100 and rejects101: ' + operation, () => {
      assert.deepEqual(braces[operation](nestedAst(100)), operation === 'expand' ? [] : '');
      assert.throws(() => braces[operation](nestedAst(101)), depthError);
    });
  });

  it('bounds parenthesis nesting as well as braces', () => {
    assert.throws(() => braces.compile('('.repeat(4000) + 'x' + ')'.repeat(4000)), depthError);
  });
  it('preserves nested patterns below the bound', () => {
    const pattern = '{'.repeat(99) + 'x' + '}'.repeat(99);
    assert.equal(braces.stringify(pattern), pattern);
    assert.deepEqual(braces.expand(pattern), [pattern]);
  });
  it('preserves alternatives, ranges, escapes and ordinary parsed ASTs', () => {
    assert.equal(braces.compile('app/{reading,writing}/**/*.{js,jsx}'), 'app/(reading|writing)/**/*.(js|jsx)');
    assert.deepEqual(braces.expand('page-{1..3}.js'), ['page-1.js', 'page-2.js', 'page-3.js']);
    assert.deepEqual(braces.expand('a\\{b,c\\}'), ['a{b,c}']);
    assert.equal(braces.compile(braces.parse('a/{b,c}/d')), 'a/(b|c)/d');
  });
});
