'use strict';

require('mocha');
const assert = require('assert').strict;
const braces = require('..');

describe('Examples from README.md', () => {
  describe('Brace Expansion vs. Compilation', () => {
    it('Compiled', () => {
      assert.deepEqual(braces('a/{x,y,z}/b'), ['a/(x|y|z)/b']);
      assert.deepEqual(braces(['a/{01..20}/b', 'a/{1..5}/b']), [
        'a/(0[1-9]|1[0-9]|20)/b',
        'a/([1-5])/b'
      ]);
    });

    it('Expanded', () => {
      assert.deepEqual(braces('a/{x,y,z}/b', { expand: true }), ['a/x/b', 'a/y/b', 'a/z/b']);
      assert.deepEqual(braces.expand('{01..10}'), [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10'
      ]);
    });
  });

  describe('Sequences', () => {
    it('first set of examples', () => {
      assert.deepEqual(braces.expand('{1..3}'), ['1', '2', '3']);
      assert.deepEqual(braces.expand('a/{1..3}/b'), ['a/1/b', 'a/2/b', 'a/3/b']);
      assert.deepEqual(braces('{a..c}', { expand: true }), ['a', 'b', 'c']);
      assert.deepEqual(braces('foo/{a..c}', { expand: true }), ['foo/a', 'foo/b', 'foo/c']);
    });

    it('zero-padding examples', () => {
      // supports zero-padded ranges
      assert.deepEqual(braces('a/{01..03}/b'), ['a/(0[1-3])/b']);
      assert.deepEqual(braces('a/{001..300}/b'), ['a/(00[1-9]|0[1-9][0-9]|[12][0-9]{2}|300)/b']);
    });
  });
});
