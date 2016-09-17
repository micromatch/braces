'use strict';

var inspect = require('stringify-object');

function stringify(config, options) {
  options = options || {};
  var str = inspect(config, {singleQuotes: true, indent: '  '});
  var res = indentArray(str);
  if (options.newlines === false) {
    return res.split(/\s*\n+\s*/).join(' ');
  }
  return res;
}

function indentArray(str, n) {
  var re = /: \[(\n(\s+)('[^\n\]]+',?(?=\n))([\n\s]+\])?)+/;
  var m;
  while ((m = re.exec(str))) {
    str = str.split(m[0]).join(m[0].replace(/\s+/g, ' '));
  }
  return str;
}

module.exports = stringify;
