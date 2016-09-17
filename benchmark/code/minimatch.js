var braceExpand = require('minimatch').braceExpand;
module.exports = function(args) {
  return braceExpand.apply(null, Array.isArray(args) ? args : [args]);
};
