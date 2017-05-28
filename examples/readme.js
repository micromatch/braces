var braces = require('..');

console.log(braces.expand('it{,{{em,alic}iz,erat}e{d,}}'));
console.log(braces.expand('I like {pizza,beer,money}.'));
// console.log(braces.expand('{bull,shoe}{,horn}'));

console.log(braces.expand('{a,b}{1,2}'));
//=> [ 'a1', 'a2', 'b1', 'b2' ]

console.log(braces.expand('{a,b}/{1,2}'));
//=> [ 'a/1', 'a/2', 'b/1', 'b/2' ]

console.log(braces.expand('foo/{a,b,c}/bar').join(' '));
console.log(braces('{a,b}{1,2}'));
//=> [ '(a|b)(1|2)' ]

console.log(braces.expand('{a,b,c}{1,2}').join(' '));
console.log(braces.expand('{4..-4}').join(' '));
//=> [ '(a|b)/(1|2)' ]

console.log(braces.expand('{a,b,c}{1..3}').join(' '));
console.log(braces.expand('{a..j}').join(' '));
console.log(braces.expand('{j..a}').join(' '));
console.log(braces.expand('{1..20..3}').join(' '));
console.log(braces.expand('{a..z..3}').join(' '));
console.log(braces.expand('a{1..3}b').join(' '));
console.log(braces.expand('{1..3}.{0..9}0'));
//=> [ 'a1b', 'a2b', 'a3b' ]
