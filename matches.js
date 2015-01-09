/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module dependencies
 */

var expandRange = require('expand-range');

/**
 * Expose `braces`
 */

module.exports = braces;

/**
 * Expand brace patterns in the given `string`.
 *
 * @param  {String} `string`
 * @param  {Function} `fn`
 * @return {Array}
 */

function braces(str, arr, fn) {
  if (typeof str !== 'string') {
    throw new TypeError('braces expects a string as the first argument.');
  }

  if (typeof arr === 'function') {
    fn = arr;
    arr = [];
  }

  arr = arr || [];

  // var matches = /\\|\$\{|(?:[\\\/]\.)|['"]|\.\.|([^$]\{([^}]*)\})/.exec(str);
  // var matches = /\\|(?:[\\\/]\.)|['"]|(.*[^$]*(\{([^}]*\.\.[^}]*)\}))|(.*[^$]*(\{([^}]*)\}))/.exec(str);
  // console.log(matches[4])
  var matches = /.*(?:[^$]*)((.|^)(\{([^}]*)\}))/.exec(str);
  // console.log(matches)
  // if (matches) {
  //   var inner = matches[4];

  //   if (inner === '' || inner == null) {
  //     return [str];
  //   }

  //   var tokens = /(,|\.\.)/.exec(inner);
  //   if (tokens) {
  //     var token = tokens[0];

  //     if (token === '..') {

  //     }

  //     if (token === ',') {
  //       var paths = inner.split(',');
  //       var len = paths.length;
  //       var i = 0, val, idx;

  //       while (len--) {
  //         var path = paths[i++];
  //         if (!path) {
  //           return [str];
  //         }

  //         val = splice(str, matches[3], path);
  //       console.log(val)
  //         idx = val.indexOf('{');

  //         if (idx !== -1) {
  //           arr = braces(val, arr);
  //         } else {
  //           // push into the array, but avoid duplicates
  //           if (arr.indexOf(val) === -1) {
  //             arr.push(val);
  //           }
  //         }
  //       }
  //       return arr;
  //     }
  //   }
  //   // console.log(matches)
  //   // var m = matches[0];
  //   // var idx = matches.index;
  //   // var paths;

  //   // if (m === '\'' || m === '"') {
  //   //   var commentRe = /^'([^'\\]*\\.)*[^']*'|"([^"\\]*\\.)*[^"]*"/;
  //   //   var comment = commentRe.exec(str);
  //   //   console.log(comment)
  //   //   if (comment !== -1) {
  //   //     str = replaceAll(str, comment, 1, '', '\\');
  //   //     return [str];
  //   //   }
  //   // }

  //   // if (m === '\\') {
  //   //   str = replaceAll(str, idx, 1, '', '\\');
  //   //   return [str];
  //   // }

  //   // // if (m === '${') {
  //   // //   return [str];
  //   // // }

  //   // if (m === '/.') {

  //   // }

  //   //   console.log(matches)
  //   // if (matches[3]) {
  //   //   paths = expandRange(str, fn);
  //   // }

  //   // if (matches[5] && matches[5][0] === '{') {
  //   //   var inner = matches[6];
  //   //   arr = arr || [];

  //   //   if (inner === '') {
  //   //     return [str];
  //   //   } else {
  //   //     paths = inner.split(',');
  //   //   }

  //   //   // return invalid paths on an object
  //   //   if (typeof paths === 'object' && !Array.isArray(paths)) {
  //   //     return paths.bad;
  //   //   }

  //   //   var len = paths.length;
  //   //   var i = 0, val, idx;

  //   //   while (len--) {
  //   //     val = splice(str, matches[5], paths[i++]);
  //   //     idx = val.indexOf('{');

  //   //     if (idx !== -1) {
  //   //       arr = braces(val, arr);
  //   //     } else {
  //   //       // push into the array, but avoid duplicates
  //   //       if (arr.indexOf(val) === -1) {
  //   //         arr.push(val);
  //   //       }
  //   //     }
  //   //   }
  //   //   return arr;
  //   // }
  // } else {
  //   return [str];
  // }

  var match = str.match(bracesRegex());
  // console.log(match)
  if (match == null) {
    return [str];
  }


  arr = arr || [];
  var paths;
  var inner = match[2];

  // if `..` exists, pass to [expand-range]
  if (/[^\\\/]\.\./.test(inner)) {
    paths = expandRange(inner, fn);
  } else if (inner === '') {
    return [str];
  } else {
    paths = inner.split(',');
  }

  var len = paths.length;
  var i = 0, val, idx;

  while (len--) {
    val = splice(str, match[1], paths[i++]);
    idx = val.indexOf('{');

    if (idx !== -1) {
      arr = braces(val, arr);
    } else {
      // push into the array, but avoid duplicates
      if (arr.indexOf(val) === -1) {
        arr.push(val);
      }
    }
  }
  return arr;
}

/**
 * Braces regex.
 */

function bracesRegex() {
  return /.*(?:[^$]*)(\{([^}]*)\})/;
}

/**
 * Expand brace patterns with spaces. In command line
 * applications, like Bash, spaces are used as parameter
 * separators. But in file paths we can't make the same
 * assumption.
 *
 * @param {String} `str`
 * @return {Array} Array of expanded strings
 */

function expandSpaces(str, options) {
  // var segments = str.split(/[ \t]/);
  // if (segments.length) {
  //   var len = segments.length;
  //   var i = 0;

  //   while (len--) {
  //     var segment = segments[i++];
  //     arr = arr.concat(braces(segment, arr));
  //   }
  //   return arr;
  //   // return expandSpaces(segments);
  // }
  var arr = [];
  return str.split(' ')
    .reduce(function (acc, ele) {
      acc = acc.concat(braces(ele, arr));
      return acc;
    }, []);
}

/**
 * Faster alternative to `String.replace()`
 */

function splice(str, token, replacement) {
  var i = str.indexOf(token);
  var end = i + token.length;
  return str.substr(0, i)
    + replacement
    + str.substr(end);
}

/**
 * Faster alternative to `String.replace()`
 */

function replace(str, i, len, replacement) {
  var end = i + len;
  return str.substr(0, i)
    + replacement
    + str.substr(end);
}

/**
 * Faster alternative to `String.replace()`
 */

function replaceAll(str, i, len, replacement, token) {
  str = replace(str, i, len, replacement);
  i = str.indexOf(token);
  if (i !== -1) {
    return replaceAll(str, i, len, replacement, token);
  }
  return str;
}
