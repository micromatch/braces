module.exports = {
  'should expand large numbers': {
    units: [
      {
        nominimatch: true,
        fixture: '{2147483645..2147483649}',
        expected: [
          '(214748364[5-9])'
        ],
        options: {
          makeRe: true
        },
        actual: [
          '(214748364[5-9])'
        ],
        optimized: '(214748364[5-9])'
      },
      {
        nominimatch: true,
        fixture: '{214748364..2147483649}',
        expected: [
          '(21474836[4-9]|2147483[7-9][0-9]|214748[4-9][0-9]{2}|214749[0-9]{3}|2147[5-9][0-9]{4}|214[8-9][0-9]{5}|21[5-9][0-9]{6}|2[2-9][0-9]{7}|[3-9][0-9]{8}|1[0-9]{9}|20[0-9]{8}|21[0-3][0-9]{7}|214[0-6][0-9]{6}|2147[0-3][0-9]{5}|21474[0-7][0-9]{4}|214748[0-2][0-9]{3}|2147483[0-5][0-9]{2}|21474836[0-4][0-9])'
        ],
        options: {
          makeRe: true
        },
        actual: [
          '(21474836[4-9]|2147483[7-9][0-9]|214748[4-9][0-9]{2}|214749[0-9]{3}|2147[5-9][0-9]{4}|214[8-9][0-9]{5}|21[5-9][0-9]{6}|2[2-9][0-9]{7}|[3-9][0-9]{8}|1[0-9]{9}|20[0-9]{8}|21[0-3][0-9]{7}|214[0-6][0-9]{6}|2147[0-3][0-9]{5}|21474[0-7][0-9]{4}|214748[0-2][0-9]{3}|2147483[0-5][0-9]{2}|21474836[0-4][0-9])'
        ],
        optimized: '(21474836[4-9]|2147483[7-9][0-9]|214748[4-9][0-9]{2}|214749[0-9]{3}|2147[5-9][0-9]{4}|214[8-9][0-9]{5}|21[5-9][0-9]{6}|2[2-9][0-9]{7}|[3-9][0-9]{8}|1[0-9]{9}|20[0-9]{8}|21[0-3][0-9]{7}|214[0-6][0-9]{6}|2147[0-3][0-9]{5}|21474[0-7][0-9]{4}|214748[0-2][0-9]{3}|2147483[0-5][0-9]{2}|21474836[0-4][0-9])'
      }
    ]
  },
  'should handle invalid sets': {
    units: [
      {
        fixture: '{0..10,braces}',
        expected: [ '0..10', 'braces' ],
        actual: [ '0..10', 'braces' ],
        minimatch: [ '0..10', 'braces' ],
        equal: true,
        optimized: '(0..10|braces)'
      },
      {
        fixture: '{1..10,braces}',
        expected: [ '1..10', 'braces' ],
        actual: [ '1..10', 'braces' ],
        minimatch: [ '1..10', 'braces' ],
        equal: true,
        optimized: '(1..10|braces)'
      }
    ]
  },
  'should not expand escaped braces': {
    units: [
      {
        fixture: '{a,b,c,d,e}',
        expected: [ '{a,b,c,d,e}' ],
        actual: [ '{a,b,c,d,e}' ],
        minimatch: [ 'a', 'b', 'c', 'd', 'e' ],
        equal: true,
        optimized: '(a|b|c|d|e)'
      },
      {
        fixture: 'a/b/c/{x,y}',
        expected: [ 'a/b/c/x', 'a/b/c/y' ],
        actual: [ 'a/b/c/x', 'a/b/c/y' ],
        minimatch: [ 'a/b/c/x', 'a/b/c/y' ],
        equal: true,
        optimized: 'a/b/c/(x|y)'
      },
      {
        fixture: 'a/{x,y}/cde',
        expected: [ 'a/x/cde', 'a/y/cde' ],
        actual: [ 'a/x/cde', 'a/y/cde' ],
        minimatch: [ 'a/x/cde', 'a/y/cde' ],
        equal: true,
        optimized: 'a/(x|y)/cde'
      },
      {
        fixture: 'abcd{efgh',
        expected: [ 'abcd{efgh' ],
        actual: [ 'abcd{efgh' ],
        minimatch: [ 'abcd{efgh' ],
        equal: true,
        optimized: 'abcd\\{efgh'
      },
      {
        fixture: '{abc}',
        expected: [ '{abc}' ],
        actual: [ '{abc}' ],
        minimatch: [ '{abc}' ],
        equal: true,
        optimized: '\\{abc\\}'
      },
      {
        fixture: '{x,y,{a,b,c}}',
        expected: [ 'b', 'c}', 'x', 'y', '{a' ],
        actual: [ 'b', 'c}', 'x', 'y', '{a' ],
        minimatch: [ 'x', 'y', 'a', 'b', 'c' ],
        equal: true,
        optimized: '(x|y|(a|b|c))'
      },
      {
        fixture: '{x,y,{a,b,c}}',
        expected: [ '{x,y,a', '{x,y,b', '{x,y,c}' ],
        actual: [ '{x,y,a', '{x,y,b', '{x,y,c}' ],
        minimatch: [ 'x', 'y', 'a', 'b', 'c' ],
        equal: true,
        optimized: '(x|y|(a|b|c))'
      },
      {
        fixture: '{x,y,{abc},trie}',
        expected: [ 'trie', 'x', 'y', '{abc}' ],
        actual: [ 'trie', 'x', 'y', '{abc}' ],
        minimatch: [ 'x', 'y', '{abc}', 'trie' ],
        equal: true,
        optimized: '(x|y|\\{abc\\}|trie)'
      },
      {
        fixture: '{x,y,{abc},trie}',
        expected: [ 'trie', 'x', 'y', '{abc}' ],
        actual: [ 'trie', 'x', 'y', '{abc}' ],
        minimatch: [ 'x', 'y', '{abc}', 'trie' ],
        equal: true,
        optimized: '(x|y|\\{abc\\}|trie)'
      }
    ]
  },
  'should handle spaces': {
    units: [
      {
        fixture: 'foo {1,2} bar',
        expected: [ 'foo 1 bar', 'foo 2 bar' ],
        actual: [ 'foo 1 bar', 'foo 2 bar' ],
        minimatch: [ 'foo 1 bar', 'foo 2 bar' ],
        equal: true,
        optimized: 'foo (1|2) bar'
      },
      {
        fixture: '0{1..9} {10..20}',
        expected: [ '01 10', '01 11', '01 12', '01 13', '01 14', '01 15', '01 16', '01 17', '01 18', '01 19', '01 20', '02 10', '02 11', '02 12', '02 13', '02 14', '02 15', '02 16', '02 17', '02 18', '02 19', '02 20', '03 10', '03 11', '03 12', '03 13', '03 14', '03 15', '03 16', '03 17', '03 18', '03 19', '03 20', '04 10', '04 11', '04 12', '04 13', '04 14', '04 15', '04 16', '04 17', '04 18', '04 19', '04 20', '05 10', '05 11', '05 12', '05 13', '05 14', '05 15', '05 16', '05 17', '05 18', '05 19', '05 20', '06 10', '06 11', '06 12', '06 13', '06 14', '06 15', '06 16', '06 17', '06 18', '06 19', '06 20', '07 10', '07 11', '07 12', '07 13', '07 14', '07 15', '07 16', '07 17', '07 18', '07 19', '07 20', '08 10', '08 11', '08 12', '08 13', '08 14', '08 15', '08 16', '08 17', '08 18', '08 19', '08 20', '09 10', '09 11', '09 12', '09 13', '09 14', '09 15', '09 16', '09 17', '09 18', '09 19', '09 20' ],
        actual: [ '01 10', '01 11', '01 12', '01 13', '01 14', '01 15', '01 16', '01 17', '01 18', '01 19', '01 20', '02 10', '02 11', '02 12', '02 13', '02 14', '02 15', '02 16', '02 17', '02 18', '02 19', '02 20', '03 10', '03 11', '03 12', '03 13', '03 14', '03 15', '03 16', '03 17', '03 18', '03 19', '03 20', '04 10', '04 11', '04 12', '04 13', '04 14', '04 15', '04 16', '04 17', '04 18', '04 19', '04 20', '05 10', '05 11', '05 12', '05 13', '05 14', '05 15', '05 16', '05 17', '05 18', '05 19', '05 20', '06 10', '06 11', '06 12', '06 13', '06 14', '06 15', '06 16', '06 17', '06 18', '06 19', '06 20', '07 10', '07 11', '07 12', '07 13', '07 14', '07 15', '07 16', '07 17', '07 18', '07 19', '07 20', '08 10', '08 11', '08 12', '08 13', '08 14', '08 15', '08 16', '08 17', '08 18', '08 19', '08 20', '09 10', '09 11', '09 12', '09 13', '09 14', '09 15', '09 16', '09 17', '09 18', '09 19', '09 20' ],
        minimatch: [ '01 10', '01 11', '01 12', '01 13', '01 14', '01 15', '01 16', '01 17', '01 18', '01 19', '01 20', '02 10', '02 11', '02 12', '02 13', '02 14', '02 15', '02 16', '02 17', '02 18', '02 19', '02 20', '03 10', '03 11', '03 12', '03 13', '03 14', '03 15', '03 16', '03 17', '03 18', '03 19', '03 20', '04 10', '04 11', '04 12', '04 13', '04 14', '04 15', '04 16', '04 17', '04 18', '04 19', '04 20', '05 10', '05 11', '05 12', '05 13', '05 14', '05 15', '05 16', '05 17', '05 18', '05 19', '05 20', '06 10', '06 11', '06 12', '06 13', '06 14', '06 15', '06 16', '06 17', '06 18', '06 19', '06 20', '07 10', '07 11', '07 12', '07 13', '07 14', '07 15', '07 16', '07 17', '07 18', '07 19', '07 20', '08 10', '08 11', '08 12', '08 13', '08 14', '08 15', '08 16', '08 17', '08 18', '08 19', '08 20', '09 10', '09 11', '09 12', '09 13', '09 14', '09 15', '09 16', '09 17', '09 18', '09 19', '09 20' ],
        equal: true,
        optimized: '0([1-9]) (1[0-9]|20)'
      },
      {
        fixture: 'a{ ,c{d, },h}x',
        expected: [ 'a x', 'ac x', 'acdx', 'ahx' ],
        actual: [ 'a x', 'ac x', 'acdx', 'ahx' ],
        minimatch: [ 'a x', 'acdx', 'ac x', 'ahx' ],
        equal: true,
        optimized: 'a( |c(d| )|h)x'
      },
      {
        fixture: 'a{ ,c{d, },h} ',
        expected: [ 'a ', 'ac ', 'acd ', 'ah ' ],
        actual: [ 'a ', 'ac ', 'acd ', 'ah ' ],
        minimatch: [ 'a ', 'acd ', 'ac ', 'ah ' ],
        equal: true,
        optimized: 'a( |c(d| )|h) '
      },
      {
        fixture: '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.{html,ejs}',
        expected: [
          '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.ejs',
          '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.html'
        ],
        actual: [
          '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.ejs',
          '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.html'
        ],
        minimatch: [
          '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.html',
          '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.ejs'
        ],
        equal: true,
        optimized: '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.(html|ejs)'
      }
    ]
  },
  'should handle empty braces': {
    units: [
      {
        fixture: '{ }',
        expected: [ '{ }' ],
        actual: [ '{ }' ],
        minimatch: [ '{ }' ],
        equal: true,
        optimized: '\\{|\\}'
      },
      {
        fixture: '{',
        expected: [ '{' ],
        actual: [ '{' ],
        minimatch: [ '{' ],
        equal: true,
        optimized: '\\{'
      },
      {
        fixture: '{}',
        expected: [ '{}' ],
        actual: [ '{}' ],
        minimatch: [ '{}' ],
        equal: true,
        optimized: '\\{\\}'
      },
      {
        fixture: '}',
        expected: [ '}' ],
        actual: [ '}' ],
        minimatch: [ '}' ],
        equal: true,
        optimized: '\\}'
      }
    ]
  },
  'should escape braces when only one value is defined': {
    units: [
      {
        fixture: 'a{b}c',
        expected: [ 'a{b}c' ],
        actual: [ 'a{b}c' ],
        minimatch: [ 'a{b}c' ],
        equal: true,
        optimized: 'a\\{b\\}c'
      },
      {
        fixture: 'a/b/c{d}e',
        expected: [ 'a/b/c{d}e' ],
        actual: [ 'a/b/c{d}e' ],
        minimatch: [ 'a/b/c{d}e' ],
        equal: true,
        optimized: 'a/b/c\\{d\\}e'
      }
    ]
  },
  'should not expand braces in sets with es6/bash-like variables': {
    units: [
      {
        fixture: 'abc/${ddd}/xyz',
        expected: [ 'abc/${ddd}/xyz' ],
        actual: [ 'abc/${ddd}/xyz' ],
        minimatch: [ 'abc/${ddd}/xyz' ],
        equal: true,
        optimized: 'abc/\\$\\{ddd\\}/xyz'
      },
      {
        fixture: 'a${b}c',
        expected: [ 'a${b}c' ],
        actual: [ 'a${b}c' ],
        minimatch: [ 'a${b}c' ],
        equal: true,
        optimized: 'a\\$\\{b\\}c'
      },
      {
        fixture: 'a/{${b},c}/d',
        expected: [ 'a/${b}/d', 'a/c/d' ],
        actual: [ 'a/${b}/d', 'a/c/d' ],
        minimatch: [ 'a/${b}/d', 'a/c/d' ],
        equal: true,
        optimized: 'a/(\\$\\{b\\}|c)/d'
      },
      {
        fixture: 'a${b,d}/{foo,bar}c',
        expected: [ 'a${b,d}/barc', 'a${b,d}/fooc' ],
        actual: [ 'a${b,d}/barc', 'a${b,d}/fooc' ],
        minimatch: [ 'a${b,d}/{foo,bar}c' ],
        equal: false,
        optimized: 'a\\$\\{b,d\\}/(foo|bar)c'
      }
    ]
  },
  'should not expand escaped commas.': {
    units: [
      {
        fixture: 'a{b,c,d}e',
        expected: [ 'abe', 'ace', 'ade' ],
        actual: [ 'abe', 'ace', 'ade' ],
        minimatch: [ 'abe', 'ace', 'ade' ],
        equal: true,
        optimized: 'a(b|c|d)e'
      },
      {
        fixture: 'a{b,c}d',
        expected: [ 'abd', 'acd' ],
        actual: [ 'abd', 'acd' ],
        minimatch: [ 'abd', 'acd' ],
        equal: true,
        optimized: 'a(b|c)d'
      },
      {
        fixture: '{abc,def}',
        expected: [ 'abc', 'def' ],
        actual: [ 'abc', 'def' ],
        minimatch: [ 'abc', 'def' ],
        equal: true,
        optimized: '(abc|def)'
      },
      {
        fixture: '{abc,def,ghi}',
        expected: [ 'abc', 'def', 'ghi' ],
        actual: [ 'abc', 'def', 'ghi' ],
        minimatch: [ 'abc', 'def', 'ghi' ],
        equal: true,
        optimized: '(abc|def|ghi)'
      },
      {
        fixture: 'a/{b,c}/{x,y}/d/e',
        expected: [ 'a/b/x/d/e', 'a/b/y/d/e', 'a/c/x/d/e', 'a/c/y/d/e' ],
        actual: [ 'a/b/x/d/e', 'a/b/y/d/e', 'a/c/x/d/e', 'a/c/y/d/e' ],
        minimatch: [ 'a/b/x/d/e', 'a/b/y/d/e', 'a/c/x/d/e', 'a/c/y/d/e' ],
        equal: true,
        optimized: 'a/(b|c)/(x|y)/d/e'
      }
    ]
  },
  'should return sets with escaped commas': {
    units: []
  },
  'should not expand escaped braces.': {
    units: [
      {
        fixture: '{a,b}c,d}',
        expected: [ 'a', 'b}c', 'd' ],
        actual: [ 'a', 'b}c', 'd' ],
        minimatch: [ 'ac,d}', 'bc,d}' ],
        equal: true,
        optimized: '(a|b)c,d\\}'
      },
      {
        fixture: '{a,b,c,d,e}',
        expected: [ '{a,b,c,d,e}' ],
        actual: [ '{a,b,c,d,e}' ],
        minimatch: [ 'a', 'b', 'c', 'd', 'e' ],
        equal: true,
        optimized: '(a|b|c|d|e)'
      },
      {
        fixture: 'a/{z,{a,b,c,d,e}/d',
        expected: [ 'a/b/d', 'a/c/d', 'a/d/d', 'a/e/d', 'a/z/d', 'a/{a/d' ],
        actual: [ 'a/b/d', 'a/c/d', 'a/d/d', 'a/e/d', 'a/z/d', 'a/{a/d' ],
        minimatch: [ 'a/{z,a/d', 'a/{z,b/d', 'a/{z,c/d', 'a/{z,d/d', 'a/{z,e/d' ],
        equal: true,
        optimized: 'a/\\{z,(a|b|c|d|e)/d'
      },
      {
        fixture: 'a/{b,c}/{d,e}/f',
        expected: [ 'a/{b,c}/d/f', 'a/{b,c}/e/f' ],
        actual: [ 'a/{b,c}/d/f', 'a/{b,c}/e/f' ],
        minimatch: [ 'a/b/d/f', 'a/b/e/f', 'a/c/d/f', 'a/c/e/f' ],
        equal: true,
        optimized: 'a/(b|c)/(d|e)/f'
      },
      {
        fixture: './{x,y}/{a..z..3}/',
        expected: [ './{x,y}/a/', './{x,y}/d/', './{x,y}/g/', './{x,y}/j/', './{x,y}/m/', './{x,y}/p/', './{x,y}/s/', './{x,y}/v/', './{x,y}/y/' ],
        actual: [ './{x,y}/a/', './{x,y}/d/', './{x,y}/g/', './{x,y}/j/', './{x,y}/m/', './{x,y}/p/', './{x,y}/s/', './{x,y}/v/', './{x,y}/y/' ],
        minimatch: [ './x/a/', './x/d/', './x/g/', './x/j/', './x/m/', './x/p/', './x/s/', './x/v/', './x/y/', './y/a/', './y/d/', './y/g/', './y/j/', './y/m/', './y/p/', './y/s/', './y/v/', './y/y/' ],
        equal: true,
        optimized: './(x|y)/(a|d|g|j|m|p|s|v|y)/'
      }
    ]
  },
  'should not expand escaped braces or commas.': {
    units: [
      {
        fixture: '{x,y,{abc},trie}',
        expected: [ 'trie', 'x', 'y', '{abc}' ],
        actual: [ 'trie', 'x', 'y', '{abc}' ],
        minimatch: [ 'x', 'y', '{abc}', 'trie' ],
        equal: true,
        optimized: '(x|y|\\{abc\\}|trie)'
      }
    ]
  },
  'should support sequence brace operators': {
    units: [
      {
        fixture: '/usr/{ucb/{ex,edit},lib/{ex,how_ex}}',
        expected: [ '/usr/lib/ex', '/usr/lib/how_ex', '/usr/ucb/edit', '/usr/ucb/ex' ],
        actual: [ '/usr/lib/ex', '/usr/lib/how_ex', '/usr/ucb/edit', '/usr/ucb/ex' ],
        minimatch: [ '/usr/ucb/ex', '/usr/ucb/edit', '/usr/lib/ex', '/usr/lib/how_ex' ],
        equal: true,
        optimized: '/usr/(ucb/(ex|edit)|lib/(ex|how_ex))'
      },
      {
        fixture: 'ff{c,b,a}',
        expected: [ 'ffa', 'ffb', 'ffc' ],
        actual: [ 'ffa', 'ffb', 'ffc' ],
        minimatch: [ 'ffc', 'ffb', 'ffa' ],
        equal: true,
        optimized: 'ff(c|b|a)'
      },
      {
        fixture: 'f{d,e,f}g',
        expected: [ 'fdg', 'feg', 'ffg' ],
        actual: [ 'fdg', 'feg', 'ffg' ],
        minimatch: [ 'fdg', 'feg', 'ffg' ],
        equal: true,
        optimized: 'f(d|e|f)g'
      },
      {
        fixture: 'x{{0..10},braces}y',
        expected: [ 'x0y', 'x10y', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'xbracesy' ],
        actual: [ 'x0y', 'x10y', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'xbracesy' ],
        minimatch: [ 'x0y', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'x10y', 'xbracesy' ],
        equal: true,
        optimized: 'x(([0-9]|10)|braces)y'
      },
      {
        fixture: '{1..10}',
        expected: [ '1', '10', '2', '3', '4', '5', '6', '7', '8', '9' ],
        actual: [ '1', '10', '2', '3', '4', '5', '6', '7', '8', '9' ],
        minimatch: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
        equal: true,
        optimized: '([1-9]|10)'
      },
      {
        fixture: '{a,b,c}',
        expected: [ 'a', 'b', 'c' ],
        actual: [ 'a', 'b', 'c' ],
        minimatch: [ 'a', 'b', 'c' ],
        equal: true,
        optimized: '(a|b|c)'
      },
      {
        fixture: '{braces,{0..10}}',
        expected: [ '0', '1', '10', '2', '3', '4', '5', '6', '7', '8', '9', 'braces' ],
        actual: [ '0', '1', '10', '2', '3', '4', '5', '6', '7', '8', '9', 'braces' ],
        minimatch: [ 'braces', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
        equal: true,
        optimized: '(braces|([0-9]|10))'
      },
      {
        fixture: '{l,n,m}xyz',
        expected: [ 'lxyz', 'mxyz', 'nxyz' ],
        actual: [ 'lxyz', 'mxyz', 'nxyz' ],
        minimatch: [ 'lxyz', 'nxyz', 'mxyz' ],
        equal: true,
        optimized: '(l|n|m)xyz'
      },
      {
        fixture: '{{0..10},braces}',
        expected: [ '0', '1', '10', '2', '3', '4', '5', '6', '7', '8', '9', 'braces' ],
        actual: [ '0', '1', '10', '2', '3', '4', '5', '6', '7', '8', '9', 'braces' ],
        minimatch: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces' ],
        equal: true,
        optimized: '(([0-9]|10)|braces)'
      },
      {
        fixture: '{{1..10..2},braces}',
        expected: [ '1', '3', '5', '7', '9', 'braces' ],
        actual: [ '1', '3', '5', '7', '9', 'braces' ],
        minimatch: [ '1', '3', '5', '7', '9', 'braces' ],
        equal: true,
        optimized: '((1|3|5|7|9)|braces)'
      },
      {
        fixture: '{{1..10},braces}',
        expected: [ '1', '10', '2', '3', '4', '5', '6', '7', '8', '9', 'braces' ],
        actual: [ '1', '10', '2', '3', '4', '5', '6', '7', '8', '9', 'braces' ],
        minimatch: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces' ],
        equal: true,
        optimized: '(([1-9]|10)|braces)'
      }
    ]
  },
  'should expand multiple sets': {
    units: [
      {
        fixture: 'a/{a,b}/{c,d}/e',
        expected: [ 'a/a/c/e', 'a/a/d/e', 'a/b/c/e', 'a/b/d/e' ],
        actual: [ 'a/a/c/e', 'a/a/d/e', 'a/b/c/e', 'a/b/d/e' ],
        minimatch: [ 'a/a/c/e', 'a/a/d/e', 'a/b/c/e', 'a/b/d/e' ],
        equal: true,
        optimized: 'a/(a|b)/(c|d)/e'
      },
      {
        fixture: 'a{b,c}d{e,f}g',
        expected: [ 'abdeg', 'abdfg', 'acdeg', 'acdfg' ],
        actual: [ 'abdeg', 'abdfg', 'acdeg', 'acdfg' ],
        minimatch: [ 'abdeg', 'abdfg', 'acdeg', 'acdfg' ],
        equal: true,
        optimized: 'a(b|c)d(e|f)g'
      },
      {
        fixture: 'a/{x,y}/c{d,e}f.{md,txt}',
        expected: [ 'a/x/cdf.md', 'a/x/cdf.txt', 'a/x/cef.md', 'a/x/cef.txt', 'a/y/cdf.md', 'a/y/cdf.txt', 'a/y/cef.md', 'a/y/cef.txt' ],
        actual: [ 'a/x/cdf.md', 'a/x/cdf.txt', 'a/x/cef.md', 'a/x/cef.txt', 'a/y/cdf.md', 'a/y/cdf.txt', 'a/y/cef.md', 'a/y/cef.txt' ],
        minimatch: [ 'a/x/cdf.md', 'a/x/cdf.txt', 'a/x/cef.md', 'a/x/cef.txt', 'a/y/cdf.md', 'a/y/cdf.txt', 'a/y/cef.md', 'a/y/cef.txt' ],
        equal: true,
        optimized: 'a/(x|y)/c(d|e)f.(md|txt)'
      }
    ]
  },
  'should expand nested sets': {
    units: [
      {
        fixture: '{a,b}{{a,b},a,b}',
        expected: [ 'aa', 'ab', 'ba', 'bb' ],
        actual: [ 'aa', 'ab', 'ba', 'bb' ],
        minimatch: [ 'aa', 'ab', 'aa', 'ab', 'ba', 'bb', 'ba', 'bb' ],
        equal: false,
        optimized: '(a|b)((a|b)|a|b)'
      },
      {
        fixture: '/usr/{ucb/{ex,edit},lib/{ex,how_ex}}',
        expected: [ '/usr/lib/ex', '/usr/lib/how_ex', '/usr/ucb/edit', '/usr/ucb/ex' ],
        actual: [ '/usr/lib/ex', '/usr/lib/how_ex', '/usr/ucb/edit', '/usr/ucb/ex' ],
        minimatch: [ '/usr/ucb/ex', '/usr/ucb/edit', '/usr/lib/ex', '/usr/lib/how_ex' ],
        equal: true,
        optimized: '/usr/(ucb/(ex|edit)|lib/(ex|how_ex))'
      },
      {
        fixture: 'a{b,c{d,e}f}g',
        expected: [ 'abg', 'acdfg', 'acefg' ],
        actual: [ 'abg', 'acdfg', 'acefg' ],
        minimatch: [ 'abg', 'acdfg', 'acefg' ],
        equal: true,
        optimized: 'a(b|c(d|e)f)g'
      },
      {
        fixture: 'a{{x,y},z}b',
        expected: [ 'axb', 'ayb', 'azb' ],
        actual: [ 'axb', 'ayb', 'azb' ],
        minimatch: [ 'axb', 'ayb', 'azb' ],
        equal: true,
        optimized: 'a((x|y)|z)b'
      },
      {
        fixture: 'f{x,y{g,z}}h',
        expected: [ 'fxh', 'fygh', 'fyzh' ],
        actual: [ 'fxh', 'fygh', 'fyzh' ],
        minimatch: [ 'fxh', 'fygh', 'fyzh' ],
        equal: true,
        optimized: 'f(x|y(g|z))h'
      },
      {
        fixture: 'a{b,c{d,e},h}x/z',
        expected: [ 'abx/z', 'acdx/z', 'acex/z', 'ahx/z' ],
        actual: [ 'abx/z', 'acdx/z', 'acex/z', 'ahx/z' ],
        minimatch: [ 'abx/z', 'acdx/z', 'acex/z', 'ahx/z' ],
        equal: true,
        optimized: 'a(b|c(d|e)|h)x/z'
      },
      {
        fixture: 'a{b,c{d,e},h}x{y,z}',
        expected: [ 'abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'ahxy', 'ahxz' ],
        actual: [ 'abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'ahxy', 'ahxz' ],
        minimatch: [ 'abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'ahxy', 'ahxz' ],
        equal: true,
        optimized: 'a(b|c(d|e)|h)x(y|z)'
      },
      {
        fixture: 'a{b,c{d,e},{f,g}h}x{y,z}',
        expected: [ 'abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'afhxy', 'afhxz', 'aghxy', 'aghxz' ],
        actual: [ 'abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'afhxy', 'afhxz', 'aghxy', 'aghxz' ],
        minimatch: [ 'abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'afhxy', 'afhxz', 'aghxy', 'aghxz' ],
        equal: true,
        optimized: 'a(b|c(d|e)|(f|g)h)x(y|z)'
      },
      {
        fixture: 'a-{b{d,e}}-c',
        expected: [ 'a-{bd}-c', 'a-{be}-c' ],
        actual: [ 'a-{bd}-c', 'a-{be}-c' ],
        minimatch: [ 'a-{bd}-c', 'a-{be}-c' ],
        equal: true,
        optimized: 'a-\\{b(d|e)\\}-c'
      }
    ]
  },
  'should expand with globs.': {
    units: [
      {
        fixture: 'a/b/{d,e}/*.js',
        expected: [ 'a/b/d/*.js', 'a/b/e/*.js' ],
        actual: [ 'a/b/d/*.js', 'a/b/e/*.js' ],
        minimatch: [ 'a/b/d/*.js', 'a/b/e/*.js' ],
        equal: true,
        optimized: 'a/b/(d|e)/*.js'
      },
      {
        fixture: 'a/**/c/{d,e}/f*.js',
        expected: [ 'a/**/c/d/f*.js', 'a/**/c/e/f*.js' ],
        actual: [ 'a/**/c/d/f*.js', 'a/**/c/e/f*.js' ],
        minimatch: [ 'a/**/c/d/f*.js', 'a/**/c/e/f*.js' ],
        equal: true,
        optimized: 'a/**/c/(d|e)/f*.js'
      },
      {
        fixture: 'a/**/c/{d,e}/f*.{md,txt}',
        expected: [ 'a/**/c/d/f*.md', 'a/**/c/d/f*.txt', 'a/**/c/e/f*.md', 'a/**/c/e/f*.txt' ],
        actual: [ 'a/**/c/d/f*.md', 'a/**/c/d/f*.txt', 'a/**/c/e/f*.md', 'a/**/c/e/f*.txt' ],
        minimatch: [ 'a/**/c/d/f*.md', 'a/**/c/d/f*.txt', 'a/**/c/e/f*.md', 'a/**/c/e/f*.txt' ],
        equal: true,
        optimized: 'a/**/c/(d|e)/f*.(md|txt)'
      }
    ]
  },
  'should expand with extglobs (TODO)': {
    units: [
      {
        fixture: 'a/b/{d,e,[1-5]}/*.js',
        expected: [
          'a/b/[1-5]/*.js',
          'a/b/d/*.js',
          'a/b/e/*.js'
        ],
        actual: [
          'a/b/[1-5]/*.js',
          'a/b/d/*.js',
          'a/b/e/*.js'
        ],
        minimatch: [ 'a/b/d/*.js', 'a/b/e/*.js',
          'a/b/[1-5]/*.js'
        ],
        equal: true,
        optimized: 'a/b/(d|e|[1-5])/*.js'
      }
    ]
  },
  'should work with leading and trailing commas.': {
    units: [
      {
        fixture: 'a{b,}c',
        expected: [ 'abc', 'ac' ],
        actual: [ 'abc', 'ac' ],
        minimatch: [ 'abc', 'ac' ],
        equal: true,
        optimized: 'a(b|)c'
      },
      {
        fixture: 'a{,b}c',
        expected: [ 'abc', 'ac' ],
        actual: [ 'abc', 'ac' ],
        minimatch: [ 'ac', 'abc' ],
        equal: true,
        optimized: 'a(|b)c'
      }
    ]
  },
  'should not try to expand ranges with decimals': {
    units: [
      {
        fixture: '{1.1..2.1}',
        expected: [ '{1.1..2.1}' ],
        actual: [ '{1.1..2.1}' ],
        minimatch: [ '{1.1..2.1}' ],
        equal: true,
        optimized: '\\{1.1..2.1\\}'
      },
      {
        fixture: '{1.1..~2.1}',
        expected: [ '{1.1..~2.1}' ],
        actual: [ '{1.1..~2.1}' ],
        minimatch: [ '{1.1..~2.1}' ],
        equal: true,
        optimized: '\\{1.1..~2.1\\}'
      }
    ]
  },
  'should escape invalid ranges': {
    units: [
      {
        fixture: '{1..0f}',
        expected: [ '{1..0f}' ],
        actual: [ '{1..0f}' ],
        minimatch: [ '{1..0f}' ],
        equal: true,
        optimized: '\\{1..0f\\}'
      },
      {
        fixture: '{1..10..ff}',
        expected: [ '{1..10..ff}' ],
        actual: [ '{1..10..ff}' ],
        minimatch: [ '{1..10..ff}' ],
        equal: true,
        optimized: '\\{1..10..ff\\}'
      },
      {
        fixture: '{1..10.f}',
        expected: [ '{1..10.f}' ],
        actual: [ '{1..10.f}' ],
        minimatch: [ '{1..10.f}' ],
        equal: true,
        optimized: '\\{1..10.f\\}'
      },
      {
        fixture: '{1..10f}',
        expected: [ '{1..10f}' ],
        actual: [ '{1..10f}' ],
        minimatch: [ '{1..10f}' ],
        equal: true,
        optimized: '\\{1..10f\\}'
      },
      {
        fixture: '{1..20..2f}',
        expected: [ '{1..20..2f}' ],
        actual: [ '{1..20..2f}' ],
        minimatch: [ '{1..20..2f}' ],
        equal: true,
        optimized: '\\{1..20..2f\\}'
      },
      {
        fixture: '{1..20..f2}',
        expected: [ '{1..20..f2}' ],
        actual: [ '{1..20..f2}' ],
        minimatch: [ '{1..20..f2}' ],
        equal: true,
        optimized: '\\{1..20..f2\\}'
      },
      {
        fixture: '{1..2f..2}',
        expected: [ '{1..2f..2}' ],
        actual: [ '{1..2f..2}' ],
        minimatch: [ '{1..2f..2}' ],
        equal: true,
        optimized: '\\{1..2f..2\\}'
      },
      {
        fixture: '{1..ff..2}',
        expected: [ '{1..ff..2}' ],
        actual: [ '{1..ff..2}' ],
        minimatch: [ '{1..ff..2}' ],
        equal: true,
        optimized: '\\{1..ff..2\\}'
      },
      {
        fixture: '{1..ff}',
        expected: [ '{1..ff}' ],
        actual: [ '{1..ff}' ],
        minimatch: [ '{1..ff}' ],
        equal: true,
        optimized: '\\{1..ff\\}'
      },
      {
        fixture: '{1..f}',
        expected: [
          '',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          ':',
          ';',
          '<',
          '=',
          '>',
          '?',
          '@',
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          '[',
          ']',
          '^',
          '_',
          '`',
          'a',
          'b',
          'c',
          'd',
          'e',
          'f'
        ],
        actual: [
          '',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          ':',
          ';',
          '<',
          '=',
          '>',
          '?',
          '@',
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          '[',
          ']',
          '^',
          '_',
          '`',
          'a',
          'b',
          'c',
          'd',
          'e',
          'f'
        ],
        minimatch: [ '{1..f}' ],
        equal: false,
        optimized: '([1-f])'
      },
      {
        fixture: '{1.20..2}',
        expected: [ '{1.20..2}' ],
        actual: [ '{1.20..2}' ],
        minimatch: [ '{1.20..2}' ],
        equal: true,
        optimized: '\\{1.20..2\\}'
      }
    ]
  },
  'should handle weirdly-formed brace expansions -- fixed in post-bash-3.1': {
    units: [
      {
        fixture: 'a-{b{d,e}}-c',
        expected: [ 'a-{bd}-c', 'a-{be}-c' ],
        actual: [ 'a-{bd}-c', 'a-{be}-c' ],
        minimatch: [ 'a-{bd}-c', 'a-{be}-c' ],
        equal: true,
        optimized: 'a-\\{b(d|e)\\}-c'
      },
      {
        fixture: 'a-{bdef-{g,i}-c',
        expected: [ 'a-{bdef-g-c', 'a-{bdef-i-c' ],
        actual: [ 'a-{bdef-g-c', 'a-{bdef-i-c' ],
        minimatch: [ 'a-{bdef-g-c', 'a-{bdef-i-c' ],
        equal: true,
        optimized: 'a-\\{bdef-(g|i)-c'
      }
    ]
  },
  'should not expand quoted strings.': {
    units: [
      {
        fixture: '{"klklkl"}{1,2,3}',
        expected: [ '{"klklkl"}1', '{"klklkl"}2', '{"klklkl"}3' ],
        actual: [ '{"klklkl"}1', '{"klklkl"}2', '{"klklkl"}3' ],
        minimatch: [ '{"klklkl"}1', '{"klklkl"}2', '{"klklkl"}3' ],
        equal: true,
        optimized: '\\{klklkl\\}(1|2|3)'
      },
      {
        fixture: '{"x,x"}',
        expected: [ '"x', 'x"' ],
        actual: [ '"x', 'x"' ],
        minimatch: [ '"x', 'x"' ],
        equal: true,
        optimized: '\\{x,x\\}'
      }
    ]
  },
  'should escaped outer braces in nested non-sets': {
    units: [
      {
        fixture: '{a-{b,c,d}}',
        expected: [ '{a-b}', '{a-c}', '{a-d}' ],
        actual: [ '{a-b}', '{a-c}', '{a-d}' ],
        minimatch: [ '{a-b}', '{a-c}', '{a-d}' ],
        equal: true,
        optimized: '\\{a-(b|c|d)\\}'
      },
      {
        fixture: '{a,{a-{b,c,d}}}',
        expected: [ 'a', '{a-b}', '{a-c}', '{a-d}' ],
        actual: [ 'a', '{a-b}', '{a-c}', '{a-d}' ],
        minimatch: [ 'a', '{a-b}', '{a-c}', '{a-d}' ],
        equal: true,
        optimized: '(a|\\{a-(b|c|d)\\})'
      }
    ]
  },
  'should escape imbalanced braces': {
    units: [
      {
        fixture: 'a-{bdef-{g,i}-c',
        expected: [ 'a-{bdef-g-c', 'a-{bdef-i-c' ],
        actual: [ 'a-{bdef-g-c', 'a-{bdef-i-c' ],
        minimatch: [ 'a-{bdef-g-c', 'a-{bdef-i-c' ],
        equal: true,
        optimized: 'a-\\{bdef-(g|i)-c'
      },
      {
        fixture: 'abc{',
        expected: [ 'abc{' ],
        actual: [ 'abc{' ],
        minimatch: [ 'abc{' ],
        equal: true,
        optimized: 'abc\\{'
      },
      {
        fixture: '{abc{',
        expected: [ '{abc{' ],
        actual: [ '{abc{' ],
        minimatch: [ '{abc{' ],
        equal: true,
        optimized: '\\{abc\\{'
      },
      {
        fixture: '{abc',
        expected: [ '{abc' ],
        actual: [ '{abc' ],
        minimatch: [ '{abc' ],
        equal: true,
        optimized: '\\{abc'
      },
      {
        fixture: '}abc',
        expected: [ '}abc' ],
        actual: [ '}abc' ],
        minimatch: [ '}abc' ],
        equal: true,
        optimized: '\\}abc'
      },
      {
        fixture: 'ab{c',
        expected: [ 'ab{c' ],
        actual: [ 'ab{c' ],
        minimatch: [ 'ab{c' ],
        equal: true,
        optimized: 'ab\\{c'
      },
      {
        fixture: 'ab{c',
        expected: [ 'ab{c' ],
        actual: [ 'ab{c' ],
        minimatch: [ 'ab{c' ],
        equal: true,
        optimized: 'ab\\{c'
      },
      {
        fixture: '{{a,b}',
        expected: [ '{a', '{b' ],
        actual: [ '{a', '{b' ],
        minimatch: [ '{a', '{b' ],
        equal: true,
        optimized: '\\{(a|b)'
      },
      {
        fixture: '{a,b}}',
        expected: [ 'a}', 'b}' ],
        actual: [ 'a}', 'b}' ],
        minimatch: [ 'a}', 'b}' ],
        equal: true,
        optimized: '(a|b)\\}'
      },
      {
        fixture: 'abcd{efgh',
        expected: [ 'abcd{efgh' ],
        actual: [ 'abcd{efgh' ],
        minimatch: [ 'abcd{efgh' ],
        equal: true,
        optimized: 'abcd\\{efgh'
      },
      {
        fixture: 'a{b{c{d,e}f}g}h',
        expected: [ 'a{b{cdf}g}h', 'a{b{cef}g}h' ],
        actual: [ 'a{b{cdf}g}h', 'a{b{cef}g}h' ],
        minimatch: [ 'a{b{cdf}g}h', 'a{b{cef}g}h' ],
        equal: true,
        optimized: 'a(b(c(d|e)f)g)h'
      },
      {
        fixture: 'f{x,y{{g,z}}h}',
        expected: [ 'fx', 'fy{g}h', 'fy{z}h' ],
        actual: [ 'fx', 'fy{g}h', 'fy{z}h' ],
        minimatch: [ 'fx', 'fy{g}h', 'fy{z}h' ],
        equal: true,
        optimized: 'f(x|y((g|z))h)'
      },
      {
        fixture: 'z{a,b},c}d',
        expected: [ 'za,c}d', 'zb,c}d' ],
        actual: [ 'za,c}d', 'zb,c}d' ],
        minimatch: [ 'za,c}d', 'zb,c}d' ],
        equal: true,
        optimized: 'z(a|b),c\\}d'
      },
      {
        fixture: 'a{b{c{d,e}f{x,y{{g}h',
        expected: [ 'a{b{cdf{x,y{{g}h', 'a{b{cef{x,y{{g}h' ],
        actual: [ 'a{b{cdf{x,y{{g}h', 'a{b{cef{x,y{{g}h' ],
        minimatch: [ 'a{b{cdf{x,y{{g}h', 'a{b{cef{x,y{{g}h' ],
        equal: true,
        optimized: 'a\\{b\\{c(d|e)f\\{x,y\\{\\{g\\}h'
      },
      {
        fixture: 'f{x,y{{g}h',
        expected: [ 'f{x,y{{g}h' ],
        actual: [ 'f{x,y{{g}h' ],
        minimatch: [ 'f{x,y{{g}h' ],
        equal: true,
        optimized: 'f\\{x,y\\{\\{g\\}h'
      },
      {
        fixture: 'f{x,y{{g}}h',
        expected: [ 'f{x,y{{g}}h' ],
        actual: [ 'f{x,y{{g}}h' ],
        minimatch: [ 'f{x,y{{g}}h' ],
        equal: true,
        optimized: 'f\\{x,y(\\{g\\})h'
      },
      {
        fixture: 'a{b{c{d,e}f{x,y{}g}h',
        expected: [ 'a{b{cdfxh', 'a{b{cdfy{}gh', 'a{b{cefxh', 'a{b{cefy{}gh' ],
        actual: [ 'a{b{cdfxh', 'a{b{cdfy{}gh', 'a{b{cefxh', 'a{b{cefy{}gh' ],
        minimatch: [ 'a{b{cdfxh', 'a{b{cdfy{}gh', 'a{b{cefxh', 'a{b{cefy{}gh' ],
        equal: true,
        optimized: 'a\\{b\\{c(d|e)f(x|y\\{\\}g)h'
      },
      {
        fixture: 'f{x,y{}g}h',
        expected: [ 'fxh', 'fy{}gh' ],
        actual: [ 'fxh', 'fy{}gh' ],
        minimatch: [ 'fxh', 'fy{}gh' ],
        equal: true,
        optimized: 'f(x|y\\{\\}g)h'
      },
      {
        fixture: 'z{a,b{,c}d',
        expected: [ 'z{a,bcd', 'z{a,bd' ],
        actual: [ 'z{a,bcd', 'z{a,bd' ],
        minimatch: [ 'z{a,bd', 'z{a,bcd' ],
        equal: true,
        optimized: 'z\\{a,b(|c)d'
      }
    ]
  },
  'should expand numeric ranges': {
    units: [
      {
        fixture: 'a{0..3}d',
        expected: [ 'a0d', 'a1d', 'a2d', 'a3d' ],
        actual: [ 'a0d', 'a1d', 'a2d', 'a3d' ],
        minimatch: [ 'a0d', 'a1d', 'a2d', 'a3d' ],
        equal: true,
        optimized: 'a([0-3])d'
      },
      {
        fixture: 'x{10..1}y',
        expected: [ 'x10y', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y' ],
        actual: [ 'x10y', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y' ],
        minimatch: [ 'x10y', 'x9y', 'x8y', 'x7y', 'x6y', 'x5y', 'x4y', 'x3y', 'x2y', 'x1y' ],
        equal: true,
        optimized: 'x([1-9]|10)y'
      },
      {
        fixture: 'x{3..3}y',
        expected: [ 'x3y' ],
        actual: [ 'x3y' ],
        minimatch: [ 'x3y' ],
        equal: true,
        optimized: 'x3y'
      },
      {
        fixture: '{1..10}',
        expected: [ '1', '10', '2', '3', '4', '5', '6', '7', '8', '9' ],
        actual: [ '1', '10', '2', '3', '4', '5', '6', '7', '8', '9' ],
        minimatch: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
        equal: true,
        optimized: '([1-9]|10)'
      },
      {
        fixture: '{1..3}',
        expected: [ '1', '2', '3' ],
        actual: [ '1', '2', '3' ],
        minimatch: [ '1', '2', '3' ],
        equal: true,
        optimized: '([1-3])'
      },
      {
        fixture: '{1..9}',
        expected: [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
        actual: [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
        minimatch: [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
        equal: true,
        optimized: '([1-9])'
      },
      {
        fixture: '{10..1}',
        expected: [ '1', '10', '2', '3', '4', '5', '6', '7', '8', '9' ],
        actual: [ '1', '10', '2', '3', '4', '5', '6', '7', '8', '9' ],
        minimatch: [ '10', '9', '8', '7', '6', '5', '4', '3', '2', '1' ],
        equal: true,
        optimized: '([1-9]|10)'
      },
      {
        fixture: '{10..1}y',
        expected: [ '10y', '1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y' ],
        actual: [ '10y', '1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y' ],
        minimatch: [ '10y', '9y', '8y', '7y', '6y', '5y', '4y', '3y', '2y', '1y' ],
        equal: true,
        optimized: '([1-9]|10)y'
      },
      {
        fixture: '{3..3}',
        expected: [ '3' ],
        actual: [ '3' ],
        minimatch: [ '3' ],
        equal: true,
        optimized: '3'
      },
      {
        fixture: '{5..8}',
        expected: [ '5', '6', '7', '8' ],
        actual: [ '5', '6', '7', '8' ],
        minimatch: [ '5', '6', '7', '8' ],
        equal: true,
        optimized: '([5-8])'
      }
    ]
  },
  'should expand ranges with negative numbers': {
    units: [
      {
        fixture: '{-10..-1}',
        expected: [ '-1', '-10', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9' ],
        actual: [ '-1', '-10', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9' ],
        minimatch: [ '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1' ],
        equal: true,
        optimized: '(-[1-9]|-10)'
      },
      {
        fixture: '{-20..0}',
        expected: [ '-1', '-10', '-11', '-12', '-13', '-14', '-15', '-16', '-17', '-18', '-19', '-2', '-20', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '0' ],
        actual: [ '-1', '-10', '-11', '-12', '-13', '-14', '-15', '-16', '-17', '-18', '-19', '-2', '-20', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '0' ],
        minimatch: [ '-20', '-19', '-18', '-17', '-16', '-15', '-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0' ],
        equal: true,
        optimized: '(-[1-9]|-1[0-9]|-20|0)'
      },
      {
        fixture: '{0..-5}',
        expected: [ '-1', '-2', '-3', '-4', '-5', '0' ],
        actual: [ '-1', '-2', '-3', '-4', '-5', '0' ],
        minimatch: [ '0', '-1', '-2', '-3', '-4', '-5' ],
        equal: true,
        optimized: '(-[1-5]|0)'
      },
      {
        fixture: '{9..-4}',
        expected: [ '-1', '-2', '-3', '-4', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
        actual: [ '-1', '-2', '-3', '-4', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
        minimatch: [ '9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4' ],
        equal: true,
        optimized: '(-[1-4]|[0-9])'
      }
    ]
  },
  'should expand alphabetical ranges': {
    units: [
      {
        fixture: '0{1..9}/{10..20}',
        expected: [ '01/10', '01/11', '01/12', '01/13', '01/14', '01/15', '01/16', '01/17', '01/18', '01/19', '01/20', '02/10', '02/11', '02/12', '02/13', '02/14', '02/15', '02/16', '02/17', '02/18', '02/19', '02/20', '03/10', '03/11', '03/12', '03/13', '03/14', '03/15', '03/16', '03/17', '03/18', '03/19', '03/20', '04/10', '04/11', '04/12', '04/13', '04/14', '04/15', '04/16', '04/17', '04/18', '04/19', '04/20', '05/10', '05/11', '05/12', '05/13', '05/14', '05/15', '05/16', '05/17', '05/18', '05/19', '05/20', '06/10', '06/11', '06/12', '06/13', '06/14', '06/15', '06/16', '06/17', '06/18', '06/19', '06/20', '07/10', '07/11', '07/12', '07/13', '07/14', '07/15', '07/16', '07/17', '07/18', '07/19', '07/20', '08/10', '08/11', '08/12', '08/13', '08/14', '08/15', '08/16', '08/17', '08/18', '08/19', '08/20', '09/10', '09/11', '09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18', '09/19', '09/20' ],
        actual: [ '01/10', '01/11', '01/12', '01/13', '01/14', '01/15', '01/16', '01/17', '01/18', '01/19', '01/20', '02/10', '02/11', '02/12', '02/13', '02/14', '02/15', '02/16', '02/17', '02/18', '02/19', '02/20', '03/10', '03/11', '03/12', '03/13', '03/14', '03/15', '03/16', '03/17', '03/18', '03/19', '03/20', '04/10', '04/11', '04/12', '04/13', '04/14', '04/15', '04/16', '04/17', '04/18', '04/19', '04/20', '05/10', '05/11', '05/12', '05/13', '05/14', '05/15', '05/16', '05/17', '05/18', '05/19', '05/20', '06/10', '06/11', '06/12', '06/13', '06/14', '06/15', '06/16', '06/17', '06/18', '06/19', '06/20', '07/10', '07/11', '07/12', '07/13', '07/14', '07/15', '07/16', '07/17', '07/18', '07/19', '07/20', '08/10', '08/11', '08/12', '08/13', '08/14', '08/15', '08/16', '08/17', '08/18', '08/19', '08/20', '09/10', '09/11', '09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18', '09/19', '09/20' ],
        minimatch: [ '01/10', '01/11', '01/12', '01/13', '01/14', '01/15', '01/16', '01/17', '01/18', '01/19', '01/20', '02/10', '02/11', '02/12', '02/13', '02/14', '02/15', '02/16', '02/17', '02/18', '02/19', '02/20', '03/10', '03/11', '03/12', '03/13', '03/14', '03/15', '03/16', '03/17', '03/18', '03/19', '03/20', '04/10', '04/11', '04/12', '04/13', '04/14', '04/15', '04/16', '04/17', '04/18', '04/19', '04/20', '05/10', '05/11', '05/12', '05/13', '05/14', '05/15', '05/16', '05/17', '05/18', '05/19', '05/20', '06/10', '06/11', '06/12', '06/13', '06/14', '06/15', '06/16', '06/17', '06/18', '06/19', '06/20', '07/10', '07/11', '07/12', '07/13', '07/14', '07/15', '07/16', '07/17', '07/18', '07/19', '07/20', '08/10', '08/11', '08/12', '08/13', '08/14', '08/15', '08/16', '08/17', '08/18', '08/19', '08/20', '09/10', '09/11', '09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18', '09/19', '09/20' ],
        equal: true,
        optimized: '0([1-9])/(1[0-9]|20)'
      },
      {
        fixture: '0{a..d}0',
        expected: [ '0a0', '0b0', '0c0', '0d0' ],
        actual: [ '0a0', '0b0', '0c0', '0d0' ],
        minimatch: [ '0a0', '0b0', '0c0', '0d0' ],
        equal: true,
        optimized: '0([a-d])0'
      },
      {
        fixture: 'a/{b..d}/e',
        expected: [ 'a/b/e', 'a/c/e', 'a/d/e' ],
        actual: [ 'a/b/e', 'a/c/e', 'a/d/e' ],
        minimatch: [ 'a/b/e', 'a/c/e', 'a/d/e' ],
        equal: true,
        optimized: 'a/([b-d])/e'
      },
      {
        fixture: '{1..f}',
        expected: [
          '',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          ':',
          ';',
          '<',
          '=',
          '>',
          '?',
          '@',
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          '[',
          ']',
          '^',
          '_',
          '`',
          'a',
          'b',
          'c',
          'd',
          'e',
          'f'
        ],
        actual: [
          '',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          ':',
          ';',
          '<',
          '=',
          '>',
          '?',
          '@',
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          '[',
          ']',
          '^',
          '_',
          '`',
          'a',
          'b',
          'c',
          'd',
          'e',
          'f'
        ],
        minimatch: [ '{1..f}' ],
        equal: false,
        optimized: '([1-f])'
      },
      {
        fixture: '{a..A}',
        expected: [
          '',
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          '[',
          ']',
          '^',
          '_',
          '`',
          'a'
        ],
        actual: [
          '',
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          '[',
          ']',
          '^',
          '_',
          '`',
          'a'
        ],
        minimatch: [ 'a', '`', '_', '^',
          ']',
          '',
          '[',
          'Z',
          'Y',
          'X',
          'W',
          'V',
          'U',
          'T',
          'S',
          'R',
          'Q',
          'P',
          'O',
          'N',
          'M',
          'L',
          'K',
          'J',
          'I',
          'H',
          'G',
          'F',
          'E',
          'D',
          'C',
          'B',
          'A'
        ],
        equal: true,
        optimized: '([A-a])'
      },
      {
        fixture: '{A..a}',
        expected: [
          '',
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          '[',
          ']',
          '^',
          '_',
          '`',
          'a'
        ],
        actual: [
          '',
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          '[',
          ']',
          '^',
          '_',
          '`',
          'a'
        ],
        minimatch: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[',
          '',
          ']',
          '^',
          '_',
          '`',
          'a'
        ],
        equal: true,
        optimized: '([A-a])'
      },
      {
        fixture: '{a..e}',
        expected: [ 'a', 'b', 'c', 'd', 'e' ],
        actual: [ 'a', 'b', 'c', 'd', 'e' ],
        minimatch: [ 'a', 'b', 'c', 'd', 'e' ],
        equal: true,
        optimized: '([a-e])'
      },
      {
        fixture: '{A..E}',
        expected: [ 'A', 'B', 'C', 'D', 'E' ],
        actual: [ 'A', 'B', 'C', 'D', 'E' ],
        minimatch: [ 'A', 'B', 'C', 'D', 'E' ],
        equal: true,
        optimized: '([A-E])'
      },
      {
        fixture: '{a..f}',
        expected: [ 'a', 'b', 'c', 'd', 'e', 'f' ],
        actual: [ 'a', 'b', 'c', 'd', 'e', 'f' ],
        minimatch: [ 'a', 'b', 'c', 'd', 'e', 'f' ],
        equal: true,
        optimized: '([a-f])'
      },
      {
        fixture: '{a..z}',
        expected: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
        actual: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
        minimatch: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
        equal: true,
        optimized: '([a-z])'
      },
      {
        fixture: '{E..A}',
        expected: [ 'A', 'B', 'C', 'D', 'E' ],
        actual: [ 'A', 'B', 'C', 'D', 'E' ],
        minimatch: [ 'E', 'D', 'C', 'B', 'A' ],
        equal: true,
        optimized: '([A-E])'
      },
      {
        fixture: '{f..1}',
        expected: [
          '',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          ':',
          ';',
          '<',
          '=',
          '>',
          '?',
          '@',
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          '[',
          ']',
          '^',
          '_',
          '`',
          'a',
          'b',
          'c',
          'd',
          'e',
          'f'
        ],
        actual: [
          '',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          ':',
          ';',
          '<',
          '=',
          '>',
          '?',
          '@',
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
          '[',
          ']',
          '^',
          '_',
          '`',
          'a',
          'b',
          'c',
          'd',
          'e',
          'f'
        ],
        minimatch: [ '{f..1}' ],
        equal: false,
        optimized: '([1-f])'
      },
      {
        fixture: '{f..a}',
        expected: [ 'a', 'b', 'c', 'd', 'e', 'f' ],
        actual: [ 'a', 'b', 'c', 'd', 'e', 'f' ],
        minimatch: [ 'f', 'e', 'd', 'c', 'b', 'a' ],
        equal: true,
        optimized: '([a-f])'
      },
      {
        fixture: '{f..f}',
        expected: [ 'f' ],
        actual: [ 'f' ],
        minimatch: [ 'f' ],
        equal: true,
        optimized: 'f'
      }
    ]
  },
  'should expand multiple ranges': {
    units: [
      {
        fixture: 'a/{b..d}/e/{f..h}',
        expected: [ 'a/b/e/f', 'a/b/e/g', 'a/b/e/h', 'a/c/e/f', 'a/c/e/g', 'a/c/e/h', 'a/d/e/f', 'a/d/e/g', 'a/d/e/h' ],
        actual: [ 'a/b/e/f', 'a/b/e/g', 'a/b/e/h', 'a/c/e/f', 'a/c/e/g', 'a/c/e/h', 'a/d/e/f', 'a/d/e/g', 'a/d/e/h' ],
        minimatch: [ 'a/b/e/f', 'a/b/e/g', 'a/b/e/h', 'a/c/e/f', 'a/c/e/g', 'a/c/e/h', 'a/d/e/f', 'a/d/e/g', 'a/d/e/h' ],
        equal: true,
        optimized: 'a/([b-d])/e/([f-h])'
      }
    ]
  },
  'should expand numerical ranges - positive and negative': {
    units: [
      {
        fixture: '{-10..10}',
        expected: [ '-1', '-10', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '0', '1', '10', '2', '3', '4', '5', '6', '7', '8', '9' ],
        actual: [ '-1', '-10', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '0', '1', '10', '2', '3', '4', '5', '6', '7', '8', '9' ],
        minimatch: [ '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
        equal: true,
        optimized: '(-[1-9]|-?10|[0-9])'
      }
    ]
  },
  'should expand ranges using steps': {
    units: [
      {
        fixture: '{1..10..1}',
        expected: [ '1', '10', '2', '3', '4', '5', '6', '7', '8', '9' ],
        actual: [ '1', '10', '2', '3', '4', '5', '6', '7', '8', '9' ],
        minimatch: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
        equal: true,
        optimized: '([1-9]|10)'
      },
      {
        fixture: '{1..10..2}',
        expected: [ '1', '3', '5', '7', '9' ],
        actual: [ '1', '3', '5', '7', '9' ],
        minimatch: [ '1', '3', '5', '7', '9' ],
        equal: true,
        optimized: '(1|3|5|7|9)'
      },
      {
        fixture: '{1..20..20}',
        expected: [ '1' ],
        actual: [ '1' ],
        minimatch: [ '1' ],
        equal: true,
        optimized: '1'
      },
      {
        fixture: '{1..20..20}',
        expected: [ '1' ],
        actual: [ '1' ],
        minimatch: [ '1' ],
        equal: true,
        optimized: '1'
      },
      {
        fixture: '{1..20..20}',
        expected: [ '1' ],
        actual: [ '1' ],
        minimatch: [ '1' ],
        equal: true,
        optimized: '1'
      },
      {
        fixture: '{1..20..2}',
        expected: [ '1', '11', '13', '15', '17', '19', '3', '5', '7', '9' ],
        actual: [ '1', '11', '13', '15', '17', '19', '3', '5', '7', '9' ],
        minimatch: [ '1', '3', '5', '7', '9', '11', '13', '15', '17', '19' ],
        equal: true,
        optimized: '(1|3|5|7|9|11|13|15|17|19)'
      },
      {
        fixture: '{10..0..2}',
        expected: [ '0', '10', '2', '4', '6', '8' ],
        actual: [ '0', '10', '2', '4', '6', '8' ],
        minimatch: [ '10', '8', '6', '4', '2', '0' ],
        equal: true,
        optimized: '(10|8|6|4|2|0)'
      },
      {
        fixture: '{10..1..2}',
        expected: [ '10', '2', '4', '6', '8' ],
        actual: [ '10', '2', '4', '6', '8' ],
        minimatch: [ '10', '8', '6', '4', '2' ],
        equal: true,
        optimized: '(10|8|6|4|2)'
      },
      {
        fixture: '{100..0..5}',
        expected: [ '0', '10', '100', '15', '20', '25', '30', '35', '40', '45', '5', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95' ],
        actual: [ '0', '10', '100', '15', '20', '25', '30', '35', '40', '45', '5', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95' ],
        minimatch: [ '100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0' ],
        equal: true,
        optimized: '(100|95|90|85|80|75|70|65|60|55|50|45|40|35|30|25|20|15|10|5|0)'
      },
      {
        fixture: '{2..10..1}',
        expected: [ '10', '2', '3', '4', '5', '6', '7', '8', '9' ],
        actual: [ '10', '2', '3', '4', '5', '6', '7', '8', '9' ],
        minimatch: [ '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
        equal: true,
        optimized: '([2-9]|10)'
      },
      {
        fixture: '{2..10..2}',
        expected: [ '10', '2', '4', '6', '8' ],
        actual: [ '10', '2', '4', '6', '8' ],
        minimatch: [ '2', '4', '6', '8', '10' ],
        equal: true,
        optimized: '(2|4|6|8|10)'
      },
      {
        fixture: '{2..10..3}',
        expected: [ '2', '5', '8' ],
        actual: [ '2', '5', '8' ],
        minimatch: [ '2', '5', '8' ],
        equal: true,
        optimized: '(2|5|8)'
      },
      {
        fixture: '{a..z..2}',
        expected: [ 'a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y' ],
        actual: [ 'a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y' ],
        minimatch: [ 'a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y' ],
        equal: true,
        optimized: '(a|c|e|g|i|k|m|o|q|s|u|w|y)'
      }
    ]
  },
  'should expand positive ranges with negative steps': {
    units: [
      {
        fixture: '{10..0..-2}',
        expected: [ '0', '10', '2', '4', '6', '8' ],
        actual: [ '0', '10', '2', '4', '6', '8' ],
        minimatch: [ '10', '8', '6', '4', '2', '0' ],
        equal: true,
        optimized: '(10|8|6|4|2|0)'
      }
    ]
  },
  'should expand negative ranges using steps': {
    units: [
      {
        fixture: '{-1..-10..-2}',
        expected: [ '-1', '-3', '-5', '-7', '-9' ],
        actual: [ '-1', '-3', '-5', '-7', '-9' ],
        minimatch: [ '-1', '-3', '-5', '-7', '-9' ],
        equal: true,
        optimized: '-(1|3|5|7|9)'
      },
      {
        fixture: '{-1..-10..2}',
        expected: [ '-1', '-3', '-5', '-7', '-9' ],
        actual: [ '-1', '-3', '-5', '-7', '-9' ],
        minimatch: [ '-1', '-3', '-5', '-7', '-9' ],
        equal: true,
        optimized: '-(1|3|5|7|9)'
      },
      {
        fixture: '{-10..-2..2}',
        expected: [ '-10', '-2', '-4', '-6', '-8' ],
        actual: [ '-10', '-2', '-4', '-6', '-8' ],
        minimatch: [ '-10', '-8', '-6', '-4', '-2' ],
        equal: true,
        optimized: '-(10|8|6|4|2)'
      },
      {
        fixture: '{-2..-10..1}',
        expected: [ '-10', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9' ],
        actual: [ '-10', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9' ],
        minimatch: [ '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10' ],
        equal: true,
        optimized: '(-[2-9]|-10)'
      },
      {
        fixture: '{-2..-10..2}',
        expected: [ '-10', '-2', '-4', '-6', '-8' ],
        actual: [ '-10', '-2', '-4', '-6', '-8' ],
        minimatch: [ '-2', '-4', '-6', '-8', '-10' ],
        equal: true,
        optimized: '-(2|4|6|8|10)'
      },
      {
        fixture: '{-2..-10..3}',
        expected: [ '-2', '-5', '-8' ],
        actual: [ '-2', '-5', '-8' ],
        minimatch: [ '-2', '-5', '-8' ],
        equal: true,
        optimized: '-(2|5|8)'
      },
      {
        fixture: '{-50..-0..5}',
        expected: [ '-10', '-15', '-20', '-25', '-30', '-35', '-40', '-45', '-5', '-50', '0' ],
        actual: [ '-10', '-15', '-20', '-25', '-30', '-35', '-40', '-45', '-5', '-50', '0' ],
        minimatch: [ '-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0' ],
        equal: true,
        optimized: '(0|-(50|45|40|35|30|25|20|15|10|5))'
      },
      {
        fixture: '{-9..9..3}',
        expected: [ '-3', '-6', '-9', '0', '3', '6', '9' ],
        actual: [ '-3', '-6', '-9', '0', '3', '6', '9' ],
        minimatch: [ '-9', '-6', '-3', '0', '3', '6', '9' ],
        equal: true,
        optimized: '(0|3|6|9|-(9|6|3))'
      },
      {
        fixture: '{10..1..-2}',
        expected: [ '10', '2', '4', '6', '8' ],
        actual: [ '10', '2', '4', '6', '8' ],
        minimatch: [ '10', '8', '6', '4', '2' ],
        equal: true,
        optimized: '(10|8|6|4|2)'
      },
      {
        fixture: '{100..0..-5}',
        expected: [ '0', '10', '100', '15', '20', '25', '30', '35', '40', '45', '5', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95' ],
        actual: [ '0', '10', '100', '15', '20', '25', '30', '35', '40', '45', '5', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95' ],
        minimatch: [ '100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0' ],
        equal: true,
        optimized: '(100|95|90|85|80|75|70|65|60|55|50|45|40|35|30|25|20|15|10|5|0)'
      }
    ]
  },
  'should expand alpha ranges with steps': {
    units: [
      {
        fixture: '{a..e..2}',
        expected: [ 'a', 'c', 'e' ],
        actual: [ 'a', 'c', 'e' ],
        minimatch: [ 'a', 'c', 'e' ],
        equal: true,
        optimized: '(a|c|e)'
      },
      {
        fixture: '{E..A..2}',
        expected: [ 'A', 'C', 'E' ],
        actual: [ 'A', 'C', 'E' ],
        minimatch: [ 'E', 'C', 'A' ],
        equal: true,
        optimized: '(E|C|A)'
      },
      {
        fixture: '{a..z}',
        expected: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
        actual: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
        minimatch: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
        equal: true,
        optimized: '([a-z])'
      },
      {
        fixture: '{a..z..2}',
        expected: [ 'a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y' ],
        actual: [ 'a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y' ],
        minimatch: [ 'a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y' ],
        equal: true,
        optimized: '(a|c|e|g|i|k|m|o|q|s|u|w|y)'
      },
      {
        fixture: '{z..a..-2}',
        expected: [ 'b', 'd', 'f', 'h', 'j', 'l', 'n', 'p', 'r', 't', 'v', 'x', 'z' ],
        actual: [ 'b', 'd', 'f', 'h', 'j', 'l', 'n', 'p', 'r', 't', 'v', 'x', 'z' ],
        minimatch: [ 'z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b' ],
        equal: true,
        optimized: '(z|x|v|t|r|p|n|l|j|h|f|d|b)'
      }
    ]
  },
  'should expand alpha ranges with negative steps': {
    units: [
      {
        fixture: '{z..a..-2}',
        expected: [ 'b', 'd', 'f', 'h', 'j', 'l', 'n', 'p', 'r', 't', 'v', 'x', 'z' ],
        actual: [ 'b', 'd', 'f', 'h', 'j', 'l', 'n', 'p', 'r', 't', 'v', 'x', 'z' ],
        minimatch: [ 'z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b' ],
        equal: true,
        optimized: '(z|x|v|t|r|p|n|l|j|h|f|d|b)'
      }
    ]
  },
  'should not add unwanted zero-padding -- fixed post-bash-4.0': {
    units: [
      {
        fixture: '{10..0..2}',
        expected: [ '0', '10', '2', '4', '6', '8' ],
        actual: [ '0', '10', '2', '4', '6', '8' ],
        minimatch: [ '10', '8', '6', '4', '2', '0' ],
        equal: true,
        optimized: '(10|8|6|4|2|0)'
      },
      {
        fixture: '{10..0..-2}',
        expected: [ '0', '10', '2', '4', '6', '8' ],
        actual: [ '0', '10', '2', '4', '6', '8' ],
        minimatch: [ '10', '8', '6', '4', '2', '0' ],
        equal: true,
        optimized: '(10|8|6|4|2|0)'
      },
      {
        fixture: '{-50..-0..5}',
        expected: [ '-10', '-15', '-20', '-25', '-30', '-35', '-40', '-45', '-5', '-50', '0' ],
        actual: [ '-10', '-15', '-20', '-25', '-30', '-35', '-40', '-45', '-5', '-50', '0' ],
        minimatch: [ '-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0' ],
        equal: true,
        optimized: '(0|-(50|45|40|35|30|25|20|15|10|5))'
      }
    ]
  },
  'should work with dots in file paths': {
    units: [
      {
        fixture: '../{1..3}/../foo',
        expected: [ '../1/../foo', '../2/../foo', '../3/../foo' ],
        actual: [ '../1/../foo', '../2/../foo', '../3/../foo' ],
        minimatch: [ '../1/../foo', '../2/../foo', '../3/../foo' ],
        equal: true,
        optimized: '../([1-3])/../foo'
      },
      {
        fixture: '../{2..10..2}/../foo',
        expected: [ '../10/../foo', '../2/../foo', '../4/../foo', '../6/../foo', '../8/../foo' ],
        actual: [ '../10/../foo', '../2/../foo', '../4/../foo', '../6/../foo', '../8/../foo' ],
        minimatch: [ '../2/../foo', '../4/../foo', '../6/../foo', '../8/../foo', '../10/../foo' ],
        equal: true,
        optimized: '../(2|4|6|8|10)/../foo'
      },
      {
        fixture: '../{1..3}/../{a,b,c}/foo',
        expected: [ '../1/../a/foo', '../1/../b/foo', '../1/../c/foo', '../2/../a/foo', '../2/../b/foo', '../2/../c/foo', '../3/../a/foo', '../3/../b/foo', '../3/../c/foo' ],
        actual: [ '../1/../a/foo', '../1/../b/foo', '../1/../c/foo', '../2/../a/foo', '../2/../b/foo', '../2/../c/foo', '../3/../a/foo', '../3/../b/foo', '../3/../c/foo' ],
        minimatch: [ '../1/../a/foo', '../1/../b/foo', '../1/../c/foo', '../2/../a/foo', '../2/../b/foo', '../2/../c/foo', '../3/../a/foo', '../3/../b/foo', '../3/../c/foo' ],
        equal: true,
        optimized: '../([1-3])/../(a|b|c)/foo'
      },
      {
        fixture: './{a..z..3}/',
        expected: [ './a/', './d/', './g/', './j/', './m/', './p/', './s/', './v/', './y/' ],
        actual: [ './a/', './d/', './g/', './j/', './m/', './p/', './s/', './v/', './y/' ],
        minimatch: [ './a/', './d/', './g/', './j/', './m/', './p/', './s/', './v/', './y/' ],
        equal: true,
        optimized: './(a|d|g|j|m|p|s|v|y)/'
      },
      {
        fixture: './{"x,y"}/{a..z..3}/',
        expected: [ './"x/a/', './"x/d/', './"x/g/', './"x/j/', './"x/m/', './"x/p/', './"x/s/', './"x/v/', './"x/y/', './y"/a/', './y"/d/', './y"/g/', './y"/j/', './y"/m/', './y"/p/', './y"/s/', './y"/v/', './y"/y/' ],
        actual: [ './"x/a/', './"x/d/', './"x/g/', './"x/j/', './"x/m/', './"x/p/', './"x/s/', './"x/v/', './"x/y/', './y"/a/', './y"/d/', './y"/g/', './y"/j/', './y"/m/', './y"/p/', './y"/s/', './y"/v/', './y"/y/' ],
        minimatch: [ './"x/a/', './"x/d/', './"x/g/', './"x/j/', './"x/m/', './"x/p/', './"x/s/', './"x/v/', './"x/y/', './y"/a/', './y"/d/', './y"/g/', './y"/j/', './y"/m/', './y"/p/', './y"/s/', './y"/v/', './y"/y/' ],
        equal: true,
        optimized: './\\{x,y\\}/(a|d|g|j|m|p|s|v|y)/'
      }
    ]
  },
  'should expand a complex combination of ranges and sets': {
    units: [
      {
        fixture: 'a/{x,y}/{1..5}c{d,e}f.{md,txt}',
        expected: [ 'a/x/1cdf.md', 'a/x/1cdf.txt', 'a/x/1cef.md', 'a/x/1cef.txt', 'a/x/2cdf.md', 'a/x/2cdf.txt', 'a/x/2cef.md', 'a/x/2cef.txt', 'a/x/3cdf.md', 'a/x/3cdf.txt', 'a/x/3cef.md', 'a/x/3cef.txt', 'a/x/4cdf.md', 'a/x/4cdf.txt', 'a/x/4cef.md', 'a/x/4cef.txt', 'a/x/5cdf.md', 'a/x/5cdf.txt', 'a/x/5cef.md', 'a/x/5cef.txt', 'a/y/1cdf.md', 'a/y/1cdf.txt', 'a/y/1cef.md', 'a/y/1cef.txt', 'a/y/2cdf.md', 'a/y/2cdf.txt', 'a/y/2cef.md', 'a/y/2cef.txt', 'a/y/3cdf.md', 'a/y/3cdf.txt', 'a/y/3cef.md', 'a/y/3cef.txt', 'a/y/4cdf.md', 'a/y/4cdf.txt', 'a/y/4cef.md', 'a/y/4cef.txt', 'a/y/5cdf.md', 'a/y/5cdf.txt', 'a/y/5cef.md', 'a/y/5cef.txt' ],
        actual: [ 'a/x/1cdf.md', 'a/x/1cdf.txt', 'a/x/1cef.md', 'a/x/1cef.txt', 'a/x/2cdf.md', 'a/x/2cdf.txt', 'a/x/2cef.md', 'a/x/2cef.txt', 'a/x/3cdf.md', 'a/x/3cdf.txt', 'a/x/3cef.md', 'a/x/3cef.txt', 'a/x/4cdf.md', 'a/x/4cdf.txt', 'a/x/4cef.md', 'a/x/4cef.txt', 'a/x/5cdf.md', 'a/x/5cdf.txt', 'a/x/5cef.md', 'a/x/5cef.txt', 'a/y/1cdf.md', 'a/y/1cdf.txt', 'a/y/1cef.md', 'a/y/1cef.txt', 'a/y/2cdf.md', 'a/y/2cdf.txt', 'a/y/2cef.md', 'a/y/2cef.txt', 'a/y/3cdf.md', 'a/y/3cdf.txt', 'a/y/3cef.md', 'a/y/3cef.txt', 'a/y/4cdf.md', 'a/y/4cdf.txt', 'a/y/4cef.md', 'a/y/4cef.txt', 'a/y/5cdf.md', 'a/y/5cdf.txt', 'a/y/5cef.md', 'a/y/5cef.txt' ],
        minimatch: [ 'a/x/1cdf.md', 'a/x/1cdf.txt', 'a/x/1cef.md', 'a/x/1cef.txt', 'a/x/2cdf.md', 'a/x/2cdf.txt', 'a/x/2cef.md', 'a/x/2cef.txt', 'a/x/3cdf.md', 'a/x/3cdf.txt', 'a/x/3cef.md', 'a/x/3cef.txt', 'a/x/4cdf.md', 'a/x/4cdf.txt', 'a/x/4cef.md', 'a/x/4cef.txt', 'a/x/5cdf.md', 'a/x/5cdf.txt', 'a/x/5cef.md', 'a/x/5cef.txt', 'a/y/1cdf.md', 'a/y/1cdf.txt', 'a/y/1cef.md', 'a/y/1cef.txt', 'a/y/2cdf.md', 'a/y/2cdf.txt', 'a/y/2cef.md', 'a/y/2cef.txt', 'a/y/3cdf.md', 'a/y/3cdf.txt', 'a/y/3cef.md', 'a/y/3cef.txt', 'a/y/4cdf.md', 'a/y/4cdf.txt', 'a/y/4cef.md', 'a/y/4cef.txt', 'a/y/5cdf.md', 'a/y/5cdf.txt', 'a/y/5cef.md', 'a/y/5cef.txt' ],
        equal: true,
        optimized: 'a/(x|y)/([1-5])c(d|e)f.(md|txt)'
      }
    ]
  },
  'should expand complex sets and ranges in `bash` mode': {
    units: [
      {
        fixture: 'a/{x,{1..5},y}/c{d}e',
        expected: [ 'a/1/c{d}e', 'a/2/c{d}e', 'a/3/c{d}e', 'a/4/c{d}e', 'a/5/c{d}e', 'a/x/c{d}e', 'a/y/c{d}e' ],
        actual: [ 'a/1/c{d}e', 'a/2/c{d}e', 'a/3/c{d}e', 'a/4/c{d}e', 'a/5/c{d}e', 'a/x/c{d}e', 'a/y/c{d}e' ],
        minimatch: [ 'a/x/c{d}e', 'a/1/c{d}e', 'a/2/c{d}e', 'a/3/c{d}e', 'a/4/c{d}e', 'a/5/c{d}e', 'a/y/c{d}e' ],
        equal: true,
        optimized: 'a/(x|([1-5])|y)/c\\{d\\}e'
      }
    ]
  },
  'should add foo': {
    units: [
      {
        fixture: 'foo',
        minimatch: [ 'foo' ],
        optimized: 'foo'
      },
      {
        fixture: 'bar',
        minimatch: [ 'bar' ],
        optimized: 'bar'
      }
    ]
  }
}
