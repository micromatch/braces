'use strict';

var braceExpansion = require('brace-expansion');
var braces = require('..');

console.log('braces');
console.log(braces('http://any.org/archive{1996..1999}/vol{1..4}/part{a,b,c}.html'));
console.log(braces('http://www.numericals.com/file{1..100..10}.txt'));
console.log(braces('http://www.letters.com/file{a..z..2}.txt'));
console.log(braces('mkdir /usr/local/src/bash/{old,new,dist,bugs}'));
console.log(braces('chown root /usr/{ucb/{ex,edit},lib/{ex?.?*,how_ex}}'));
console.log();
console.log();
console.log('braces: {expand: true}');
console.log(braces('http://any.org/archive{1996..1999}/vol{1..4}/part{a,b,c}.html', {expand: true}));
console.log(braces('http://www.numericals.com/file{1..100..10}.txt', {expand: true}));
console.log(braces('http://www.letters.com/file{a..z..2}.txt', {expand: true}));
console.log(braces('mkdir /usr/local/src/bash/{old,new,dist,bugs}', {expand: true}));
console.log(braces('chown root /usr/{ucb/{ex,edit},lib/{ex?.?*,how_ex}}', {expand: true}));
console.log();
console.log();
console.log('brace-expansion');
console.log(braceExpansion('http://any.org/archive{1996..1999}/vol{1..4}/part{a,b,c}.html'));
console.log(braceExpansion('http://www.numericals.com/file{1..100..10}.txt'));
console.log(braceExpansion('http://www.letters.com/file{a..z..2}.txt'));
console.log(braceExpansion('mkdir /usr/local/src/bash/{old,new,dist,bugs}'));
console.log(braceExpansion('chown root /usr/{ucb/{ex,edit},lib/{ex?.?*,how_ex}}'));

