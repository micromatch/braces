
```js

'a{b,c,d,e}f'
// is equivalent to
'a{b,{c,d},e}f'


var stash = [];
var queue = [];
'a{b,c}d'

var stash = ['a'];
var queue = [];
 '{b,c}d'

var stash = ['a'];
var queue = ['ab'];
   ',c}d'

var stash = ['a'];
var queue = ['ab', 'ac'];
     '}d'

var stash = ['ab', 'ac'];
var queue = ['abd', 'acd'];
       ''

/**
 * Nested
 */

// abg acg adeg adfg
var stash = [];
var queue = [];
'a{b,c,d{e,f}}g'

var stash = [];
var queue = ['a'];
 '{b,c,d{e,f}}g'

var stash = ['a'];
var queue = [];
  'b,c,d{e,f}}g'
// b,c,d => ['b', 'c', 'd']

var stash = ['a'];
var queue = ['ab', 'ac', 'ad'];
       '{e,f}}g'

var stash = ['ab', 'ac'];
var queue = ['ad'];
        'e,f}}g'
//       e,f => ['e', 'f']

var stash = ['ab', 'ac'];
var queue = ['ade', 'adf'];
            '}g'

var stash = ['ab', 'ac', 'ade', 'adf'];
var queue = [];
             'g'

var stash = ['ab', 'ac', 'ade', 'adf'];
var queue = ['abg', 'acg', 'adeg', 'adfg'];
             ''

/**
 * Nested
 */

// a/bc/f a/bd/f a/e/f
var stash = [];
var stack = []
var queue = [];
'a/{b{c,d},e}/f'

var stash = [];
var stack = []
var queue = ['a/'];
 '{b{c,d},e}/f'

var stash = [['a/']];
var stack = []
var queue = [];
  'b{c,d},e}/f'

var stash = [['a/']];
var stack = []
var queue = ['b'];
    '{c,d},e}/f'

var stash = [['a/'], ['b']];
var stack = []
var queue = ['c', 'd'];
        '},e}/f'

var stash = [['a/']];
var stack = ['bc', 'bd', 'e']
var queue = ['/f'];
         ',e}/f'

var stash = [['a/']];
var stack = ['bc', 'bd', 'e']
var queue = [];
           '}/f'


var b = ['a/'];
var m = ['bc', 'bd', 'e'];
var e = [];

var b = ['a/', 'b'];
var m = ['c', 'd'];
var e = [];

var b = ['a/'];
var m = ['bc', 'bd', 'e'];
var e = [];

var b = ['a/'];
var m = ['bc', 'bd', 'e'];
var e = ['/f'];

'a/{b{c,d},e}/f'

```