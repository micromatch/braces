'use strict';

const braces = require('..');
const alpha = braces.expand('x/{a..e}/y', {
  transform(code, index) {
    // when non-numeric values are passed, "code" is a character code,
    return 'foo/' + String.fromCharCode(code) + '-' + index;
  }
});
console.log(alpha);
//=> [ 'x/foo/a-0/y', 'x/foo/b-1/y', 'x/foo/c-2/y', 'x/foo/d-3/y', 'x/foo/e-4/y' ]

const numeric = braces.expand('{1..5}', {
  transform(value) {
    return 'foo/' + value * 2;
  }
});
console.log(numeric); //=> [ 'foo/2', 'foo/4', 'foo/6', 'foo/8', 'foo/10' ]
