'use strict';

var fs = require('fs');
var path = require('path');
var write = require('write');

function addSpecTests(fp, fn) {
  if (fs.statSync(fp).isFile()) {
    var str = fs.readFileSync(fp, 'utf8');
    str = str.replace(/→/g, '\t').replace(/\r/g, '');

    var lines = str.split('\n');
    var pass = [];
    var fail = [];

    var results = {};
    var units = "describe('bash 4.3 unit tests:', function () {\n";
    var i = 0;

    str.replace(/^\.\n([\s\S]*?)^\.\n([\s\S]*?)^\.$/gm, function(__, pattern, expected, offset, orig) {
      var line = orig.slice(0, offset).split(/\n/g).length;
      var unit = lines[line - 2] + '\n' + __;

      expected = expected.replace(/^\[|\]$/gm, '').split('\n').filter(Boolean);

      units += "  it('unit " + i++ + "', function () {\n";
      units += '    expand("' + pattern.trim() + '").should.eql(' + JSON.stringify(expected.sort()) + ');\n';
      units += "  });\n";
    });

    units += '});\n';
    return units;
  }
}

function addArrayTests(fp, fn) {
  if (fs.statSync(fp).isFile()) {
    var str = fs.readFileSync(fp, 'utf8');
    str = str.replace(/→/g, '\t').replace(/\r/g, '');

    var lines = str.split('\n');
    var pass = [];
    var fail = [];

    var results = {};
    var units = '';
    var i = 0;

    str.replace(/^\.\n([\s\S]*?)^\.\n([\s\S]*?)^\.$/gm, function(__, pattern, expected, offset, orig) {
      var line = orig.slice(0, offset).split(/\n/g).length;
      var unit = lines[line - 2] + '\n' + __;
      expected = expected.replace(/^\[|\]$/gm, '').split('\n').filter(Boolean);
      units += '  ["' + pattern.trim() + '", ' + JSON.stringify(expected.sort()) + '],\n';
    });

    return units;
  }
}

function writeUnits(name, fn) {
  var spec = './units.txt';
  // var res = addSpecTests(spec, fn);
  var res = addArrayTests(spec, fn);
  console.log(res)
  // var fail = res.fail.join('\n');
  // var pass = res.pass.join('\n');

  // write.sync('./temp/' + name + '/good.txt', pass);
  // write.sync('./temp/' + name + '/bad.txt', fail);
}

writeUnits('braces', require('./'));
// writeUnits('mm', require('minimatch').braceExpand);
