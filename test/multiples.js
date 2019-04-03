'use strict';

const assert = require('assert').strict;
const braces = require('..');

const equal = (input, expected, options) => {
  assert.deepEqual(braces.expand(input, options), expected);
};

describe('multiples', () => {
  const patterns = [
    ['-v{,,,,}', ['-v', '-v', '-v', '-v', '-v']],
    ['-v{,,,,}{,}', ['-v', '-v', '-v', '-v', '-v', '-v', '-v', '-v', '-v', '-v']],
    ['a/b{,}', ['a/b', 'a/b']],
    ['a/{,}/b', ['a//b', 'a//b']],
    ['a/{,}{c,d}/e', ['a/c/e', 'a/d/e', 'a/c/e', 'a/d/e']],
    ['a/{a,b,{,}{,}{,},c}/b', ['a/a/b', 'a/b/b', 'a//b', 'a//b', 'a//b', 'a//b', 'a//b', 'a//b', 'a//b', 'a//b', 'a/c/b']],
    ['a/{a,b,{,},c}/b', ['a/a/b', 'a/b/b', 'a//b', 'a//b', 'a/c/b']],
    ['a/{a,b,{,}{,}{,}}/b', ['a/a/b', 'a/b/b', 'a//b', 'a//b', 'a//b', 'a//b', 'a//b', 'a//b', 'a//b', 'a//b']],
    ['a/{b,cz{,}}/{d{,},ef}{,}', ['a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/ef', 'a/b/ef', 'a/cz/d', 'a/cz/d', 'a/cz/d', 'a/cz/d', 'a/cz/ef', 'a/cz/ef', 'a/cz/d', 'a/cz/d', 'a/cz/d', 'a/cz/d', 'a/cz/ef', 'a/cz/ef']],
    ['a/{b,cz}{,}/{d{,},ef}{,}', ['a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/ef', 'a/b/ef', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/ef', 'a/b/ef', 'a/cz/d', 'a/cz/d', 'a/cz/d', 'a/cz/d', 'a/cz/ef', 'a/cz/ef', 'a/cz/d', 'a/cz/d', 'a/cz/d', 'a/cz/d', 'a/cz/ef', 'a/cz/ef']],
    ['a/{b,c{,}}', ['a/b', 'a/c', 'a/c']],
    ['a/{b,c{,}}/{,}', ['a/b/', 'a/b/', 'a/c/', 'a/c/', 'a/c/', 'a/c/']],
    ['a/{b,c}/{,}', ['a/b/', 'a/b/', 'a/c/', 'a/c/']],
    ['a/{b,c}{,}/d{,}', ['a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/d']],
    ['a/{b,c}{,}/{d,e{,}}', ['a/b/d', 'a/b/e', 'a/b/e', 'a/b/d', 'a/b/e', 'a/b/e', 'a/c/d', 'a/c/e', 'a/c/e', 'a/c/d', 'a/c/e', 'a/c/e']],
    ['a/{b,c}{,}/{d,e}{,}', ['a/b/d', 'a/b/d', 'a/b/e', 'a/b/e', 'a/b/d', 'a/b/d', 'a/b/e', 'a/b/e', 'a/c/d', 'a/c/d', 'a/c/e', 'a/c/e', 'a/c/d', 'a/c/d', 'a/c/e', 'a/c/e']],
    ['a/{b,c}{,}/{d{,},e}{,}', ['a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/e', 'a/b/e', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/d', 'a/b/e', 'a/b/e', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/e', 'a/c/e', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/d', 'a/c/e', 'a/c/e']],
    ['a/{c,d}/{x,y{,}}/e', ['a/c/x/e', 'a/c/y/e', 'a/c/y/e', 'a/d/x/e', 'a/d/y/e', 'a/d/y/e']],
    ['a/{c,d}{,}/e', ['a/c/e', 'a/c/e', 'a/d/e', 'a/d/e']],
    ['a{,,,,,}', ['a', 'a', 'a', 'a', 'a', 'a']],
    ['a{,,,,,}{,}', ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']],
    ['a{,,,,,}{,,}', ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']],
    ['a{,,,,,}{,,}{,}', ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']],
    ['a{,,,,}', ['a', 'a', 'a', 'a', 'a']],
    ['a{,,,}', ['a', 'a', 'a', 'a']],
    ['a{,,}', ['a', 'a', 'a']],
    ['a{,,}{,,}{,,}{,}/b', ['a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b', 'a/b']],
    ['a{,,}{,}', ['a', 'a', 'a', 'a', 'a', 'a']],
    ['a{,}', ['a', 'a']],
    ['a{,}/{c,d}/e', ['a/c/e', 'a/d/e', 'a/c/e', 'a/d/e']],
    ['a{,}b', ['ab', 'ab']],
    ['a{,}{,}', ['a', 'a', 'a', 'a']],
    ['a{,}{,}{,}', ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']],
    ['a{,}{,}{,}{,}', ['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a']],
    ['one/{a{,}{,}}/{b/c{,,}{,}{,,}{,}}/two', ['one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two', 'one/{a}/{b/c}/two']],
    ['{,}', ['', '']],
    ['{,}a/{,}', ['a/', 'a/', 'a/', 'a/']],
    ['{,}{,}', ['', '', '', '']],
    ['{a,b{,}{,}{,},c}d', ['ad', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'bd', 'cd']],
    ['{a,b{,}{,}{,}}', ['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']],
    ['{a{,,}b{,}}', ['{ab}', '{ab}', '{ab}', '{ab}', '{ab}', '{ab}']]
  ];

  patterns.forEach(pattern => {
    it('should expand: ' + pattern[0], () => equal(pattern[0], pattern[1]));
  });
});
