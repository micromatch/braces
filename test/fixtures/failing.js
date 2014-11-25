module.exports = [
  // minimatch passes this one
  ["{0..10,braces}", ['0..10', 'braces']],
  ["0{1..9} {10..20}", ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']],

  // minimatch passes this one
  // braces => ['a-bd-c', 'a-be-c']
  ["a-{b{d,e}}-c", ['a-{bd}-c', 'a-{be}-c']],

  // I have no idea why this is considered a good, expected result in bash
  ["a-{bdef-{g,i}-c", ['a-{bdef-g-c', 'a-{bdef-i-c']],
  ['{"klklkl"}{1,2,3}', ['{klklkl}1', '{klklkl}2', '{klklkl}3']],
  ['{"x,x"}', ['{x,x}']],

  // braces => [ 'x', 'y', 'abc', 'trie' ]
  ["{x,y,{abc},trie}", ['x,y', '{abc}', 'trie']],

  // braces => ['']
  ["{ }", ['{', '}']],

  // braces => ['foo 1 bar', 'foo 2 bar']
  ["foo {1,2} bar", ['foo', '1', '2', 'bar']],

  // minimatch passes
  ["{0..10,braces}", ['0..10', 'braces']],

  // minimatch passes
  // braces (only the sort order is different) => ['0', 'braces', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  ["{{0..10},braces}", ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces']],
  ["x{{0..10},braces}y", ['x0y', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'x10y', 'xbracesy']],
];
