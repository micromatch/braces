'use strict';

var braces = require('./');

/**
 * Expand an array of strings with braces.
 *
 * ```js
 * expand(['{foo,bar}', '{baz,quux}']);
 * //=> [ 'foo', 'bar', 'baz', 'quux' ];
 * ```
 *
 * @param  {Array|String} `arr`
 * @return {Array}
 */

var expand = module.exports = function expand(arr) {
  arr = Array.isArray(arr) ? arr : [arr];

  return arr.reduce(function (acc, str) {
    return acc.concat(braces(str));
  }, [])
};

console.log(expand(['{foo,bar}', '{baz,quux}']))