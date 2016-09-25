'use strict';

var bash = require('./bash');
var braces = require('../..');
var extend = require('extend-shallow');
var minimatch = require('minimatch');
var argv = require('yargs-parser')(process.argv.slice(2), {
  alias: {minimatch: 'm', mm: 'm'}
})

var reference = {
  bash: bash,
  minimatch: function() {
    return minimatch.braceExpand.apply(minimatch, arguments);
  },
};

module.exports = function(str, options) {
  var opts = extend({}, options);
  var fn = argv.m ? reference.minimatch : reference.bash;
  if (opts.minimatch !== false && opts.bash === false) {
    fn = reference.minimatch;
  }
  if (opts.minimatch === false && opts.bash === false) {
    return braces.apply(braces, arguments);
  }
  return fn.apply(null, arguments);
};
