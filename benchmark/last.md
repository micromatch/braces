Benchmarking: (8 of 8)
 · combination-nested
 · combination
 · escaped
 · list-basic
 · list-multiple
 · no-braces
 · sequence-basic
 · sequence-multiple

# benchmark/fixtures/combination-nested.js (52 bytes)
  brace-expansion x 4,756 ops/sec ±1.09% (86 runs sampled)
  braces x 11,202,303 ops/sec ±1.06% (88 runs sampled)
  minimatch x 4,816 ops/sec ±0.99% (87 runs sampled)

  fastest is braces

# benchmark/fixtures/combination.js (51 bytes)
  brace-expansion x 625 ops/sec ±0.87% (87 runs sampled)
  braces x 11,031,884 ops/sec ±0.72% (90 runs sampled)
  minimatch x 637 ops/sec ±0.84% (88 runs sampled)

  fastest is braces

# benchmark/fixtures/escaped.js (44 bytes)
  brace-expansion x 163,325 ops/sec ±1.05% (87 runs sampled)
  braces x 10,655,071 ops/sec ±1.22% (88 runs sampled)
  minimatch x 147,495 ops/sec ±0.96% (88 runs sampled)

  fastest is braces

# benchmark/fixtures/list-basic.js (40 bytes)
  brace-expansion x 99,726 ops/sec ±1.07% (83 runs sampled)
  braces x 10,596,584 ops/sec ±0.98% (88 runs sampled)
  minimatch x 100,069 ops/sec ±1.17% (86 runs sampled)

  fastest is braces

# benchmark/fixtures/list-multiple.js (52 bytes)
  brace-expansion x 34,348 ops/sec ±1.08% (88 runs sampled)
  braces x 9,264,131 ops/sec ±1.12% (88 runs sampled)
  minimatch x 34,893 ops/sec ±0.87% (87 runs sampled)

  fastest is braces

# benchmark/fixtures/no-braces.js (48 bytes)
  brace-expansion x 275,368 ops/sec ±1.18% (89 runs sampled)
  braces x 9,134,677 ops/sec ±0.95% (88 runs sampled)
  minimatch x 3,755,954 ops/sec ±1.13% (89 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-basic.js (41 bytes)
  brace-expansion x 5,492 ops/sec ±1.35% (87 runs sampled)
  braces x 8,485,034 ops/sec ±1.28% (89 runs sampled)
  minimatch x 5,341 ops/sec ±1.17% (87 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-multiple.js (51 bytes)
  brace-expansion x 116 ops/sec ±0.77% (77 runs sampled)
  braces x 9,445,118 ops/sec ±1.32% (84 runs sampled)
  minimatch x 109 ops/sec ±1.16% (76 runs sampled)

  fastest is braces
