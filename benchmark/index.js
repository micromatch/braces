'use strict';

var path = require('path');
var util = require('util');
var cyan = require('ansi-cyan');
var argv = require('yargs-parser')(process.argv.slice(2));
var Suite = require('benchmarked');

function run(type, fixtures) {
  var suite = new Suite({
    cwd: __dirname,
    fixtures: `fixtures/${fixtures}.js`,
    code: `code/${type}.js`
  });

  if (argv.dry) {
    suite.dryRun(function(code, fixture) {
      console.log(cyan('%s > %s'), code.key, fixture.key);
      var args = require(fixture.path);
      var res = code.run(args);
      // if (Array.isArray(res)) {
      //   res = res.length;
      // }
      console.log(util.inspect(res, null, 10));
      console.log();
    });
  } else {
    suite.run();
  }
}

run(argv._[0] || '*', argv._[1] || '*');
