module.exports = {
  'should handle invalid sets': {
    units: [
      {
        options: {},
        fixture: '{0..10,braces}',
        expanded: {
          actual: [ '0..10', 'braces' ],
          expected: [ '0..10', 'braces' ],
          minimatch: [ '0..10', 'braces' ],
          bash: [ '0..10', 'braces' ]
        },
        optimized: {
          actual: '(0..10|braces)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..10,braces}',
        expanded: {
          actual: [ '1..10', 'braces' ],
          expected: [ '1..10', 'braces' ],
          minimatch: [ '1..10', 'braces' ],
          bash: [ '1..10', 'braces' ]
        },
        optimized: {
          actual: '(1..10|braces)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should not expand escaped braces': {
    units: [
      {
        options: {},
        fixture: '{a,b,c,d,e}',
        expanded: {
          actual: [ 'a', 'b', 'c', 'd', 'e' ],
          expected: [ 'a', 'b', 'c', 'd', 'e' ],
          minimatch: [ 'a', 'b', 'c', 'd', 'e' ],
          bash: [ 'a', 'b', 'c', 'd', 'e' ]
        },
        optimized: {
          actual: '(a|b|c|d|e)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a/b/c/{x,y}',
        expanded: {
          actual: [ 'a/b/c/x', 'a/b/c/y' ],
          expected: [ 'a/b/c/x', 'a/b/c/y' ],
          minimatch: [ 'a/b/c/x', 'a/b/c/y' ],
          bash: [ 'a/b/c/x', 'a/b/c/y' ]
        },
        optimized: {
          actual: 'a/b/c/(x|y)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a/{x,y}/cde',
        expanded: {
          actual: [ 'a/x/cde', 'a/y/cde' ],
          expected: [ 'a/x/cde', 'a/y/cde' ],
          minimatch: [ 'a/x/cde', 'a/y/cde' ],
          bash: [ 'a/x/cde', 'a/y/cde' ]
        },
        optimized: {
          actual: 'a/(x|y)/cde',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'abcd{efgh',
        expanded: {
          actual: [ 'abcd{efgh' ],
          expected: [ 'abcd{efgh' ],
          minimatch: [ 'abcd{efgh' ],
          bash: [ 'abcd{efgh' ]
        },
        optimized: {
          actual: 'abcd{efgh',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{abc}',
        expanded: {
          actual: [ '{abc}' ],
          expected: [ '{abc}' ],
          minimatch: [ '{abc}' ],
          bash: [ '{abc}' ]
        },
        optimized: {
          actual: '{abc}',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{x,y,{a,b,c}}',
        expanded: {
          actual: [ 'x', 'y', 'a', 'b', 'c' ],
          expected: [ 'x', 'y', 'a', 'b', 'c' ],
          minimatch: [ 'x', 'y', 'a', 'b', 'c' ],
          bash: [ 'x', 'y', 'a', 'b', 'c' ]
        },
        optimized: {
          actual: '(x|y|(a|b|c))',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{x,y,{a,b,c}}',
        expanded: {
          actual: [ 'x', 'y', 'a', 'b', 'c' ],
          expected: [ 'x', 'y', 'a', 'b', 'c' ],
          minimatch: [ 'x', 'y', 'a', 'b', 'c' ],
          bash: [ 'x', 'y', 'a', 'b', 'c' ]
        },
        optimized: {
          actual: '(x|y|(a|b|c))',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{x,y,{abc},trie}',
        expanded: {
          actual: [ 'x', 'y', '{abc}', 'trie' ],
          expected: [ 'x', 'y', '{abc}', 'trie' ],
          minimatch: [ 'x', 'y', '{abc}', 'trie' ],
          bash: [ 'x', 'y', '{abc}', 'trie' ]
        },
        optimized: {
          actual: '(x|y|{abc}|trie)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{x,y,{abc},trie}',
        expanded: {
          actual: [ 'x', 'y', '{abc}', 'trie' ],
          expected: [ 'x', 'y', '{abc}', 'trie' ],
          minimatch: [ 'x', 'y', '{abc}', 'trie' ],
          bash: [ 'x', 'y', '{abc}', 'trie' ]
        },
        optimized: {
          actual: '(x|y|{abc}|trie)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should handle spaces': {
    units: [
      {
        options: {},
        fixture: 'foo {1,2} bar',
        expanded: {
          actual: [ 'foo 1 bar', 'foo 2 bar' ],
          expected: [ 'foo 1 bar', 'foo 2 bar' ],
          minimatch: [ 'foo 1 bar', 'foo 2 bar' ],
          bash: [ 'foo 1 bar', 'foo 2 bar' ]
        },
        optimized: {
          actual: 'foo (1|2) bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '0{1..9} {10..20}',
        expanded: {
          actual: [ '01 10', '01 11', '01 12', '01 13', '01 14', '01 15', '01 16', '01 17', '01 18', '01 19', '01 20', '02 10', '02 11', '02 12', '02 13', '02 14', '02 15', '02 16', '02 17', '02 18', '02 19', '02 20', '03 10', '03 11', '03 12', '03 13', '03 14', '03 15', '03 16', '03 17', '03 18', '03 19', '03 20', '04 10', '04 11', '04 12', '04 13', '04 14', '04 15', '04 16', '04 17', '04 18', '04 19', '04 20', '05 10', '05 11', '05 12', '05 13', '05 14', '05 15', '05 16', '05 17', '05 18', '05 19', '05 20', '06 10', '06 11', '06 12', '06 13', '06 14', '06 15', '06 16', '06 17', '06 18', '06 19', '06 20', '07 10', '07 11', '07 12', '07 13', '07 14', '07 15', '07 16', '07 17', '07 18', '07 19', '07 20', '08 10', '08 11', '08 12', '08 13', '08 14', '08 15', '08 16', '08 17', '08 18', '08 19', '08 20', '09 10', '09 11', '09 12', '09 13', '09 14', '09 15', '09 16', '09 17', '09 18', '09 19', '09 20' ],
          expected: [ '01 10', '01 11', '01 12', '01 13', '01 14', '01 15', '01 16', '01 17', '01 18', '01 19', '01 20', '02 10', '02 11', '02 12', '02 13', '02 14', '02 15', '02 16', '02 17', '02 18', '02 19', '02 20', '03 10', '03 11', '03 12', '03 13', '03 14', '03 15', '03 16', '03 17', '03 18', '03 19', '03 20', '04 10', '04 11', '04 12', '04 13', '04 14', '04 15', '04 16', '04 17', '04 18', '04 19', '04 20', '05 10', '05 11', '05 12', '05 13', '05 14', '05 15', '05 16', '05 17', '05 18', '05 19', '05 20', '06 10', '06 11', '06 12', '06 13', '06 14', '06 15', '06 16', '06 17', '06 18', '06 19', '06 20', '07 10', '07 11', '07 12', '07 13', '07 14', '07 15', '07 16', '07 17', '07 18', '07 19', '07 20', '08 10', '08 11', '08 12', '08 13', '08 14', '08 15', '08 16', '08 17', '08 18', '08 19', '08 20', '09 10', '09 11', '09 12', '09 13', '09 14', '09 15', '09 16', '09 17', '09 18', '09 19', '09 20' ],
          minimatch: [ '01 10', '01 11', '01 12', '01 13', '01 14', '01 15', '01 16', '01 17', '01 18', '01 19', '01 20', '02 10', '02 11', '02 12', '02 13', '02 14', '02 15', '02 16', '02 17', '02 18', '02 19', '02 20', '03 10', '03 11', '03 12', '03 13', '03 14', '03 15', '03 16', '03 17', '03 18', '03 19', '03 20', '04 10', '04 11', '04 12', '04 13', '04 14', '04 15', '04 16', '04 17', '04 18', '04 19', '04 20', '05 10', '05 11', '05 12', '05 13', '05 14', '05 15', '05 16', '05 17', '05 18', '05 19', '05 20', '06 10', '06 11', '06 12', '06 13', '06 14', '06 15', '06 16', '06 17', '06 18', '06 19', '06 20', '07 10', '07 11', '07 12', '07 13', '07 14', '07 15', '07 16', '07 17', '07 18', '07 19', '07 20', '08 10', '08 11', '08 12', '08 13', '08 14', '08 15', '08 16', '08 17', '08 18', '08 19', '08 20', '09 10', '09 11', '09 12', '09 13', '09 14', '09 15', '09 16', '09 17', '09 18', '09 19', '09 20' ],
          bash: [ '01 10', '01 11', '01 12', '01 13', '01 14', '01 15', '01 16', '01 17', '01 18', '01 19', '01 20', '02 10', '02 11', '02 12', '02 13', '02 14', '02 15', '02 16', '02 17', '02 18', '02 19', '02 20', '03 10', '03 11', '03 12', '03 13', '03 14', '03 15', '03 16', '03 17', '03 18', '03 19', '03 20', '04 10', '04 11', '04 12', '04 13', '04 14', '04 15', '04 16', '04 17', '04 18', '04 19', '04 20', '05 10', '05 11', '05 12', '05 13', '05 14', '05 15', '05 16', '05 17', '05 18', '05 19', '05 20', '06 10', '06 11', '06 12', '06 13', '06 14', '06 15', '06 16', '06 17', '06 18', '06 19', '06 20', '07 10', '07 11', '07 12', '07 13', '07 14', '07 15', '07 16', '07 17', '07 18', '07 19', '07 20', '08 10', '08 11', '08 12', '08 13', '08 14', '08 15', '08 16', '08 17', '08 18', '08 19', '08 20', '09 10', '09 11', '09 12', '09 13', '09 14', '09 15', '09 16', '09 17', '09 18', '09 19', '09 20' ]
        },
        optimized: {
          actual: '0([1-9]) (1[0-9]|20)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a{ ,c{d, },h}x',
        expanded: {
          actual: [ 'a x', 'acdx', 'ac x', 'ahx' ],
          expected: [ 'a x', 'acdx', 'ac x', 'ahx' ],
          minimatch: [ 'a x', 'acdx', 'ac x', 'ahx' ],
          bash: [ 'a x', 'acdx', 'ac x', 'ahx' ]
        },
        optimized: {
          actual: 'a( |c(d| )|h)x',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a{ ,c{d, },h} ',
        expanded: {
          actual: [ 'a ', 'acd ', 'ac ', 'ah ' ],
          expected: [ 'a ', 'acd ', 'ac ', 'ah ' ],
          minimatch: [ 'a ', 'acd ', 'ac ', 'ah ' ],
          bash: [ 'a ', 'acd ', 'ac ', 'ah ' ]
        },
        optimized: {
          actual: 'a( |c(d| )|h) ',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.{html,ejs}',
        expanded: {
          actual: [
            '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.html',
            '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.ejs'
          ],
          expected: [],
          minimatch: [
            '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.html',
            '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.ejs'
          ],
          bash: []
        },
        optimized: {
          actual: '/Users/tobiasreich/Sites/aaa/bbb/ccc 2016/src/**/[^_]*.(html|ejs)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      }
    ]
  },
  'should handle empty braces': {
    units: [
      {
        options: {},
        fixture: '{ }',
        expanded: {
          actual: [ '{ }' ],
          expected: [ '{ }' ],
          minimatch: [ '{ }' ],
          bash: [ '{ }' ]
        },
        optimized: {
          actual: '{ }',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{',
        expanded: {
          actual: [ '{' ],
          expected: [ '{' ],
          minimatch: [ '{' ],
          bash: [ '{' ]
        },
        optimized: {
          actual: '{',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{}',
        expanded: {
          actual: [ '{}' ],
          expected: [ '{}' ],
          minimatch: [ '{}' ],
          bash: [ '{}' ]
        },
        optimized: {
          actual: '{}',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '}',
        expanded: {
          actual: [ '}' ],
          expected: [ '}' ],
          minimatch: [ '}' ],
          bash: [ '}' ]
        },
        optimized: {
          actual: '}',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should escape braces when only one value is defined': {
    units: [
      {
        options: {},
        fixture: 'a{b}c',
        expanded: {
          actual: [ 'a{b}c' ],
          expected: [ 'a{b}c' ],
          minimatch: [ 'a{b}c' ],
          bash: [ 'a{b}c' ]
        },
        optimized: {
          actual: 'a{b}c',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a/b/c{d}e',
        expanded: {
          actual: [ 'a/b/c{d}e' ],
          expected: [ 'a/b/c{d}e' ],
          minimatch: [ 'a/b/c{d}e' ],
          bash: [ 'a/b/c{d}e' ]
        },
        optimized: {
          actual: 'a/b/c{d}e',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should not expand braces in sets with es6/bash-like variables': {
    units: [
      {
        options: {},
        fixture: 'abc/${ddd}/xyz',
        expanded: {
          actual: [ 'abc/${ddd}/xyz' ],
          expected: [ 'abc/${ddd}/xyz' ],
          minimatch: [ 'abc/${ddd}/xyz' ],
          bash: [ 'abc/${ddd}/xyz' ]
        },
        optimized: {
          actual: 'abc/${ddd}/xyz',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a${b}c',
        expanded: {
          actual: [ 'a${b}c' ],
          expected: [ 'a${b}c' ],
          minimatch: [ 'a${b}c' ],
          bash: [ 'a${b}c' ]
        },
        optimized: {
          actual: 'a${b}c',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a/{${b},c}/d',
        expanded: {
          actual: [ 'a/${b}/d', 'a/c/d' ],
          expected: [ 'a/${b}/d', 'a/c/d' ],
          minimatch: [ 'a/${b}/d', 'a/c/d' ],
          bash: [ 'a/${b}/d', 'a/c/d' ]
        },
        optimized: {
          actual: 'a/(${b}|c)/d',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a${b,d}/{foo,bar}c',
        expanded: {
          actual: [ 'a${b,d}/fooc', 'a${b,d}/barc' ],
          expected: [ 'a${b,d}/fooc', 'a${b,d}/barc' ],
          minimatch: [ 'a${b,d}/{foo,bar}c' ],
          bash: [ 'a${b,d}/fooc', 'a${b,d}/barc' ]
        },
        optimized: {
          actual: 'a${b,d}/(foo|bar)c',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: false,
          minimatch_to_bash: false
        }
      }
    ]
  },
  'should not expand escaped commas.': {
    units: [
      {
        options: {},
        fixture: 'a{b,c,d}e',
        expanded: {
          actual: [ 'abe', 'ace', 'ade' ],
          expected: [ 'abe', 'ace', 'ade' ],
          minimatch: [ 'abe', 'ace', 'ade' ],
          bash: [ 'abe', 'ace', 'ade' ]
        },
        optimized: {
          actual: 'a(b|c|d)e',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a{b,c}d',
        expanded: {
          actual: [ 'abd', 'acd' ],
          expected: [ 'abd', 'acd' ],
          minimatch: [ 'abd', 'acd' ],
          bash: [ 'abd', 'acd' ]
        },
        optimized: {
          actual: 'a(b|c)d',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{abc,def}',
        expanded: {
          actual: [ 'abc', 'def' ],
          expected: [ 'abc', 'def' ],
          minimatch: [ 'abc', 'def' ],
          bash: [ 'abc', 'def' ]
        },
        optimized: {
          actual: '(abc|def)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{abc,def,ghi}',
        expanded: {
          actual: [ 'abc', 'def', 'ghi' ],
          expected: [ 'abc', 'def', 'ghi' ],
          minimatch: [ 'abc', 'def', 'ghi' ],
          bash: [ 'abc', 'def', 'ghi' ]
        },
        optimized: {
          actual: '(abc|def|ghi)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a/{b,c}/{x,y}/d/e',
        expanded: {
          actual: [ 'a/b/x/d/e', 'a/b/y/d/e', 'a/c/x/d/e', 'a/c/y/d/e' ],
          expected: [ 'a/b/x/d/e', 'a/b/y/d/e', 'a/c/x/d/e', 'a/c/y/d/e' ],
          minimatch: [ 'a/b/x/d/e', 'a/b/y/d/e', 'a/c/x/d/e', 'a/c/y/d/e' ],
          bash: [ 'a/b/x/d/e', 'a/b/y/d/e', 'a/c/x/d/e', 'a/c/y/d/e' ]
        },
        optimized: {
          actual: 'a/(b|c)/(x|y)/d/e',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should return sets with escaped commas': {
    units: []
  },
  'should not expand escaped braces.': {
    units: [
      {
        options: {},
        fixture: '{a,b}c,d}',
        expanded: {
          actual: [ 'ac,d', 'bc,d' ],
          expected: [ 'ac,d}', 'bc,d}' ],
          minimatch: [ 'ac,d}', 'bc,d}' ],
          bash: [ 'ac,d}', 'bc,d}' ]
        },
        optimized: {
          actual: '(a|b)c,d}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{a,b,c,d,e}',
        expanded: {
          actual: [ 'a', 'b', 'c', 'd', 'e' ],
          expected: [ 'a', 'b', 'c', 'd', 'e' ],
          minimatch: [ 'a', 'b', 'c', 'd', 'e' ],
          bash: [ 'a', 'b', 'c', 'd', 'e' ]
        },
        optimized: {
          actual: '(a|b|c|d|e)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a/{z,{a,b,c,d,e}/d',
        expanded: {
          actual: [ 'a/z', 'a/a/d', 'a/b/d', 'a/c/d', 'a/d/d', 'a/e/d' ],
          expected: [ 'a/{z,a/d', 'a/{z,b/d', 'a/{z,c/d', 'a/{z,d/d', 'a/{z,e/d' ],
          minimatch: [ 'a/{z,a/d', 'a/{z,b/d', 'a/{z,c/d', 'a/{z,d/d', 'a/{z,e/d' ],
          bash: [ 'a/{z,a/d', 'a/{z,b/d', 'a/{z,c/d', 'a/{z,d/d', 'a/{z,e/d' ]
        },
        optimized: {
          actual: 'a/{z,(a|b|c|d|e)/d}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a/{b,c}/{d,e}/f',
        expanded: {
          actual: [ 'a/b/d/f', 'a/b/e/f', 'a/c/d/f', 'a/c/e/f' ],
          expected: [ 'a/b/d/f', 'a/b/e/f', 'a/c/d/f', 'a/c/e/f' ],
          minimatch: [ 'a/b/d/f', 'a/b/e/f', 'a/c/d/f', 'a/c/e/f' ],
          bash: [ 'a/b/d/f', 'a/b/e/f', 'a/c/d/f', 'a/c/e/f' ]
        },
        optimized: {
          actual: 'a/(b|c)/(d|e)/f',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: './{x,y}/{a..z..3}/',
        expanded: {
          actual: [ './x/a/', './x/d/', './x/g/', './x/j/', './x/m/', './x/p/', './x/s/', './x/v/', './x/y/', './y/a/', './y/d/', './y/g/', './y/j/', './y/m/', './y/p/', './y/s/', './y/v/', './y/y/' ],
          expected: [ './x/{a..z..3}/', './y/{a..z..3}/' ],
          minimatch: [ './x/a/', './x/d/', './x/g/', './x/j/', './x/m/', './x/p/', './x/s/', './x/v/', './x/y/', './y/a/', './y/d/', './y/g/', './y/j/', './y/m/', './y/p/', './y/s/', './y/v/', './y/y/' ],
          bash: [ './x/{a..z..3}/', './y/{a..z..3}/' ]
        },
        optimized: {
          actual: './(x|y)/(a|d|g|j|m|p|s|v|y)/',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      }
    ]
  },
  'should not expand escaped braces or commas.': {
    units: [
      {
        options: {},
        fixture: '{x,y,{abc},trie}',
        expanded: {
          actual: [ 'x', 'y', '{abc}', 'trie' ],
          expected: [ 'x', 'y', '{abc}', 'trie' ],
          minimatch: [ 'x', 'y', '{abc}', 'trie' ],
          bash: [ 'x', 'y', '{abc}', 'trie' ]
        },
        optimized: {
          actual: '(x|y|{abc}|trie)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should support sequence brace operators': {
    units: [
      {
        options: {},
        fixture: '/usr/{ucb/{ex,edit},lib/{ex,how_ex}}',
        expanded: {
          actual: [ '/usr/ucb/ex', '/usr/ucb/edit', '/usr/lib/ex', '/usr/lib/how_ex' ],
          expected: [ '/usr/ucb/ex', '/usr/ucb/edit', '/usr/lib/ex', '/usr/lib/how_ex' ],
          minimatch: [ '/usr/ucb/ex', '/usr/ucb/edit', '/usr/lib/ex', '/usr/lib/how_ex' ],
          bash: [ '/usr/ucb/ex', '/usr/ucb/edit', '/usr/lib/ex', '/usr/lib/how_ex' ]
        },
        optimized: {
          actual: '/usr/(ucb/(ex|edit)|lib/(ex|how_ex))',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'ff{c,b,a}',
        expanded: {
          actual: [ 'ffc', 'ffb', 'ffa' ],
          expected: [ 'ffc', 'ffb', 'ffa' ],
          minimatch: [ 'ffc', 'ffb', 'ffa' ],
          bash: [ 'ffc', 'ffb', 'ffa' ]
        },
        optimized: {
          actual: 'ff(c|b|a)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'f{d,e,f}g',
        expanded: {
          actual: [ 'fdg', 'feg', 'ffg' ],
          expected: [ 'fdg', 'feg', 'ffg' ],
          minimatch: [ 'fdg', 'feg', 'ffg' ],
          bash: [ 'fdg', 'feg', 'ffg' ]
        },
        optimized: {
          actual: 'f(d|e|f)g',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'x{{0..10},braces}y',
        expanded: {
          actual: [ 'x0y', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'x10y', 'xbracesy' ],
          expected: [ 'x0y', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'x10y', 'xbracesy' ],
          minimatch: [ 'x0y', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'x10y', 'xbracesy' ],
          bash: [ 'x0y', 'x1y', 'x2y', 'x3y', 'x4y', 'x5y', 'x6y', 'x7y', 'x8y', 'x9y', 'x10y', 'xbracesy' ]
        },
        optimized: {
          actual: 'x(([0-9]|10)|braces)y',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..10}',
        expanded: {
          actual: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          expected: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          minimatch: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          bash: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ]
        },
        optimized: {
          actual: '([1-9]|10)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{a,b,c}',
        expanded: {
          actual: [ 'a', 'b', 'c' ],
          expected: [ 'a', 'b', 'c' ],
          minimatch: [ 'a', 'b', 'c' ],
          bash: [ 'a', 'b', 'c' ]
        },
        optimized: {
          actual: '(a|b|c)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{braces,{0..10}}',
        expanded: {
          actual: [ 'braces', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          expected: [ 'braces', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          minimatch: [ 'braces', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          bash: [ 'braces', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ]
        },
        optimized: {
          actual: '(braces|([0-9]|10))',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{l,n,m}xyz',
        expanded: {
          actual: [ 'lxyz', 'nxyz', 'mxyz' ],
          expected: [ 'lxyz', 'nxyz', 'mxyz' ],
          minimatch: [ 'lxyz', 'nxyz', 'mxyz' ],
          bash: [ 'lxyz', 'nxyz', 'mxyz' ]
        },
        optimized: {
          actual: '(l|n|m)xyz',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{{0..10},braces}',
        expanded: {
          actual: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces' ],
          expected: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces' ],
          minimatch: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces' ],
          bash: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces' ]
        },
        optimized: {
          actual: '(([0-9]|10)|braces)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{{1..10..2},braces}',
        expanded: {
          actual: [ '1', '3', '5', '7', '9', 'braces' ],
          expected: [ '{1..10..2}', 'braces' ],
          minimatch: [ '1', '3', '5', '7', '9', 'braces' ],
          bash: [ '{1..10..2}', 'braces' ]
        },
        optimized: {
          actual: '((1|3|5|7|9)|braces)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{{1..10},braces}',
        expanded: {
          actual: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces' ],
          expected: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces' ],
          minimatch: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces' ],
          bash: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'braces' ]
        },
        optimized: {
          actual: '(([1-9]|10)|braces)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should expand multiple sets': {
    units: [
      {
        options: {},
        fixture: 'a/{a,b}/{c,d}/e',
        expanded: {
          actual: [ 'a/a/c/e', 'a/a/d/e', 'a/b/c/e', 'a/b/d/e' ],
          expected: [ 'a/a/c/e', 'a/a/d/e', 'a/b/c/e', 'a/b/d/e' ],
          minimatch: [ 'a/a/c/e', 'a/a/d/e', 'a/b/c/e', 'a/b/d/e' ],
          bash: [ 'a/a/c/e', 'a/a/d/e', 'a/b/c/e', 'a/b/d/e' ]
        },
        optimized: {
          actual: 'a/(a|b)/(c|d)/e',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a{b,c}d{e,f}g',
        expanded: {
          actual: [ 'abdeg', 'abdfg', 'acdeg', 'acdfg' ],
          expected: [ 'abdeg', 'abdfg', 'acdeg', 'acdfg' ],
          minimatch: [ 'abdeg', 'abdfg', 'acdeg', 'acdfg' ],
          bash: [ 'abdeg', 'abdfg', 'acdeg', 'acdfg' ]
        },
        optimized: {
          actual: 'a(b|c)d(e|f)g',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a/{x,y}/c{d,e}f.{md,txt}',
        expanded: {
          actual: [ 'a/x/cdf.md', 'a/x/cdf.txt', 'a/x/cef.md', 'a/x/cef.txt', 'a/y/cdf.md', 'a/y/cdf.txt', 'a/y/cef.md', 'a/y/cef.txt' ],
          expected: [ 'a/x/cdf.md', 'a/x/cdf.txt', 'a/x/cef.md', 'a/x/cef.txt', 'a/y/cdf.md', 'a/y/cdf.txt', 'a/y/cef.md', 'a/y/cef.txt' ],
          minimatch: [ 'a/x/cdf.md', 'a/x/cdf.txt', 'a/x/cef.md', 'a/x/cef.txt', 'a/y/cdf.md', 'a/y/cdf.txt', 'a/y/cef.md', 'a/y/cef.txt' ],
          bash: [ 'a/x/cdf.md', 'a/x/cdf.txt', 'a/x/cef.md', 'a/x/cef.txt', 'a/y/cdf.md', 'a/y/cdf.txt', 'a/y/cef.md', 'a/y/cef.txt' ]
        },
        optimized: {
          actual: 'a/(x|y)/c(d|e)f.(md|txt)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should expand nested sets': {
    units: [
      {
        options: {},
        fixture: '{a,b}{{a,b},a,b}',
        expanded: {
          actual: [ 'aa', 'ab', 'aa', 'ab', 'ba', 'bb', 'ba', 'bb' ],
          expected: [ 'aa', 'ab', 'aa', 'ab', 'ba', 'bb', 'ba', 'bb' ],
          minimatch: [ 'aa', 'ab', 'aa', 'ab', 'ba', 'bb', 'ba', 'bb' ],
          bash: [ 'aa', 'ab', 'aa', 'ab', 'ba', 'bb', 'ba', 'bb' ]
        },
        optimized: {
          actual: '(a|b)((a|b)|a|b)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '/usr/{ucb/{ex,edit},lib/{ex,how_ex}}',
        expanded: {
          actual: [ '/usr/ucb/ex', '/usr/ucb/edit', '/usr/lib/ex', '/usr/lib/how_ex' ],
          expected: [ '/usr/ucb/ex', '/usr/ucb/edit', '/usr/lib/ex', '/usr/lib/how_ex' ],
          minimatch: [ '/usr/ucb/ex', '/usr/ucb/edit', '/usr/lib/ex', '/usr/lib/how_ex' ],
          bash: [ '/usr/ucb/ex', '/usr/ucb/edit', '/usr/lib/ex', '/usr/lib/how_ex' ]
        },
        optimized: {
          actual: '/usr/(ucb/(ex|edit)|lib/(ex|how_ex))',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a{b,c{d,e}f}g',
        expanded: {
          actual: [ 'abg', 'acdfg', 'acefg' ],
          expected: [ 'abg', 'acdfg', 'acefg' ],
          minimatch: [ 'abg', 'acdfg', 'acefg' ],
          bash: [ 'abg', 'acdfg', 'acefg' ]
        },
        optimized: {
          actual: 'a(b|c(d|e)f)g',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a{{x,y},z}b',
        expanded: {
          actual: [ 'axb', 'ayb', 'azb' ],
          expected: [ 'axb', 'ayb', 'azb' ],
          minimatch: [ 'axb', 'ayb', 'azb' ],
          bash: [ 'axb', 'ayb', 'azb' ]
        },
        optimized: {
          actual: 'a((x|y)|z)b',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'f{x,y{g,z}}h',
        expanded: {
          actual: [ 'fxh', 'fygh', 'fyzh' ],
          expected: [ 'fxh', 'fygh', 'fyzh' ],
          minimatch: [ 'fxh', 'fygh', 'fyzh' ],
          bash: [ 'fxh', 'fygh', 'fyzh' ]
        },
        optimized: {
          actual: 'f(x|y(g|z))h',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a{b,c{d,e},h}x/z',
        expanded: {
          actual: [ 'abx/z', 'acdx/z', 'acex/z', 'ahx/z' ],
          expected: [ 'abx/z', 'acdx/z', 'acex/z', 'ahx/z' ],
          minimatch: [ 'abx/z', 'acdx/z', 'acex/z', 'ahx/z' ],
          bash: [ 'abx/z', 'acdx/z', 'acex/z', 'ahx/z' ]
        },
        optimized: {
          actual: 'a(b|c(d|e)|h)x/z',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a{b,c{d,e},h}x{y,z}',
        expanded: {
          actual: [ 'abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'ahxy', 'ahxz' ],
          expected: [ 'abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'ahxy', 'ahxz' ],
          minimatch: [ 'abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'ahxy', 'ahxz' ],
          bash: [ 'abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'ahxy', 'ahxz' ]
        },
        optimized: {
          actual: 'a(b|c(d|e)|h)x(y|z)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a{b,c{d,e},{f,g}h}x{y,z}',
        expanded: {
          actual: [ 'abxy', 'abxz', 'acd,fhxy', 'acd,fhxz', 'acd,ghxy', 'acd,ghxz', 'ace,fhxy', 'ace,fhxz', 'ace,ghxy', 'ace,ghxz' ],
          expected: [ 'abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'afhxy', 'afhxz', 'aghxy', 'aghxz' ],
          minimatch: [ 'abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'afhxy', 'afhxz', 'aghxy', 'aghxz' ],
          bash: [ 'abxy', 'abxz', 'acdxy', 'acdxz', 'acexy', 'acexz', 'afhxy', 'afhxz', 'aghxy', 'aghxz' ]
        },
        optimized: {
          actual: 'a(b|c(d|e)|(f|g)h)x(y|z)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a-{b{d,e}}-c',
        expanded: {
          actual: [ 'a-bd-c', 'a-be-c' ],
          expected: [ 'a-{bd}-c', 'a-{be}-c' ],
          minimatch: [ 'a-{bd}-c', 'a-{be}-c' ],
          bash: [ 'a-{bd}-c', 'a-{be}-c' ]
        },
        optimized: {
          actual: 'a-{b(d|e)}-c',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should expand with globs.': {
    units: [
      {
        options: {},
        fixture: 'a/b/{d,e}/*.js',
        expanded: {
          actual: [ 'a/b/d/*.js', 'a/b/e/*.js' ],
          expected: [],
          minimatch: [ 'a/b/d/*.js', 'a/b/e/*.js' ],
          bash: []
        },
        optimized: {
          actual: 'a/b/(d|e)/*.js',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: 'a/**/c/{d,e}/f*.js',
        expanded: {
          actual: [ 'a/**/c/d/f*.js', 'a/**/c/e/f*.js' ],
          expected: [],
          minimatch: [ 'a/**/c/d/f*.js', 'a/**/c/e/f*.js' ],
          bash: []
        },
        optimized: {
          actual: 'a/**/c/(d|e)/f*.js',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: 'a/**/c/{d,e}/f*.{md,txt}',
        expanded: {
          actual: [ 'a/**/c/d/f*.md', 'a/**/c/d/f*.txt', 'a/**/c/e/f*.md', 'a/**/c/e/f*.txt' ],
          expected: [],
          minimatch: [ 'a/**/c/d/f*.md', 'a/**/c/d/f*.txt', 'a/**/c/e/f*.md', 'a/**/c/e/f*.txt' ],
          bash: []
        },
        optimized: {
          actual: 'a/**/c/(d|e)/f*.(md|txt)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      }
    ]
  },
  'should expand with extglobs (TODO)': {
    units: [
      {
        options: {},
        fixture: 'a/b/{d,e,[1-5]}/*.js',
        expanded: {
          actual: [ 'a/b/d/*.js', 'a/b/e/*.js',
            'a/b/[1-5]/*.js'
          ],
          expected: [],
          minimatch: [ 'a/b/d/*.js', 'a/b/e/*.js',
            'a/b/[1-5]/*.js'
          ],
          bash: []
        },
        optimized: {
          actual: 'a/b/(d|e|[1-5])/*.js',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      }
    ]
  },
  'should work with leading and trailing commas.': {
    units: [
      {
        options: {},
        fixture: 'a{b,}c',
        expanded: {
          actual: [ 'abc', 'ac' ],
          expected: [ 'abc', 'ac' ],
          minimatch: [ 'abc', 'ac' ],
          bash: [ 'abc', 'ac' ]
        },
        optimized: {
          actual: 'a(b|)c',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a{,b}c',
        expanded: {
          actual: [ 'ac', 'abc' ],
          expected: [ 'ac', 'abc' ],
          minimatch: [ 'ac', 'abc' ],
          bash: [ 'ac', 'abc' ]
        },
        optimized: {
          actual: 'a(|b)c',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should not try to expand ranges with decimals': {
    units: [
      {
        options: {},
        fixture: '{1.1..2.1}',
        expanded: {
          actual: [],
          expected: [ '{1.1..2.1}' ],
          minimatch: [ '{1.1..2.1}' ],
          bash: [ '{1.1..2.1}' ]
        },
        optimized: {
          actual: '{1.1..2.1}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1.1..~2.1}',
        expanded: {
          actual: [],
          expected: [ '{1.1..~2.1}' ],
          minimatch: [ '{1.1..~2.1}' ],
          bash: [ '{1.1..~2.1}' ]
        },
        optimized: {
          actual: '{1.1..~2.1}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should escape invalid ranges': {
    units: [
      {
        options: {},
        fixture: '{1..0f}',
        expanded: {
          actual: [],
          expected: [ '{1..0f}' ],
          minimatch: [ '{1..0f}' ],
          bash: [ '{1..0f}' ]
        },
        optimized: {
          actual: '{1..0f}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..10..ff}',
        expanded: {
          actual: [],
          expected: [ '{1..10..ff}' ],
          minimatch: [ '{1..10..ff}' ],
          bash: [ '{1..10..ff}' ]
        },
        optimized: {
          actual: '{1..10..ff}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..10.f}',
        expanded: {
          actual: [],
          expected: [ '{1..10.f}' ],
          minimatch: [ '{1..10.f}' ],
          bash: [ '{1..10.f}' ]
        },
        optimized: {
          actual: '{1..10.f}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..10f}',
        expanded: {
          actual: [],
          expected: [ '{1..10f}' ],
          minimatch: [ '{1..10f}' ],
          bash: [ '{1..10f}' ]
        },
        optimized: {
          actual: '{1..10f}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..20..2f}',
        expanded: {
          actual: [],
          expected: [ '{1..20..2f}' ],
          minimatch: [ '{1..20..2f}' ],
          bash: [ '{1..20..2f}' ]
        },
        optimized: {
          actual: '{1..20..2f}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..20..f2}',
        expanded: {
          actual: [],
          expected: [ '{1..20..f2}' ],
          minimatch: [ '{1..20..f2}' ],
          bash: [ '{1..20..f2}' ]
        },
        optimized: {
          actual: '{1..20..f2}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..2f..2}',
        expanded: {
          actual: [],
          expected: [ '{1..2f..2}' ],
          minimatch: [ '{1..2f..2}' ],
          bash: [ '{1..2f..2}' ]
        },
        optimized: {
          actual: '{1..2f..2}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..ff..2}',
        expanded: {
          actual: [],
          expected: [ '{1..ff..2}' ],
          minimatch: [ '{1..ff..2}' ],
          bash: [ '{1..ff..2}' ]
        },
        optimized: {
          actual: '{1..ff..2}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..ff}',
        expanded: {
          actual: [],
          expected: [ '{1..ff}' ],
          minimatch: [ '{1..ff}' ],
          bash: [ '{1..ff}' ]
        },
        optimized: {
          actual: '{1..ff}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..f}',
        expanded: {
          actual: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[',
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
          expected: [ '{1..f}' ],
          minimatch: [ '{1..f}' ],
          bash: [ '{1..f}' ]
        },
        optimized: {
          actual: '([1-f])',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1.20..2}',
        expanded: {
          actual: [],
          expected: [ '{1.20..2}' ],
          minimatch: [ '{1.20..2}' ],
          bash: [ '{1.20..2}' ]
        },
        optimized: {
          actual: '{1.20..2}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should handle weirdly-formed brace expansions -- fixed in post-bash-3.1': {
    units: [
      {
        options: {},
        fixture: 'a-{b{d,e}}-c',
        expanded: {
          actual: [ 'a-bd-c', 'a-be-c' ],
          expected: [ 'a-{bd}-c', 'a-{be}-c' ],
          minimatch: [ 'a-{bd}-c', 'a-{be}-c' ],
          bash: [ 'a-{bd}-c', 'a-{be}-c' ]
        },
        optimized: {
          actual: 'a-{b(d|e)}-c',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a-{bdef-{g,i}-c',
        expanded: {
          actual: [ 'a-bdef-g-c', 'a-bdef-i-c' ],
          expected: [ 'a-{bdef-g-c', 'a-{bdef-i-c' ],
          minimatch: [ 'a-{bdef-g-c', 'a-{bdef-i-c' ],
          bash: [ 'a-{bdef-g-c', 'a-{bdef-i-c' ]
        },
        optimized: {
          actual: 'a-{bdef-(g|i)-c}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should not expand quoted strings.': {
    units: [
      {
        options: {},
        fixture: '{"klklkl"}{1,2,3}',
        expanded: {
          actual: [ '{"klklkl"}1', '{"klklkl"}2', '{"klklkl"}3' ],
          expected: [ '{klklkl}1', '{klklkl}2', '{klklkl}3' ],
          minimatch: [ '{"klklkl"}1', '{"klklkl"}2', '{"klklkl"}3' ],
          bash: [ '{klklkl}1', '{klklkl}2', '{klklkl}3' ]
        },
        optimized: {
          actual: '{"klklkl"}(1|2|3)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{"x,x"}',
        expanded: {
          actual: [ '"x', 'x"' ],
          expected: [ '{x,x}' ],
          minimatch: [ '"x', 'x"' ],
          bash: [ '{x,x}' ]
        },
        optimized: {
          actual: '{x,x}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      }
    ]
  },
  'should escaped outer braces in nested non-sets': {
    units: [
      {
        options: {},
        fixture: '{a-{b,c,d}}',
        expanded: {
          actual: [ 'a-b', 'a-c', 'a-d' ],
          expected: [ '{a-b}', '{a-c}', '{a-d}' ],
          minimatch: [ '{a-b}', '{a-c}', '{a-d}' ],
          bash: [ '{a-b}', '{a-c}', '{a-d}' ]
        },
        optimized: {
          actual: '{a-(b|c|d)}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{a,{a-{b,c,d}}}',
        expanded: {
          actual: [ 'a', 'a-b', 'a-c', 'a-d' ],
          expected: [ 'a', '{a-b}', '{a-c}', '{a-d}' ],
          minimatch: [ 'a', '{a-b}', '{a-c}', '{a-d}' ],
          bash: [ 'a', '{a-b}', '{a-c}', '{a-d}' ]
        },
        optimized: {
          actual: '(a|{a-(b|c|d)})',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should escape imbalanced braces': {
    units: [
      {
        options: {},
        fixture: 'a-{bdef-{g,i}-c',
        expanded: {
          actual: [ 'a-bdef-g-c', 'a-bdef-i-c' ],
          expected: [ 'a-{bdef-g-c', 'a-{bdef-i-c' ],
          minimatch: [ 'a-{bdef-g-c', 'a-{bdef-i-c' ],
          bash: [ 'a-{bdef-g-c', 'a-{bdef-i-c' ]
        },
        optimized: {
          actual: 'a-{bdef-(g|i)-c}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'abc{',
        expanded: {
          actual: [ 'abc{' ],
          expected: [ 'abc{' ],
          minimatch: [ 'abc{' ],
          bash: [ 'abc{' ]
        },
        optimized: {
          actual: 'abc{',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{abc{',
        expanded: {
          actual: [ '{abc{' ],
          expected: [ '{abc{' ],
          minimatch: [ '{abc{' ],
          bash: [ '{abc{' ]
        },
        optimized: {
          actual: '{abc{',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{abc',
        expanded: {
          actual: [ '{abc' ],
          expected: [ '{abc' ],
          minimatch: [ '{abc' ],
          bash: [ '{abc' ]
        },
        optimized: {
          actual: '{abc',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '}abc',
        expanded: {
          actual: [ 'abc' ],
          expected: [ '}abc' ],
          minimatch: [ '}abc' ],
          bash: [ '}abc' ]
        },
        optimized: {
          actual: '}abc',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'ab{c',
        expanded: {
          actual: [ 'ab{c' ],
          expected: [ 'ab{c' ],
          minimatch: [ 'ab{c' ],
          bash: [ 'ab{c' ]
        },
        optimized: {
          actual: 'ab{c',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'ab{c',
        expanded: {
          actual: [ 'ab{c' ],
          expected: [ 'ab{c' ],
          minimatch: [ 'ab{c' ],
          bash: [ 'ab{c' ]
        },
        optimized: {
          actual: 'ab{c',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{{a,b}',
        expanded: {
          actual: [ 'a', 'b' ],
          expected: [ '{a', '{b' ],
          minimatch: [ '{a', '{b' ],
          bash: [ '{a', '{b' ]
        },
        optimized: {
          actual: '{(a|b)}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{a,b}}',
        expanded: {
          actual: [ 'a', 'b' ],
          expected: [ 'a}', 'b}' ],
          minimatch: [ 'a}', 'b}' ],
          bash: [ 'a}', 'b}' ]
        },
        optimized: {
          actual: '(a|b)}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'abcd{efgh',
        expanded: {
          actual: [ 'abcd{efgh' ],
          expected: [ 'abcd{efgh' ],
          minimatch: [ 'abcd{efgh' ],
          bash: [ 'abcd{efgh' ]
        },
        optimized: {
          actual: 'abcd{efgh',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a{b{c{d,e}f}g}h',
        expanded: {
          actual: [ 'abcdfgh', 'abcefgh' ],
          expected: [ 'a{b{cdf}g}h', 'a{b{cef}g}h' ],
          minimatch: [ 'a{b{cdf}g}h', 'a{b{cef}g}h' ],
          bash: [ 'a{b{cdf}g}h', 'a{b{cef}g}h' ]
        },
        optimized: {
          actual: 'a(b(c(d|e)f)g)h',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'f{x,y{{g,z}}h}',
        expanded: {
          actual: [ 'fx', 'fygh', 'fyzh' ],
          expected: [ 'fx', 'fy{g}h', 'fy{z}h' ],
          minimatch: [ 'fx', 'fy{g}h', 'fy{z}h' ],
          bash: [ 'fx', 'fy{g}h', 'fy{z}h' ]
        },
        optimized: {
          actual: 'f(x|y((g|z))h)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'z{a,b},c}d',
        expanded: {
          actual: [ 'za,cd', 'zb,cd' ],
          expected: [ 'za,c}d', 'zb,c}d' ],
          minimatch: [ 'za,c}d', 'zb,c}d' ],
          bash: [ 'za,c}d', 'zb,c}d' ]
        },
        optimized: {
          actual: 'z(a|b),c}d',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a{b{c{d,e}f{x,y{{g}h',
        expanded: {
          actual: [ 'abcdf{x', 'abcef{x', 'aby{{g}h' ],
          expected: [ 'a{b{cdf{x,y{{g}h', 'a{b{cef{x,y{{g}h' ],
          minimatch: [ 'a{b{cdf{x,y{{g}h', 'a{b{cef{x,y{{g}h' ],
          bash: [ 'a{b{cdf{x,y{{g}h', 'a{b{cef{x,y{{g}h' ]
        },
        optimized: {
          actual: 'a{b{c(d|e)f{x,y{{g}h}}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'f{x,y{{g}h',
        expanded: {
          actual: [ 'f{x,y{{g}h' ],
          expected: [ 'f{x,y{{g}h' ],
          minimatch: [ 'f{x,y{{g}h' ],
          bash: [ 'f{x,y{{g}h' ]
        },
        optimized: {
          actual: 'f{x,y{{g}h',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'f{x,y{{g}}h',
        expanded: {
          actual: [ 'fx', 'fy{g}h' ],
          expected: [ 'f{x,y{{g}}h' ],
          minimatch: [ 'f{x,y{{g}}h' ],
          bash: [ 'f{x,y{{g}}h' ]
        },
        optimized: {
          actual: 'f{x,y{{g}}h',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a{b{c{d,e}f{x,y{}g}h',
        expanded: {
          actual: [ 'abcdfxh', 'abcdfygh', 'abcefxh', 'abcefygh' ],
          expected: [ 'a{b{cdfxh', 'a{b{cdfy{}gh', 'a{b{cefxh', 'a{b{cefy{}gh' ],
          minimatch: [ 'a{b{cdfxh', 'a{b{cdfy{}gh', 'a{b{cefxh', 'a{b{cefy{}gh' ],
          bash: [ 'a{b{cdfxh', 'a{b{cdfy{}gh', 'a{b{cefxh', 'a{b{cefy{}gh' ]
        },
        optimized: {
          actual: 'a{b{c(d|e)f(x|y{}g)h}}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'f{x,y{}g}h',
        expanded: {
          actual: [ 'fxh', 'fygh' ],
          expected: [ 'fxh', 'fy{}gh' ],
          minimatch: [ 'fxh', 'fy{}gh' ],
          bash: [ 'fxh', 'fy{}gh' ]
        },
        optimized: {
          actual: 'f(x|y{}g)h',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'z{a,b{,c}d',
        expanded: {
          actual: [ 'za', 'zbd', 'zbcd' ],
          expected: [ 'z{a,bd', 'z{a,bcd' ],
          minimatch: [ 'z{a,bd', 'z{a,bcd' ],
          bash: [ 'z{a,bd', 'z{a,bcd' ]
        },
        optimized: {
          actual: 'z{a,b(|c)d}',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should expand numeric ranges': {
    units: [
      {
        options: {},
        fixture: 'a{0..3}d',
        expanded: {
          actual: [ 'a0d', 'a1d', 'a2d', 'a3d' ],
          expected: [ 'a0d', 'a1d', 'a2d', 'a3d' ],
          minimatch: [ 'a0d', 'a1d', 'a2d', 'a3d' ],
          bash: [ 'a0d', 'a1d', 'a2d', 'a3d' ]
        },
        optimized: {
          actual: 'a([0-3])d',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'x{10..1}y',
        expanded: {
          actual: [ 'x10y', 'x9y', 'x8y', 'x7y', 'x6y', 'x5y', 'x4y', 'x3y', 'x2y', 'x1y' ],
          expected: [ 'x10y', 'x9y', 'x8y', 'x7y', 'x6y', 'x5y', 'x4y', 'x3y', 'x2y', 'x1y' ],
          minimatch: [ 'x10y', 'x9y', 'x8y', 'x7y', 'x6y', 'x5y', 'x4y', 'x3y', 'x2y', 'x1y' ],
          bash: [ 'x10y', 'x9y', 'x8y', 'x7y', 'x6y', 'x5y', 'x4y', 'x3y', 'x2y', 'x1y' ]
        },
        optimized: {
          actual: 'x([1-9]|10)y',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'x{3..3}y',
        expanded: {
          actual: [ 'x3y' ],
          expected: [ 'x3y' ],
          minimatch: [ 'x3y' ],
          bash: [ 'x3y' ]
        },
        optimized: {
          actual: 'x3y',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..10}',
        expanded: {
          actual: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          expected: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          minimatch: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          bash: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ]
        },
        optimized: {
          actual: '([1-9]|10)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..3}',
        expanded: {
          actual: [ '1', '2', '3' ],
          expected: [ '1', '2', '3' ],
          minimatch: [ '1', '2', '3' ],
          bash: [ '1', '2', '3' ]
        },
        optimized: {
          actual: '([1-3])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..9}',
        expanded: {
          actual: [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
          expected: [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
          minimatch: [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ],
          bash: [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ]
        },
        optimized: {
          actual: '([1-9])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{10..1}',
        expanded: {
          actual: [ '10', '9', '8', '7', '6', '5', '4', '3', '2', '1' ],
          expected: [ '10', '9', '8', '7', '6', '5', '4', '3', '2', '1' ],
          minimatch: [ '10', '9', '8', '7', '6', '5', '4', '3', '2', '1' ],
          bash: [ '10', '9', '8', '7', '6', '5', '4', '3', '2', '1' ]
        },
        optimized: {
          actual: '([1-9]|10)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{10..1}y',
        expanded: {
          actual: [ '10y', '9y', '8y', '7y', '6y', '5y', '4y', '3y', '2y', '1y' ],
          expected: [ '10y', '9y', '8y', '7y', '6y', '5y', '4y', '3y', '2y', '1y' ],
          minimatch: [ '10y', '9y', '8y', '7y', '6y', '5y', '4y', '3y', '2y', '1y' ],
          bash: [ '10y', '9y', '8y', '7y', '6y', '5y', '4y', '3y', '2y', '1y' ]
        },
        optimized: {
          actual: '([1-9]|10)y',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{3..3}',
        expanded: {
          actual: [ '3' ],
          expected: [ '3' ],
          minimatch: [ '3' ],
          bash: [ '3' ]
        },
        optimized: {
          actual: '3',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{5..8}',
        expanded: {
          actual: [ '5', '6', '7', '8' ],
          expected: [ '5', '6', '7', '8' ],
          minimatch: [ '5', '6', '7', '8' ],
          bash: [ '5', '6', '7', '8' ]
        },
        optimized: {
          actual: '([5-8])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should expand ranges with negative numbers': {
    units: [
      {
        options: {},
        fixture: '{-10..-1}',
        expanded: {
          actual: [ '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1' ],
          expected: [ '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1' ],
          minimatch: [ '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1' ],
          bash: [ '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1' ]
        },
        optimized: {
          actual: '(-[1-9]|-10)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{-20..0}',
        expanded: {
          actual: [ '-20', '-19', '-18', '-17', '-16', '-15', '-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0' ],
          expected: [ '-20', '-19', '-18', '-17', '-16', '-15', '-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0' ],
          minimatch: [ '-20', '-19', '-18', '-17', '-16', '-15', '-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0' ],
          bash: [ '-20', '-19', '-18', '-17', '-16', '-15', '-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0' ]
        },
        optimized: {
          actual: '(-[1-9]|-1[0-9]|-20|0)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{0..-5}',
        expanded: {
          actual: [ '0', '-1', '-2', '-3', '-4', '-5' ],
          expected: [ '0', '-1', '-2', '-3', '-4', '-5' ],
          minimatch: [ '0', '-1', '-2', '-3', '-4', '-5' ],
          bash: [ '0', '-1', '-2', '-3', '-4', '-5' ]
        },
        optimized: {
          actual: '(-[1-5]|0)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{9..-4}',
        expanded: {
          actual: [ '9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4' ],
          expected: [ '9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4' ],
          minimatch: [ '9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4' ],
          bash: [ '9', '8', '7', '6', '5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4' ]
        },
        optimized: {
          actual: '(-[1-4]|[0-9])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should expand alphabetical ranges': {
    units: [
      {
        options: {},
        fixture: '0{1..9}/{10..20}',
        expanded: {
          actual: [ '01/10', '01/11', '01/12', '01/13', '01/14', '01/15', '01/16', '01/17', '01/18', '01/19', '01/20', '02/10', '02/11', '02/12', '02/13', '02/14', '02/15', '02/16', '02/17', '02/18', '02/19', '02/20', '03/10', '03/11', '03/12', '03/13', '03/14', '03/15', '03/16', '03/17', '03/18', '03/19', '03/20', '04/10', '04/11', '04/12', '04/13', '04/14', '04/15', '04/16', '04/17', '04/18', '04/19', '04/20', '05/10', '05/11', '05/12', '05/13', '05/14', '05/15', '05/16', '05/17', '05/18', '05/19', '05/20', '06/10', '06/11', '06/12', '06/13', '06/14', '06/15', '06/16', '06/17', '06/18', '06/19', '06/20', '07/10', '07/11', '07/12', '07/13', '07/14', '07/15', '07/16', '07/17', '07/18', '07/19', '07/20', '08/10', '08/11', '08/12', '08/13', '08/14', '08/15', '08/16', '08/17', '08/18', '08/19', '08/20', '09/10', '09/11', '09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18', '09/19', '09/20' ],
          expected: [ '01/10', '01/11', '01/12', '01/13', '01/14', '01/15', '01/16', '01/17', '01/18', '01/19', '01/20', '02/10', '02/11', '02/12', '02/13', '02/14', '02/15', '02/16', '02/17', '02/18', '02/19', '02/20', '03/10', '03/11', '03/12', '03/13', '03/14', '03/15', '03/16', '03/17', '03/18', '03/19', '03/20', '04/10', '04/11', '04/12', '04/13', '04/14', '04/15', '04/16', '04/17', '04/18', '04/19', '04/20', '05/10', '05/11', '05/12', '05/13', '05/14', '05/15', '05/16', '05/17', '05/18', '05/19', '05/20', '06/10', '06/11', '06/12', '06/13', '06/14', '06/15', '06/16', '06/17', '06/18', '06/19', '06/20', '07/10', '07/11', '07/12', '07/13', '07/14', '07/15', '07/16', '07/17', '07/18', '07/19', '07/20', '08/10', '08/11', '08/12', '08/13', '08/14', '08/15', '08/16', '08/17', '08/18', '08/19', '08/20', '09/10', '09/11', '09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18', '09/19', '09/20' ],
          minimatch: [ '01/10', '01/11', '01/12', '01/13', '01/14', '01/15', '01/16', '01/17', '01/18', '01/19', '01/20', '02/10', '02/11', '02/12', '02/13', '02/14', '02/15', '02/16', '02/17', '02/18', '02/19', '02/20', '03/10', '03/11', '03/12', '03/13', '03/14', '03/15', '03/16', '03/17', '03/18', '03/19', '03/20', '04/10', '04/11', '04/12', '04/13', '04/14', '04/15', '04/16', '04/17', '04/18', '04/19', '04/20', '05/10', '05/11', '05/12', '05/13', '05/14', '05/15', '05/16', '05/17', '05/18', '05/19', '05/20', '06/10', '06/11', '06/12', '06/13', '06/14', '06/15', '06/16', '06/17', '06/18', '06/19', '06/20', '07/10', '07/11', '07/12', '07/13', '07/14', '07/15', '07/16', '07/17', '07/18', '07/19', '07/20', '08/10', '08/11', '08/12', '08/13', '08/14', '08/15', '08/16', '08/17', '08/18', '08/19', '08/20', '09/10', '09/11', '09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18', '09/19', '09/20' ],
          bash: [ '01/10', '01/11', '01/12', '01/13', '01/14', '01/15', '01/16', '01/17', '01/18', '01/19', '01/20', '02/10', '02/11', '02/12', '02/13', '02/14', '02/15', '02/16', '02/17', '02/18', '02/19', '02/20', '03/10', '03/11', '03/12', '03/13', '03/14', '03/15', '03/16', '03/17', '03/18', '03/19', '03/20', '04/10', '04/11', '04/12', '04/13', '04/14', '04/15', '04/16', '04/17', '04/18', '04/19', '04/20', '05/10', '05/11', '05/12', '05/13', '05/14', '05/15', '05/16', '05/17', '05/18', '05/19', '05/20', '06/10', '06/11', '06/12', '06/13', '06/14', '06/15', '06/16', '06/17', '06/18', '06/19', '06/20', '07/10', '07/11', '07/12', '07/13', '07/14', '07/15', '07/16', '07/17', '07/18', '07/19', '07/20', '08/10', '08/11', '08/12', '08/13', '08/14', '08/15', '08/16', '08/17', '08/18', '08/19', '08/20', '09/10', '09/11', '09/12', '09/13', '09/14', '09/15', '09/16', '09/17', '09/18', '09/19', '09/20' ]
        },
        optimized: {
          actual: '0([1-9])/(1[0-9]|20)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '0{a..d}0',
        expanded: {
          actual: [ '0a0', '0b0', '0c0', '0d0' ],
          expected: [ '0a0', '0b0', '0c0', '0d0' ],
          minimatch: [ '0a0', '0b0', '0c0', '0d0' ],
          bash: [ '0a0', '0b0', '0c0', '0d0' ]
        },
        optimized: {
          actual: '0([a-d])0',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'a/{b..d}/e',
        expanded: {
          actual: [ 'a/b/e', 'a/c/e', 'a/d/e' ],
          expected: [ 'a/b/e', 'a/c/e', 'a/d/e' ],
          minimatch: [ 'a/b/e', 'a/c/e', 'a/d/e' ],
          bash: [ 'a/b/e', 'a/c/e', 'a/d/e' ]
        },
        optimized: {
          actual: 'a/([b-d])/e',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{1..f}',
        expanded: {
          actual: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[',
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
          expected: [ '{1..f}' ],
          minimatch: [ '{1..f}' ],
          bash: [ '{1..f}' ]
        },
        optimized: {
          actual: '([1-f])',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{a..A}',
        expanded: {
          actual: [ 'a', '`', '_', '^',
            ']',
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
          expected: [ 'a', '`', '_', '^',
            ']',
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
          bash: [ 'a', '`', '_', '^',
            ']',
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
          ]
        },
        optimized: {
          actual: '([A-a])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: false,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{A..a}',
        expanded: {
          actual: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[',
            ']',
            '^',
            '_',
            '`',
            'a'
          ],
          expected: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[',
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
          bash: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[',
            ']',
            '^',
            '_',
            '`',
            'a'
          ]
        },
        optimized: {
          actual: '([A-a])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: false,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{a..e}',
        expanded: {
          actual: [ 'a', 'b', 'c', 'd', 'e' ],
          expected: [ 'a', 'b', 'c', 'd', 'e' ],
          minimatch: [ 'a', 'b', 'c', 'd', 'e' ],
          bash: [ 'a', 'b', 'c', 'd', 'e' ]
        },
        optimized: {
          actual: '([a-e])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{A..E}',
        expanded: {
          actual: [ 'A', 'B', 'C', 'D', 'E' ],
          expected: [ 'A', 'B', 'C', 'D', 'E' ],
          minimatch: [ 'A', 'B', 'C', 'D', 'E' ],
          bash: [ 'A', 'B', 'C', 'D', 'E' ]
        },
        optimized: {
          actual: '([A-E])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{a..f}',
        expanded: {
          actual: [ 'a', 'b', 'c', 'd', 'e', 'f' ],
          expected: [ 'a', 'b', 'c', 'd', 'e', 'f' ],
          minimatch: [ 'a', 'b', 'c', 'd', 'e', 'f' ],
          bash: [ 'a', 'b', 'c', 'd', 'e', 'f' ]
        },
        optimized: {
          actual: '([a-f])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{a..z}',
        expanded: {
          actual: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
          expected: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
          minimatch: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
          bash: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ]
        },
        optimized: {
          actual: '([a-z])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{E..A}',
        expanded: {
          actual: [ 'E', 'D', 'C', 'B', 'A' ],
          expected: [ 'E', 'D', 'C', 'B', 'A' ],
          minimatch: [ 'E', 'D', 'C', 'B', 'A' ],
          bash: [ 'E', 'D', 'C', 'B', 'A' ]
        },
        optimized: {
          actual: '([A-E])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{f..1}',
        expanded: {
          actual: [ 'f', 'e', 'd', 'c', 'b', 'a', '`', '_', '^',
            ']',
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
            'A',
            '@',
            '?',
            '>',
            '=',
            '<',
            ';',
            ':',
            '9',
            '8',
            '7',
            '6',
            '5',
            '4',
            '3',
            '2',
            '1'
          ],
          expected: [ '{f..1}' ],
          minimatch: [ '{f..1}' ],
          bash: [ '{f..1}' ]
        },
        optimized: {
          actual: '([1-f])',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: false,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{f..a}',
        expanded: {
          actual: [ 'f', 'e', 'd', 'c', 'b', 'a' ],
          expected: [ 'f', 'e', 'd', 'c', 'b', 'a' ],
          minimatch: [ 'f', 'e', 'd', 'c', 'b', 'a' ],
          bash: [ 'f', 'e', 'd', 'c', 'b', 'a' ]
        },
        optimized: {
          actual: '([a-f])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{f..f}',
        expanded: {
          actual: [ 'f' ],
          expected: [ 'f' ],
          minimatch: [ 'f' ],
          bash: [ 'f' ]
        },
        optimized: {
          actual: 'f',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should expand multiple ranges': {
    units: [
      {
        options: {},
        fixture: 'a/{b..d}/e/{f..h}',
        expanded: {
          actual: [ 'a/b/e/f', 'a/b/e/g', 'a/b/e/h', 'a/c/e/f', 'a/c/e/g', 'a/c/e/h', 'a/d/e/f', 'a/d/e/g', 'a/d/e/h' ],
          expected: [ 'a/b/e/f', 'a/b/e/g', 'a/b/e/h', 'a/c/e/f', 'a/c/e/g', 'a/c/e/h', 'a/d/e/f', 'a/d/e/g', 'a/d/e/h' ],
          minimatch: [ 'a/b/e/f', 'a/b/e/g', 'a/b/e/h', 'a/c/e/f', 'a/c/e/g', 'a/c/e/h', 'a/d/e/f', 'a/d/e/g', 'a/d/e/h' ],
          bash: [ 'a/b/e/f', 'a/b/e/g', 'a/b/e/h', 'a/c/e/f', 'a/c/e/g', 'a/c/e/h', 'a/d/e/f', 'a/d/e/g', 'a/d/e/h' ]
        },
        optimized: {
          actual: 'a/([b-d])/e/([f-h])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should expand numerical ranges - positive and negative': {
    units: [
      {
        options: {},
        fixture: '{-10..10}',
        expanded: {
          actual: [ '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          expected: [ '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          minimatch: [ '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          bash: [ '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ]
        },
        optimized: {
          actual: '(-[1-9]|-?10|[0-9])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should expand ranges using steps': {
    units: [
      {
        options: {},
        fixture: '{1..10..1}',
        expanded: {
          actual: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          expected: [ '{1..10..1}' ],
          minimatch: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          bash: [ '{1..10..1}' ]
        },
        optimized: {
          actual: '([1-9]|10)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{1..10..2}',
        expanded: {
          actual: [ '1', '3', '5', '7', '9' ],
          expected: [ '{1..10..2}' ],
          minimatch: [ '1', '3', '5', '7', '9' ],
          bash: [ '{1..10..2}' ]
        },
        optimized: {
          actual: '(1|3|5|7|9)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{1..20..20}',
        expanded: {
          actual: [ '1' ],
          expected: [ '{1..20..20}' ],
          minimatch: [ '1' ],
          bash: [ '{1..20..20}' ]
        },
        optimized: {
          actual: '1',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{1..20..20}',
        expanded: {
          actual: [ '1' ],
          expected: [ '{1..20..20}' ],
          minimatch: [ '1' ],
          bash: [ '{1..20..20}' ]
        },
        optimized: {
          actual: '1',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{1..20..20}',
        expanded: {
          actual: [ '1' ],
          expected: [ '{1..20..20}' ],
          minimatch: [ '1' ],
          bash: [ '{1..20..20}' ]
        },
        optimized: {
          actual: '1',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{1..20..2}',
        expanded: {
          actual: [ '1', '3', '5', '7', '9', '11', '13', '15', '17', '19' ],
          expected: [ '{1..20..2}' ],
          minimatch: [ '1', '3', '5', '7', '9', '11', '13', '15', '17', '19' ],
          bash: [ '{1..20..2}' ]
        },
        optimized: {
          actual: '(1|3|5|7|9|11|13|15|17|19)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{10..0..2}',
        expanded: {
          actual: [ '10', '8', '6', '4', '2', '0' ],
          expected: [ '{10..0..2}' ],
          minimatch: [ '10', '8', '6', '4', '2', '0' ],
          bash: [ '{10..0..2}' ]
        },
        optimized: {
          actual: '(10|8|6|4|2|0)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{10..1..2}',
        expanded: {
          actual: [ '10', '8', '6', '4', '2' ],
          expected: [ '{10..1..2}' ],
          minimatch: [ '10', '8', '6', '4', '2' ],
          bash: [ '{10..1..2}' ]
        },
        optimized: {
          actual: '(10|8|6|4|2)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{100..0..5}',
        expanded: {
          actual: [ '100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0' ],
          expected: [ '{100..0..5}' ],
          minimatch: [ '100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0' ],
          bash: [ '{100..0..5}' ]
        },
        optimized: {
          actual: '(100|95|90|85|80|75|70|65|60|55|50|45|40|35|30|25|20|15|10|5|0)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{2..10..1}',
        expanded: {
          actual: [ '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          expected: [ '{2..10..1}' ],
          minimatch: [ '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
          bash: [ '{2..10..1}' ]
        },
        optimized: {
          actual: '([2-9]|10)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{2..10..2}',
        expanded: {
          actual: [ '2', '4', '6', '8', '10' ],
          expected: [ '{2..10..2}' ],
          minimatch: [ '2', '4', '6', '8', '10' ],
          bash: [ '{2..10..2}' ]
        },
        optimized: {
          actual: '(2|4|6|8|10)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{2..10..3}',
        expanded: {
          actual: [ '2', '5', '8' ],
          expected: [ '{2..10..3}' ],
          minimatch: [ '2', '5', '8' ],
          bash: [ '{2..10..3}' ]
        },
        optimized: {
          actual: '(2|5|8)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{a..z..2}',
        expanded: {
          actual: [ 'a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y' ],
          expected: [ '{a..z..2}' ],
          minimatch: [ 'a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y' ],
          bash: [ '{a..z..2}' ]
        },
        optimized: {
          actual: '(a|c|e|g|i|k|m|o|q|s|u|w|y)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      }
    ]
  },
  'should expand positive ranges with negative steps': {
    units: [
      {
        options: {},
        fixture: '{10..0..-2}',
        expanded: {
          actual: [ '10', '8', '6', '4', '2', '0' ],
          expected: [ '{10..0..-2}' ],
          minimatch: [ '10', '8', '6', '4', '2', '0' ],
          bash: [ '{10..0..-2}' ]
        },
        optimized: {
          actual: '(10|8|6|4|2|0)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      }
    ]
  },
  'should expand negative ranges using steps': {
    units: [
      {
        options: {},
        fixture: '{-1..-10..-2}',
        expanded: {
          actual: [ '-1', '-3', '-5', '-7', '-9' ],
          expected: [ '{-1..-10..-2}' ],
          minimatch: [ '-1', '-3', '-5', '-7', '-9' ],
          bash: [ '{-1..-10..-2}' ]
        },
        optimized: {
          actual: '-(1|3|5|7|9)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{-1..-10..2}',
        expanded: {
          actual: [ '-1', '-3', '-5', '-7', '-9' ],
          expected: [ '{-1..-10..2}' ],
          minimatch: [ '-1', '-3', '-5', '-7', '-9' ],
          bash: [ '{-1..-10..2}' ]
        },
        optimized: {
          actual: '-(1|3|5|7|9)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{-10..-2..2}',
        expanded: {
          actual: [ '-10', '-8', '-6', '-4', '-2' ],
          expected: [ '{-10..-2..2}' ],
          minimatch: [ '-10', '-8', '-6', '-4', '-2' ],
          bash: [ '{-10..-2..2}' ]
        },
        optimized: {
          actual: '-(10|8|6|4|2)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{-2..-10..1}',
        expanded: {
          actual: [ '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10' ],
          expected: [ '{-2..-10..1}' ],
          minimatch: [ '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10' ],
          bash: [ '{-2..-10..1}' ]
        },
        optimized: {
          actual: '(-[2-9]|-10)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{-2..-10..2}',
        expanded: {
          actual: [ '-2', '-4', '-6', '-8', '-10' ],
          expected: [ '{-2..-10..2}' ],
          minimatch: [ '-2', '-4', '-6', '-8', '-10' ],
          bash: [ '{-2..-10..2}' ]
        },
        optimized: {
          actual: '-(2|4|6|8|10)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{-2..-10..3}',
        expanded: {
          actual: [ '-2', '-5', '-8' ],
          expected: [ '{-2..-10..3}' ],
          minimatch: [ '-2', '-5', '-8' ],
          bash: [ '{-2..-10..3}' ]
        },
        optimized: {
          actual: '-(2|5|8)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{-50..-0..5}',
        expanded: {
          actual: [ '-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0' ],
          expected: [ '{-50..-0..5}' ],
          minimatch: [ '-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0' ],
          bash: [ '{-50..-0..5}' ]
        },
        optimized: {
          actual: '(0|-(50|45|40|35|30|25|20|15|10|5))',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{-9..9..3}',
        expanded: {
          actual: [ '-9', '-6', '-3', '0', '3', '6', '9' ],
          expected: [ '{-9..9..3}' ],
          minimatch: [ '-9', '-6', '-3', '0', '3', '6', '9' ],
          bash: [ '{-9..9..3}' ]
        },
        optimized: {
          actual: '(0|3|6|9|-(9|6|3))',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{10..1..-2}',
        expanded: {
          actual: [ '10', '8', '6', '4', '2' ],
          expected: [ '{10..1..-2}' ],
          minimatch: [ '10', '8', '6', '4', '2' ],
          bash: [ '{10..1..-2}' ]
        },
        optimized: {
          actual: '(10|8|6|4|2)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{100..0..-5}',
        expanded: {
          actual: [ '100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0' ],
          expected: [ '{100..0..-5}' ],
          minimatch: [ '100', '95', '90', '85', '80', '75', '70', '65', '60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5', '0' ],
          bash: [ '{100..0..-5}' ]
        },
        optimized: {
          actual: '(100|95|90|85|80|75|70|65|60|55|50|45|40|35|30|25|20|15|10|5|0)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      }
    ]
  },
  'should expand alpha ranges with steps': {
    units: [
      {
        options: {},
        fixture: '{a..e..2}',
        expanded: {
          actual: [ 'a', 'c', 'e' ],
          expected: [ '{a..e..2}' ],
          minimatch: [ 'a', 'c', 'e' ],
          bash: [ '{a..e..2}' ]
        },
        optimized: {
          actual: '(a|c|e)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{E..A..2}',
        expanded: {
          actual: [ 'E', 'C', 'A' ],
          expected: [ '{E..A..2}' ],
          minimatch: [ 'E', 'C', 'A' ],
          bash: [ '{E..A..2}' ]
        },
        optimized: {
          actual: '(E|C|A)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{a..z}',
        expanded: {
          actual: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
          expected: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
          minimatch: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ],
          bash: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ]
        },
        optimized: {
          actual: '([a-z])',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '{a..z..2}',
        expanded: {
          actual: [ 'a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y' ],
          expected: [ '{a..z..2}' ],
          minimatch: [ 'a', 'c', 'e', 'g', 'i', 'k', 'm', 'o', 'q', 's', 'u', 'w', 'y' ],
          bash: [ '{a..z..2}' ]
        },
        optimized: {
          actual: '(a|c|e|g|i|k|m|o|q|s|u|w|y)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{z..a..-2}',
        expanded: {
          actual: [ 'z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b' ],
          expected: [ '{z..a..-2}' ],
          minimatch: [ 'z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b' ],
          bash: [ '{z..a..-2}' ]
        },
        optimized: {
          actual: '(z|x|v|t|r|p|n|l|j|h|f|d|b)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      }
    ]
  },
  'should expand alpha ranges with negative steps': {
    units: [
      {
        options: {},
        fixture: '{z..a..-2}',
        expanded: {
          actual: [ 'z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b' ],
          expected: [ '{z..a..-2}' ],
          minimatch: [ 'z', 'x', 'v', 't', 'r', 'p', 'n', 'l', 'j', 'h', 'f', 'd', 'b' ],
          bash: [ '{z..a..-2}' ]
        },
        optimized: {
          actual: '(z|x|v|t|r|p|n|l|j|h|f|d|b)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      }
    ]
  },
  'should not add unwanted zero-padding -- fixed post-bash-4.0': {
    units: [
      {
        options: {},
        fixture: '{10..0..2}',
        expanded: {
          actual: [ '10', '8', '6', '4', '2', '0' ],
          expected: [ '{10..0..2}' ],
          minimatch: [ '10', '8', '6', '4', '2', '0' ],
          bash: [ '{10..0..2}' ]
        },
        optimized: {
          actual: '(10|8|6|4|2|0)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{10..0..-2}',
        expanded: {
          actual: [ '10', '8', '6', '4', '2', '0' ],
          expected: [ '{10..0..-2}' ],
          minimatch: [ '10', '8', '6', '4', '2', '0' ],
          bash: [ '{10..0..-2}' ]
        },
        optimized: {
          actual: '(10|8|6|4|2|0)',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '{-50..-0..5}',
        expanded: {
          actual: [ '-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0' ],
          expected: [ '{-50..-0..5}' ],
          minimatch: [ '-50', '-45', '-40', '-35', '-30', '-25', '-20', '-15', '-10', '-5', '0' ],
          bash: [ '{-50..-0..5}' ]
        },
        optimized: {
          actual: '(0|-(50|45|40|35|30|25|20|15|10|5))',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      }
    ]
  },
  'should work with dots in file paths': {
    units: [
      {
        options: {},
        fixture: '../{1..3}/../foo',
        expanded: {
          actual: [ '../1/../foo', '../2/../foo', '../3/../foo' ],
          expected: [ '../1/../foo', '../2/../foo', '../3/../foo' ],
          minimatch: [ '../1/../foo', '../2/../foo', '../3/../foo' ],
          bash: [ '../1/../foo', '../2/../foo', '../3/../foo' ]
        },
        optimized: {
          actual: '../([1-3])/../foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: '../{2..10..2}/../foo',
        expanded: {
          actual: [ '../2/../foo', '../4/../foo', '../6/../foo', '../8/../foo', '../10/../foo' ],
          expected: [ '../{2..10..2}/../foo' ],
          minimatch: [ '../2/../foo', '../4/../foo', '../6/../foo', '../8/../foo', '../10/../foo' ],
          bash: [ '../{2..10..2}/../foo' ]
        },
        optimized: {
          actual: '../(2|4|6|8|10)/../foo',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: '../{1..3}/../{a,b,c}/foo',
        expanded: {
          actual: [ '../1/../a/foo', '../1/../b/foo', '../1/../c/foo', '../2/../a/foo', '../2/../b/foo', '../2/../c/foo', '../3/../a/foo', '../3/../b/foo', '../3/../c/foo' ],
          expected: [ '../1/../a/foo', '../1/../b/foo', '../1/../c/foo', '../2/../a/foo', '../2/../b/foo', '../2/../c/foo', '../3/../a/foo', '../3/../b/foo', '../3/../c/foo' ],
          minimatch: [ '../1/../a/foo', '../1/../b/foo', '../1/../c/foo', '../2/../a/foo', '../2/../b/foo', '../2/../c/foo', '../3/../a/foo', '../3/../b/foo', '../3/../c/foo' ],
          bash: [ '../1/../a/foo', '../1/../b/foo', '../1/../c/foo', '../2/../a/foo', '../2/../b/foo', '../2/../c/foo', '../3/../a/foo', '../3/../b/foo', '../3/../c/foo' ]
        },
        optimized: {
          actual: '../([1-3])/../(a|b|c)/foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: './{a..z..3}/',
        expanded: {
          actual: [ './a/', './d/', './g/', './j/', './m/', './p/', './s/', './v/', './y/' ],
          expected: [ './{a..z..3}/' ],
          minimatch: [ './a/', './d/', './g/', './j/', './m/', './p/', './s/', './v/', './y/' ],
          bash: [ './{a..z..3}/' ]
        },
        optimized: {
          actual: './(a|d|g|j|m|p|s|v|y)/',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      },
      {
        options: {},
        fixture: './{"x,y"}/{a..z..3}/',
        expanded: {
          actual: [ './"x/a/', './"x/d/', './"x/g/', './"x/j/', './"x/m/', './"x/p/', './"x/s/', './"x/v/', './"x/y/', './y"/a/', './y"/d/', './y"/g/', './y"/j/', './y"/m/', './y"/p/', './y"/s/', './y"/v/', './y"/y/' ],
          expected: [ './{x,y}/{a..z..3}/' ],
          minimatch: [ './"x/a/', './"x/d/', './"x/g/', './"x/j/', './"x/m/', './"x/p/', './"x/s/', './"x/v/', './"x/y/', './y"/a/', './y"/d/', './y"/g/', './y"/j/', './y"/m/', './y"/p/', './y"/s/', './y"/v/', './y"/y/' ],
          bash: [ './{x,y}/{a..z..3}/' ]
        },
        optimized: {
          actual: './{x,y}/(a|d|g|j|m|p|s|v|y)/',
          expected: ''
        },
        equal: {
          braces_to_bash: false,
          braces_to_minimatch: true,
          minimatch_to_bash: false
        }
      }
    ]
  },
  'should expand a complex combination of ranges and sets': {
    units: [
      {
        options: {},
        fixture: 'a/{x,y}/{1..5}c{d,e}f.{md,txt}',
        expanded: {
          actual: [ 'a/x/1cdf.md', 'a/x/1cdf.txt', 'a/x/1cef.md', 'a/x/1cef.txt', 'a/x/2cdf.md', 'a/x/2cdf.txt', 'a/x/2cef.md', 'a/x/2cef.txt', 'a/x/3cdf.md', 'a/x/3cdf.txt', 'a/x/3cef.md', 'a/x/3cef.txt', 'a/x/4cdf.md', 'a/x/4cdf.txt', 'a/x/4cef.md', 'a/x/4cef.txt', 'a/x/5cdf.md', 'a/x/5cdf.txt', 'a/x/5cef.md', 'a/x/5cef.txt', 'a/y/1cdf.md', 'a/y/1cdf.txt', 'a/y/1cef.md', 'a/y/1cef.txt', 'a/y/2cdf.md', 'a/y/2cdf.txt', 'a/y/2cef.md', 'a/y/2cef.txt', 'a/y/3cdf.md', 'a/y/3cdf.txt', 'a/y/3cef.md', 'a/y/3cef.txt', 'a/y/4cdf.md', 'a/y/4cdf.txt', 'a/y/4cef.md', 'a/y/4cef.txt', 'a/y/5cdf.md', 'a/y/5cdf.txt', 'a/y/5cef.md', 'a/y/5cef.txt' ],
          expected: [ 'a/x/1cdf.md', 'a/x/1cdf.txt', 'a/x/1cef.md', 'a/x/1cef.txt', 'a/x/2cdf.md', 'a/x/2cdf.txt', 'a/x/2cef.md', 'a/x/2cef.txt', 'a/x/3cdf.md', 'a/x/3cdf.txt', 'a/x/3cef.md', 'a/x/3cef.txt', 'a/x/4cdf.md', 'a/x/4cdf.txt', 'a/x/4cef.md', 'a/x/4cef.txt', 'a/x/5cdf.md', 'a/x/5cdf.txt', 'a/x/5cef.md', 'a/x/5cef.txt', 'a/y/1cdf.md', 'a/y/1cdf.txt', 'a/y/1cef.md', 'a/y/1cef.txt', 'a/y/2cdf.md', 'a/y/2cdf.txt', 'a/y/2cef.md', 'a/y/2cef.txt', 'a/y/3cdf.md', 'a/y/3cdf.txt', 'a/y/3cef.md', 'a/y/3cef.txt', 'a/y/4cdf.md', 'a/y/4cdf.txt', 'a/y/4cef.md', 'a/y/4cef.txt', 'a/y/5cdf.md', 'a/y/5cdf.txt', 'a/y/5cef.md', 'a/y/5cef.txt' ],
          minimatch: [ 'a/x/1cdf.md', 'a/x/1cdf.txt', 'a/x/1cef.md', 'a/x/1cef.txt', 'a/x/2cdf.md', 'a/x/2cdf.txt', 'a/x/2cef.md', 'a/x/2cef.txt', 'a/x/3cdf.md', 'a/x/3cdf.txt', 'a/x/3cef.md', 'a/x/3cef.txt', 'a/x/4cdf.md', 'a/x/4cdf.txt', 'a/x/4cef.md', 'a/x/4cef.txt', 'a/x/5cdf.md', 'a/x/5cdf.txt', 'a/x/5cef.md', 'a/x/5cef.txt', 'a/y/1cdf.md', 'a/y/1cdf.txt', 'a/y/1cef.md', 'a/y/1cef.txt', 'a/y/2cdf.md', 'a/y/2cdf.txt', 'a/y/2cef.md', 'a/y/2cef.txt', 'a/y/3cdf.md', 'a/y/3cdf.txt', 'a/y/3cef.md', 'a/y/3cef.txt', 'a/y/4cdf.md', 'a/y/4cdf.txt', 'a/y/4cef.md', 'a/y/4cef.txt', 'a/y/5cdf.md', 'a/y/5cdf.txt', 'a/y/5cef.md', 'a/y/5cef.txt' ],
          bash: [ 'a/x/1cdf.md', 'a/x/1cdf.txt', 'a/x/1cef.md', 'a/x/1cef.txt', 'a/x/2cdf.md', 'a/x/2cdf.txt', 'a/x/2cef.md', 'a/x/2cef.txt', 'a/x/3cdf.md', 'a/x/3cdf.txt', 'a/x/3cef.md', 'a/x/3cef.txt', 'a/x/4cdf.md', 'a/x/4cdf.txt', 'a/x/4cef.md', 'a/x/4cef.txt', 'a/x/5cdf.md', 'a/x/5cdf.txt', 'a/x/5cef.md', 'a/x/5cef.txt', 'a/y/1cdf.md', 'a/y/1cdf.txt', 'a/y/1cef.md', 'a/y/1cef.txt', 'a/y/2cdf.md', 'a/y/2cdf.txt', 'a/y/2cef.md', 'a/y/2cef.txt', 'a/y/3cdf.md', 'a/y/3cdf.txt', 'a/y/3cef.md', 'a/y/3cef.txt', 'a/y/4cdf.md', 'a/y/4cdf.txt', 'a/y/4cef.md', 'a/y/4cef.txt', 'a/y/5cdf.md', 'a/y/5cdf.txt', 'a/y/5cef.md', 'a/y/5cef.txt' ]
        },
        optimized: {
          actual: 'a/(x|y)/([1-5])c(d|e)f.(md|txt)',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should expand complex sets and ranges in `bash` mode': {
    units: [
      {
        options: {},
        fixture: 'a/{x,{1..5},y}/c{d}e',
        expanded: {
          actual: [ 'a/x/c{d}e', 'a/1/c{d}e', 'a/2/c{d}e', 'a/3/c{d}e', 'a/4/c{d}e', 'a/5/c{d}e', 'a/y/c{d}e' ],
          expected: [ 'a/x/c{d}e', 'a/1/c{d}e', 'a/2/c{d}e', 'a/3/c{d}e', 'a/4/c{d}e', 'a/5/c{d}e', 'a/y/c{d}e' ],
          minimatch: [ 'a/x/c{d}e', 'a/1/c{d}e', 'a/2/c{d}e', 'a/3/c{d}e', 'a/4/c{d}e', 'a/5/c{d}e', 'a/y/c{d}e' ],
          bash: [ 'a/x/c{d}e', 'a/1/c{d}e', 'a/2/c{d}e', 'a/3/c{d}e', 'a/4/c{d}e', 'a/5/c{d}e', 'a/y/c{d}e' ]
        },
        optimized: {
          actual: 'a/(x|([1-5])|y)/c{d}e',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  },
  'should add foo': {
    units: [
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'foo',
        expanded: {
          actual: [ 'foo' ],
          expected: [ 'foo' ],
          minimatch: [ 'foo' ],
          bash: [ 'foo' ]
        },
        optimized: {
          actual: 'foo',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      },
      {
        options: {},
        fixture: 'bar',
        expanded: {
          actual: [ 'bar' ],
          expected: [ 'bar' ],
          minimatch: [ 'bar' ],
          bash: [ 'bar' ]
        },
        optimized: {
          actual: 'bar',
          expected: ''
        },
        equal: {
          braces_to_bash: true,
          braces_to_minimatch: true,
          minimatch_to_bash: true
        }
      }
    ]
  }
}
