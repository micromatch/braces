'use strict';

require('mocha');
var assert = require('assert');
var bash = require('./support/bash');
var support = require('./support/compare');
var braces = require('..');
var expand = braces.expand;
var compare;
var patterns = [
  'a/b{,}',
  'a/{,}{c,d}/e',
  'a/{a,b,{,}{,}{,},c}/b',
  'a/{a,b,{,}{,}{,}}/b',
  'a/{b,cz{,}}/{d{,},ef}{,}',
  'a/{b,cz}{,}/{d{,},ef}{,}',
  'a/{b,c{,}}',
  'a/{b,c{,}}/{,}',
  'a/{b,c}/{,}',
  'a/{b,c}{,}/d{,}',
  'a/{b,c}{,}/{d,e{,}}',
  'a/{b,c}{,}/{d,e}{,}',
  'a/{b,c}{,}/{d{,},e}{,}',
  'a/{c,d}/{x,y{,}}/e',
  'a/{c,d}{,}/e',
  'a{,,}',
  'a{,,}{,,}{,,}{,}/b',
  'a{,,}{,}',
  'a{,}',
  'a{,}/{c,d}/e',
  'a{,}{,}',
  'a{,}{,}{,}',
  'a{,}{,}{,}{,}',
  'one/{a{,}{,}}/{b/c{,,}{,}{,,}{,}}/two',
  '{,}',
  '{a,b{,}{,}{,},c}d',
  '{a,b{,}{,}{,}}',
  '{a{,,}b{,}}',
];

describe('multiples', function() {
  patterns.forEach(function(pattern) {
    it('should expand: ' + pattern, function() {
      assert.deepEqual(expand(pattern).sort(), bash(pattern));
    });
  });
});
