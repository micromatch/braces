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
require('should');

if ('minimatch' in argv) {
  braces = require('minimatch').braceExpand;
}

describe('braces', function() {
  it('braces', function() {
    assert.deepEqual(braces.match(['ffc','ffb','ffa'], 'ff{c,b,a}'), ['ffc','ffb','ffa']);
    assert.deepEqual(braces.match(['fdg','feg','ffg'], 'f{d,e,f}g'), ['fdg','feg','ffg']);
    assert.deepEqual(braces.match(['aaa', 'lxyz','nxyz','mxyz'], '{l,n,m}xyz'), ['lxyz','nxyz','mxyz']);
    assert.deepEqual(braces.match(['{abc}', 'abc'], '{abc}'), ['abc']);
    assert.deepEqual(braces.match(['{a,b,c,d,e}'], '\\{a,b,c,d,e}'), []);
    assert.deepEqual(braces.match(['x}','y}','{a}','b}','c}'], '{x,y,\\{a,b,c\\}}'), ['x}','y}','{a}','b}','c}']);
    // assert.deepEqual(braces('{x\\,y,\\{abc\\},trie}'), ['x,y','{abc}','trie']);

    // assert.deepEqual(braces('/usr/{ucb/{ex,edit},lib/{ex,how_ex}}'), ['/usr/ucb/ex','/usr/lib/ex','/usr/ucb/edit','/usr/lib/how_ex']);

    // assert.deepEqual(braces('{}'), ['{}']);
    // assert.deepEqual(braces('{ }'), ['{','}']);
    // assert.deepEqual(braces('}'), ['}']);
    // assert.deepEqual(braces('{'), ['{']);
    // assert.deepEqual(braces('abcd{efgh'), ['abcd{efgh']);

    // assert.deepEqual(braces('foo {1,2} bar'), ['foo','1','2','bar']);
  });

  it('new sequence brace operators', function() {
    assert.equal(braces('{1..10}'), ['1','2','3','4','5','6','7','8','9','10']);
    assert.equal(braces('{0..10,braces}'), ['0..10','braces']);
    assert.equal(braces('{braces,{0..10}}'), ['braces','0','1','2','3','4','5','6','7','8','9','10']);
    assert.equal(braces('{{0..10},braces}'), ['0','braces','1','2','3','4','5','6','7','8','9','10']);
    assert.equal(braces('x{{0..10},braces}y'), ['x0y','xbracesy','x1y','x2y','x3y','x4y','x5y','x6y','x7y','x8y','x9y','x10y']);
  });

  it('ranges', function() {
    assert.equal(braces('{3..3}'), ['3']);
    assert.equal(braces('x{3..3}y'), ['x3y']);
    assert.equal(braces('{10..1}'), ['10','9','8','7','6','5','4','3','2','1']);
    assert.equal(braces('{10..1}y'), ['10y','9y','8y','7y','6y','5y','4y','3y','2y','1y']);
    assert.equal(braces('x{10..1}y'), ['x10y','x9y','x8y','x7y','x6y','x5y','x4y','x3y','x2y','x1y']);
    assert.equal(braces('{a..f}'), ['a','b','c','d','e','f']);
    assert.equal(braces('{f..a}'), ['f','e','d','c','b','a']);

    assert.equal(braces('{a..A}'), ['a','`','_','^',']','\\','[','Z','Y','X','W','V','U','T','S','R','Q','P','O','N','M','L','K','J','I','H','G','F','E','D','C','B','A']);
    assert.equal(braces('{A..a}'), ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','[','\\',']','^','_','`','a']);

    assert.equal(braces('{f..f}'), ['f']);
    assert.equal(braces('0{1..9} {10..20}'), ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20']);
  });

  it('mixes are incorrectly-formed brace expansions', function() {
    assert.equal(braces('{1..f}'), ['{1..f}']);
    assert.equal(braces('{f..1}'), ['{f..1}']);
  });

  it('do negative numbers work?', function() {
    assert.equal(braces('{-1..-10}'), ['-1','-2','-3','-4','-5','-6','-7','-8','-9','-10']);
    assert.equal(braces('{-20..0}'), ['-20','-19','-18','-17','-16','-15','-14','-13','-12','-11','-10','-9','-8','-7','-6','-5','-4','-3','-2','-1','0']);
  });

  it('weirdly-formed brace expansions -- fixed in post-bash-3.1', function() {
    assert.equal(braces('{-1..-10}'), ['-1','-2','-3','-4','-5','-6','-7','-8','-9','-10']);
    assert.equal(braces('{-20..0}'), ['-20','-19','-18','-17','-16','-15','-14','-13','-12','-11','-10','-9','-8','-7','-6','-5','-4','-3','-2','-1','0']);
    assert.equal(braces('a-{b{d,e}}-c'), ['a-{bd}-c','a-{be}-c']);

    assert.equal(braces('a-{bdef-{g,i}-c'), ['a-{bdef-g-c','a-{bdef-i-c']);

    assert.equal(braces('{"klklkl"}{1,2,3}'), ['{klklkl}1','{klklkl}2','{klklkl}3']);
    assert.equal(braces('{"x,x"}'), ['{x,x}']);
  });

  it('numerical ranges with steps', function() {
    assert.equal(braces('{1..10..2}'), ['1','3','5','7','9']);
    assert.equal(braces('{-1..-10..2}'), ['-1','-3','-5','-7','-9']);
    assert.equal(braces('{-1..-10..-2}'), ['-1','-3','-5','-7','-9']);

    assert.equal(braces('{10..1..-2}'), ['10','8','6','4','2']);
    assert.equal(braces('{10..1..2}'), ['10','8','6','4','2']);

    assert.equal(braces('{1..20..2}'), ['1','3','5','7','9','11','13','15','17','19']);
    assert.equal(braces('{1..20..20}'), ['1']);

    assert.equal(braces('{100..0..5}'), ['100','95','90','85','80','75','70','65','60','55','50','45','40','35','30','25','20','15','10','5','0']);
    assert.equal(braces('{100..0..-5}'), ['100','95','90','85','80','75','70','65','60','55','50','45','40','35','30','25','20','15','10','5','0']);
  });

  it('alpha ranges with steps', function() {
    assert.equal(braces('{a..z}'), ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']);
    assert.equal(braces('{a..z..2}'), ['a','c','e','g','i','k','m','o','q','s','u','w','y']);
    assert.equal(braces('{z..a..-2}'), ['z','x','v','t','r','p','n','l','j','h','f','d','b']);
  });

  it('make sure brace expansion handles ints > 2**31 - 1 using intmax_t', function() {
    assert.equal(braces('{2147483645..2147483649}'), ['2147483645','2147483646','2147483647','2147483648','2147483649']);
  });

  it('unwanted zero-padding -- fixed post-bash-4.0', function() {
    assert.equal(braces('{10..0..2}'), ['10','8','6','4','2','0']);
    assert.equal(braces('{10..0..-2}'), ['10','8','6','4','2','0']);
    assert.equal(braces('{-50..-0..5}'), ['-50','-45','-40','-35','-30','-25','-20','-15','-10','-5','0']);
  });

  it('bad', function() {
    assert.equal(braces('{1..0f}'), ['{1..0f}']);
    assert.equal(braces('{1..10..ff}'), ['{1..10..ff}']);
    assert.equal(braces('{1..10.f}'), ['{1..10.f}']);
    assert.equal(braces('{1..10f}'), ['{1..10f}']);
    assert.equal(braces('{1..20..2f}'), ['{1..20..2f}']);
    assert.equal(braces('{1..20..f2}'), ['{1..20..f2}']);
    assert.equal(braces('{1..2f..2}'), ['{1..2f..2}']);
    assert.equal(braces('{1..ff..2}'), ['{1..ff..2}']);
    assert.equal(braces('{1..ff}'), ['{1..ff}']);
    assert.equal(braces('{1..f}'), ['{1..f}']);
    assert.equal(braces('{1.20..2}'), ['{1.20..2}']);
  });
});
