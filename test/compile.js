/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

require('mocha');
var assert = require('assert');
var argv = require('yargs-parser')(process.argv.slice(2));
var braces = require('..');

if ('minimatch' in argv) {
  braces = require('minimatch').braceExpand;
}

describe('.compile', function() {
  it.only('.output (sets)', function() {
    // assert.equal(braces.compile('ff{c,b,a}').output, 'ff(c|b|a)');
    // assert.equal(braces.compile('f{d,e,f}g').output, 'f(d|e|f)g');
    // assert.equal(braces.compile('{l,n,m}xyz').output, '(l|n|m)xyz');
    // assert.equal(braces.compile('{abc}').output, '(abc)');
    // assert.equal(braces.compile('{a,b,c}').output, '(a|b|c)');
    // assert.equal(braces.compile('\\{a,b,c,d,e}').output, '\\{a,b,c,d,e\\}');
    // assert.equal(braces.compile('{x,y,\\{a,b,c\\}}').output, '(x|y|\\{a,b,c\\})');
    // assert.equal(braces.compile('{x,y,{a,b,c\\}}').output, '(x|y|\\{a,b,c\\})');
    assert.equal(braces.compile('{x\\,y,\\{abc\\},trie}').output, '(x,y|\\{abc\\}|trie)');
    assert.equal(braces.compile('/usr/{ucb/{ex,edit},lib/{ex,how_ex}}').output, '\\/usr\\/(ucb\\/(ex|edit)|lib\\/(ex|how_ex))');
    assert.equal(braces.compile('{}').output, '\\{\\}');
    assert.equal(braces.compile('{ }').output, '\\{|\\}');
    assert.equal(braces.compile('{').output, '\\{');
    assert.equal(braces.compile('}').output, '\\}');
    assert.equal(braces.compile('abcd{efgh').output, 'abcd\\{efgh');

    // Bash 4.3 says the following should be equivalent to `foo|(1|2)|bar`
    assert.equal(braces.compile('foo {1,2} bar').output, 'foo (1|2) bar');
  });

  it('.output (sequence brace operators)', function() {
    assert.equal(braces.compile('{1..10}').output, '[1-10]');
    assert.equal(braces.compile('{1..10,braces}').output, '(1..10|braces)');
    // assert.equal(braces.compile('{{1..10},braces}').output, '([1-10]|braces)');
    // assert.equal(braces.compile('{{1..10..2},braces}').output, '([1-10]|braces)');
    // braces('{0..10,braces}').should.eql(['0..10','braces']);
    // braces('{braces,{0..10}}').should.eql(['braces','0','1','2','3','4','5','6','7','8','9','10']);
    // braces('{{0..10},braces}').should.eql(['0','braces','1','2','3','4','5','6','7','8','9','10']);
    // braces('x{{0..10},braces}y').should.eql(['x0y','xbracesy','x1y','x2y','x3y','x4y','x5y','x6y','x7y','x8y','x9y','x10y']);
  });
});
