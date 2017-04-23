'use strict';

var assert = require('assert');
var braces = require('..');

function equal(pattern, expected, options) {
  var actual = braces.expand(pattern, options).sort();
  assert.deepEqual(actual, expected.sort(), pattern);
}

describe('integration', function() {
  it('should work with dots in file paths', function() {
    equal('../{1..3}/../foo', ['../1/../foo', '../2/../foo', '../3/../foo']);
    equal('../{2..10..2}/../foo', ['../2/../foo', '../4/../foo', '../6/../foo', '../8/../foo', '../10/../foo']);
    equal('../{1..3}/../{a,b,c}/foo', ['../1/../a/foo', '../2/../a/foo', '../3/../a/foo', '../1/../b/foo', '../2/../b/foo', '../3/../b/foo', '../1/../c/foo', '../2/../c/foo', '../3/../c/foo']);
    equal('./{a..z..3}/', ['./a/', './d/', './g/', './j/', './m/', './p/', './s/', './v/', './y/']);
    equal('./{"x,y"}/{a..z..3}/', ['./{x,y}/a/', './{x,y}/d/', './{x,y}/g/', './{x,y}/j/', './{x,y}/m/', './{x,y}/p/', './{x,y}/s/', './{x,y}/v/', './{x,y}/y/']);
  });

  it('should expand a complex combination of ranges and sets:', function() {
    equal('a/{x,y}/{1..5}c{d,e}f.{md,txt}', ['a/x/1cdf.md', 'a/y/1cdf.md', 'a/x/2cdf.md', 'a/y/2cdf.md', 'a/x/3cdf.md', 'a/y/3cdf.md', 'a/x/4cdf.md', 'a/y/4cdf.md', 'a/x/5cdf.md', 'a/y/5cdf.md', 'a/x/1cef.md', 'a/y/1cef.md', 'a/x/2cef.md', 'a/y/2cef.md', 'a/x/3cef.md', 'a/y/3cef.md', 'a/x/4cef.md', 'a/y/4cef.md', 'a/x/5cef.md', 'a/y/5cef.md', 'a/x/1cdf.txt', 'a/y/1cdf.txt', 'a/x/2cdf.txt', 'a/y/2cdf.txt', 'a/x/3cdf.txt', 'a/y/3cdf.txt', 'a/x/4cdf.txt', 'a/y/4cdf.txt', 'a/x/5cdf.txt', 'a/y/5cdf.txt', 'a/x/1cef.txt', 'a/y/1cef.txt', 'a/x/2cef.txt', 'a/y/2cef.txt', 'a/x/3cef.txt', 'a/y/3cef.txt', 'a/x/4cef.txt', 'a/y/4cef.txt', 'a/x/5cef.txt', 'a/y/5cef.txt']);
  });

  it('should expand complex sets and ranges in `bash` mode:', function() {
    equal('a/{x,{1..5},y}/c{d}e', ['a/x/c{d}e', 'a/1/c{d}e', 'a/2/c{d}e', 'a/3/c{d}e', 'a/4/c{d}e', 'a/5/c{d}e', 'a/y/c{d}e']);
  });
});
