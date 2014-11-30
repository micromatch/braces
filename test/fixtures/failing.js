module.exports = [
  // minimatch passes this one
  ["{0..10,braces}", ['0..10', 'braces']],

  // minimatch passes this one
  // braces => ['a-bd-c', 'a-be-c']
  ["a-{b{d,e}}-c", ['a-{bd}-c', 'a-{be}-c']],

  // I have no idea why this is considered a good, expected result in bash
  ["a-{bdef-{g,i}-c", ['a-{bdef-g-c', 'a-{bdef-i-c']],
  ["{0..10,braces}", ['0..10', 'braces']],

  ['{"klklkl"}{1,2,3}', ['{klklkl}1', '{klklkl}2', '{klklkl}3']],
  ['{"x,x"}', ['{x,x}']],

  // braces => [ 'x', 'y', 'abc', 'trie' ]
  ["{x,y,{abc},trie}", ['x,y', '{abc}', 'trie']],

  ["{a,b}{{a,b},a,b}", ['aa ab aa ab ba bb ba bb']],

  // minimatch passes
];
