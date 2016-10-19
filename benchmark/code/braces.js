var braces = require('../..');
module.exports = function(args) {
  return braces.apply(null, Array.isArray(args) ? args : [args]);
};
