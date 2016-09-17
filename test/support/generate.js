'use strict';

var utils = require('../../lib/utils');
var spawn = require('cross-spawn');

function generate(pattern) {
  var cmd = pattern;
  if (!/echo/.test(cmd)) {
    cmd = `shopt -s extglob && shopt -s nullglob && echo ${escape(pattern)}`;
  }
  var res = spawn.sync('bash', ['-c', cmd]);
  var err = res.stderr.toString().trim();
  if (err) {
    console.error(cmd);
    throw new Error(err);
  }
  return unescape(res.stdout);
}

function escape(buf) {
  return buf.split(/\\? /).join('_SPACE_')
    .replace(/(\$\{)([^{}]+)(\})/g, function(m, $1, $2, $3) {
      return utils.nc[0] + $2 + utils.nc[2];
    });
}

function unescape(buf) {
  return buf.toString().split(/[ \n]/)
    .filter(Boolean)
    .map(function(str) {
      return utils.unescape(str)
        .split('_SPACE_').join(' ')
        .split('\\').join('');
    });
}

/**
 * Expose `generate`
 */

module.exports = generate;
