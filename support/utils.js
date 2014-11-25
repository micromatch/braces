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

    str.replace(/^\.\n([\s\S]*?)^\.\n([\s\S]*?)^\.$/gm, function(__, pattern, expected, offset, orig) {
      var line = orig.slice(0, offset).split(/\n/g).length;
      var unit = lines[line - 2] + '\n' + __;

      console.log('expand("' + pattern + '").should.eql([' + expected.split('\n').join(', ') + ']);')

      if (expected.split('\n').sort().join('\n').trim() === fn(pattern).sort().sort().join('').trim()) {
        pass.push(line + ': ' + unit);
      } else {
        fail.push(line + ': ' + unit);
      }
    });

    return {pass: pass, fail: fail};
  }
}

function writeUnits(name, fn) {
  var spec = 'test/fixtures/bash/spec.txt';
  var res = addSpecTests(spec, fn);
  var fail = res.fail.join('\n');
  var pass = res.pass.join('\n');

  write.sync('test/fixtures/' + name + '/good.txt', pass);
  write.sync('test/fixtures/' + name + '/bad.txt', fail);
}

writeUnits('braces', require('..'));
writeUnits('mm', require('minimatch').braceExpand);
