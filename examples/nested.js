var util = require('util');
var braces = require('..').expand;
var expand = require('brace-expansion');
var bash = require('../test/support/bash');

function log(pattern) {
  // console.log('---');
  console.log('equal(\'' + pattern + '\', ', util.inspect(braces(pattern).sort()).split('\n').join('') + ');');
  // console.log('equal(\'' + pattern + '\', ', util.inspect(bash(pattern).sort()).split('\n').join('') + ');');
  // console.log('equal(\'' + pattern + '\', ', util.inspect(expand(pattern).sort()).split('\n').join('') + ');');
  // console.log(expand(pattern));
  console.log();
}

log('{,eno,thro,ro}ugh')
log('{,{,eno,thro,ro}ugh}{,out}')
log('{{,eno,thro,ro}ugh,}{,out}')
log('{,{,a,b}z}{,c}')
log('{,{,a,b}z}{c,}')
log('{,{,a,b}z}{,c,}')
log('{,{,a,b}z}{c,d}')
log('{{,a,b}z,}{,c}')
log('{,a{,b}z,}{,c}')
log('{,a{,b},}{,c}')
log('{,a{,b}}{,c}')
log('{,b}{,d}')
log('{a,b}{,d}')
log('{,a}{z,c}')
log('{,{,a},}{z,c}')
log('{,,a,}{z,c}')
log('{{,a},}{z,c}')
log('{,{,a},}{z,c}')
log('{,{,a}}{z,c}')
log('{{a,},}{z,c}')
log('{{,a},}{z,c}')
log('{,,a}{z,c}')
log('{,a,}{z,c}')
log('{,{,}}{z,c}')
log('{,{a,b}}{,c}')
log('{,{a,}}{,c}')
log('{,{,b}}{,c}')
log('{,{,}}{,c}')
log('{,a}{,c}')
log('{,{,a}b}')
log('{,b}')
log('{,b{,a}}')
log('{b,{,a}}')
log('{,b}{,d}')
log('{a,b}{,d}')
