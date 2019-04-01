'use strict';

const { Suite } = require('benchmark');
const colors = require('ansi-colors');
const argv = require('minimist')(process.argv.slice(2));
const minimatch = require('minimatch');
const braces = require('..');

/**
 * Setup
 */

const cycle = (e, newline) => {
  process.stdout.write(`\u001b[G  ${e.target}${newline ? `\n` : ''}`);
};

const bench = (name, options) => {
  const config = { name, ...options };
  const suite = new Suite(config);
  const add = suite.add.bind(suite);
  suite.on('error', console.error);

  if (argv.run && !new RegExp(argv.run).test(name)) {
    suite.add = () => suite;
    return suite;
  }

  console.log(colors.green(`● ${config.name}`));

  suite.add = (key, fn, opts) => {
    if (typeof fn !== 'function') opts = fn;

    add(key, {
      onCycle: e => cycle(e),
      onComplete: e => cycle(e, true),
      fn,
      ...opts
    });
    return suite;
  };

  return suite;
};

const skip = () => {};
skip.add = () => skip;
skip.run = () => skip;
bench.skip = name => {
  console.log(colors.cyan('● ' + colors.unstyle(name) + ' (skipped)'));
  return skip;
};

bench('expand - set')
  .add('   braces', () => braces.expand('foo/{a,b,c}/bar'))
  .add('minimatch', () => minimatch.braceExpand('foo/{a,b,c}/bar'))
  .run();

bench('expand - nested sets')
  .add('   braces', () => braces.expand('foo/{a,b,{x,y,z}}/bar'))
  .add('minimatch', () => minimatch.braceExpand('foo/{a,b,{x,y,z}}/bar'))
  .run();

bench('expand - range')
  .add('   braces', () => braces.expand('foo/{a..z}/bar'))
  .add('minimatch', () => minimatch.braceExpand('foo/{a..z}/bar'))
  .run();

bench('compile regex - set')
  .add('   braces', () => braces.makeRe(parse('foo/{a,b,c}/bar')))
  .add('minimatch', () => minimatch.makeRe('foo/{a,b,c}/bar'))
  .run();
