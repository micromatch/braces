/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var argv = require('minimist')(process.argv.slice(2));
var braces = require('..');
require('should');

if ('minimatch' in argv) {
  braces = require('minimatch').braceExpand;
}

describe('braces', function() {
  it('braces', function() {
    braces('ff{c,b,a}').should.eql(['ffc','ffb','ffa']);
    braces('f{d,e,f}g').should.eql(['fdg','feg','ffg']);
    braces('{l,n,m}xyz').should.eql(['lxyz','nxyz','mxyz']);
    braces('{abc\\,def}').should.eql(['{abc,def}']);
    braces('{abc}', {bash: true}).should.eql(['{abc}']);

    braces('\\{a,b,c,d,e}').should.eql(['{a,b,c,d,e}']);
    braces('{x,y,\\{a,b,c}}').should.eql(['x}','y}','{a}','b}','c}']);
    braces('{x\\,y,\\{abc\\},trie}').should.eql(['x,y','{abc}','trie']);

    braces('/usr/{ucb/{ex,edit},lib/{ex,how_ex}}').should.eql(['/usr/ucb/ex','/usr/lib/ex','/usr/ucb/edit','/usr/lib/how_ex']);

    braces('{}').should.eql(['{}']);
    braces('{ }').should.eql(['{','}']);
    braces('}').should.eql(['}']);
    braces('{').should.eql(['{']);
    braces('abcd{efgh').should.eql(['abcd{efgh']);

    braces('foo {1,2} bar').should.eql(['foo','1','2','bar']);
  });

  it('new sequence brace operators', function() {
    braces('{1..10}').should.eql(['1','2','3','4','5','6','7','8','9','10']);
    braces('{0..10,braces}').should.eql(['0..10','braces']);
    braces('{braces,{0..10}}').should.eql(['braces','0','1','2','3','4','5','6','7','8','9','10']);
    braces('{{0..10},braces}').should.eql(['0','braces','1','2','3','4','5','6','7','8','9','10']);
    braces('x{{0..10},braces}y').should.eql(['x0y','xbracesy','x1y','x2y','x3y','x4y','x5y','x6y','x7y','x8y','x9y','x10y']);
  });

  it('ranges', function() {
    braces('{3..3}').should.eql(['3']);
    braces('x{3..3}y').should.eql(['x3y']);
    braces('{10..1}').should.eql(['10','9','8','7','6','5','4','3','2','1']);
    braces('{10..1}y').should.eql(['10y','9y','8y','7y','6y','5y','4y','3y','2y','1y']);
    braces('x{10..1}y').should.eql(['x10y','x9y','x8y','x7y','x6y','x5y','x4y','x3y','x2y','x1y']);
    braces('{a..f}').should.eql(['a','b','c','d','e','f']);
    braces('{f..a}').should.eql(['f','e','d','c','b','a']);

    braces('{a..A}').should.eql(['a','`','_','^',']','\\','[','Z','Y','X','W','V','U','T','S','R','Q','P','O','N','M','L','K','J','I','H','G','F','E','D','C','B','A']);
    braces('{A..a}').should.eql(['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','[','\\',']','^','_','`','a']);

    braces('{f..f}').should.eql(['f']);
    braces('0{1..9} {10..20}').should.eql(['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20']);
  });

  it('mixes are incorrectly-formed brace expansions', function() {
    braces('{1..f}').should.eql(['{1..f}']);
    braces('{f..1}').should.eql(['{f..1}']);
  });

  it('do negative numbers work?', function() {
    braces('{-1..-10}').should.eql(['-1','-2','-3','-4','-5','-6','-7','-8','-9','-10']);
    braces('{-20..0}').should.eql(['-20','-19','-18','-17','-16','-15','-14','-13','-12','-11','-10','-9','-8','-7','-6','-5','-4','-3','-2','-1','0']);
  });

  it('weirdly-formed brace expansions -- fixed in post-bash-3.1', function() {
    braces('{-1..-10}').should.eql(['-1','-2','-3','-4','-5','-6','-7','-8','-9','-10']);
    braces('{-20..0}').should.eql(['-20','-19','-18','-17','-16','-15','-14','-13','-12','-11','-10','-9','-8','-7','-6','-5','-4','-3','-2','-1','0']);
    braces('a-{b{d,e}}-c', {bash: true}).should.eql(['a-{bd}-c','a-{be}-c']);

    braces('a-{bdef-{g,i}-c').should.eql(['a-{bdef-g-c','a-{bdef-i-c']);

    braces('{"klklkl"}{1,2,3}').should.eql(['{klklkl}1','{klklkl}2','{klklkl}3']);
    braces('{"x,x"}').should.eql(['{x,x}']);
  });

  it('numerical ranges with steps', function() {
    braces('{1..10..2}').should.eql(['1','3','5','7','9']);
    braces('{-1..-10..2}').should.eql(['-1','-3','-5','-7','-9']);
    braces('{-1..-10..-2}').should.eql(['-1','-3','-5','-7','-9']);

    braces('{10..1..-2}').should.eql(['10','8','6','4','2']);
    braces('{10..1..2}').should.eql(['10','8','6','4','2']);

    braces('{1..20..2}').should.eql(['1','3','5','7','9','11','13','15','17','19']);
    braces('{1..20..20}').should.eql(['1']);

    braces('{100..0..5}').should.eql(['100','95','90','85','80','75','70','65','60','55','50','45','40','35','30','25','20','15','10','5','0']);
    braces('{100..0..-5}').should.eql(['100','95','90','85','80','75','70','65','60','55','50','45','40','35','30','25','20','15','10','5','0']);
  });

  it('alpha ranges with steps', function() {
    braces('{a..z}').should.eql(['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']);
    braces('{a..z..2}').should.eql(['a','c','e','g','i','k','m','o','q','s','u','w','y']);
    braces('{z..a..-2}').should.eql(['z','x','v','t','r','p','n','l','j','h','f','d','b']);
  });

  it('make sure brace expansion handles ints > 2**31 - 1 using intmax_t', function() {
    braces('{2147483645..2147483649}').should.eql(['2147483645','2147483646','2147483647','2147483648','2147483649']);
  });

  it('unwanted zero-padding -- fixed post-bash-4.0', function() {
    braces('{10..0..2}').should.eql(['10','8','6','4','2','0']);
    braces('{10..0..-2}').should.eql(['10','8','6','4','2','0']);
    braces('{-50..-0..5}').should.eql(['-50','-45','-40','-35','-30','-25','-20','-15','-10','-5','0']);
  });

  it('bad', function() {
    braces('{1..10.f}').should.eql(['{1..10.f}']);
    braces('{1..ff}').should.eql(['{1..ff}']);
    braces('{1..10..ff}').should.eql(['{1..10..ff}']);
    braces('{1.20..2}').should.eql(['{1.20..2}']);
    braces('{1..20..f2}').should.eql(['{1..20..f2}']);
    braces('{1..20..2f}').should.eql(['{1..20..2f}']);
    braces('{1..2f..2}').should.eql(['{1..2f..2}']);
    braces('{1..ff..2}').should.eql(['{1..ff..2}']);
    braces('{1..ff}').should.eql(['{1..ff}']);
    braces('{1..f}').should.eql(['{1..f}']);
    braces('{1..0f}').should.eql(['{1..0f}']);
    braces('{1..10f}').should.eql(['{1..10f}']);
    braces('{1..10.f}').should.eql(['{1..10.f}']);
    braces('{1..10.f}').should.eql(['{1..10.f}']);
  });
});
