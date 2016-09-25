'use strict';

var bash = require('./bash');
var braces = require('../..');
var minimatch = require('minimatch');
var argv = require('yargs-parser')(process.argv.slice(2), {
  alias: {minimatch: 'm', mm: 'm'}
})

var reference = {
  bash: bash,
  minimatch: function() {
    return minimatch.braceExpand.apply(minimatch, arguments);
  },
  braces: require('braces'),
};

module.exports = function(str, options) {
  var fn = argv.m ? reference.minimatch : bash;
  if (options.minimatch !== false && options.bash === false) {
    return braces.expand.apply(braces, arguments);
  }
  return fn.apply(null, arguments);
}
