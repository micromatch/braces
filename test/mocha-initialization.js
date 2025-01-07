/**
 * @fileoverview
 * This package works with node@8.3.0, which does not have support for `assert.strict`.
 * This module is a shim to support these methods.
 *
 * @todo Remove this file when we drop support for node@8.3.0.
 */
const assert = require('assert');

if (assert.strict === undefined) {
  assert.strict = {
    ok: assert.ok,
    equal: assert.equal,
    deepEqual: assert.deepEqual,
    throws: assert.throws,
  };
}
