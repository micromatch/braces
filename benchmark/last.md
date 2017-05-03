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
  brace-expansion x 6,447 ops/sec ±1.16% (83 runs sampled)
  braces x 15,766,029 ops/sec ±1.32% (83 runs sampled)
  minimatch x 5,528 ops/sec ±1.18% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/combination.js (51 bytes)
  brace-expansion x 721 ops/sec ±1.11% (85 runs sampled)
  braces x 10,316,326 ops/sec ±1.77% (84 runs sampled)
  minimatch x 780 ops/sec ±1.29% (87 runs sampled)

  fastest is braces

# benchmark/fixtures/escaped.js (44 bytes)
  brace-expansion x 182,823 ops/sec ±1.00% (86 runs sampled)
  braces x 11,337,822 ops/sec ±1.20% (86 runs sampled)
  minimatch x 161,433 ops/sec ±1.26% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/list-basic.js (40 bytes)
  brace-expansion x 132,284 ops/sec ±0.79% (85 runs sampled)
  braces x 10,155,253 ops/sec ±1.28% (87 runs sampled)
  minimatch x 121,023 ops/sec ±1.37% (86 runs sampled)

  fastest is braces

# benchmark/fixtures/list-multiple.js (52 bytes)
  brace-expansion x 39,030 ops/sec ±1.09% (82 runs sampled)
  braces x 9,812,839 ops/sec ±1.23% (87 runs sampled)
  minimatch x 42,820 ops/sec ±1.54% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/no-braces.js (48 bytes)
  brace-expansion x 294,287 ops/sec ±1.25% (85 runs sampled)
  braces x 10,040,575 ops/sec ±1.48% (84 runs sampled)
  minimatch x 1,805,621 ops/sec ±1.12% (84 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-basic.js (41 bytes)
  brace-expansion x 7,151 ops/sec ±1.34% (85 runs sampled)
  braces x 9,545,979 ops/sec ±1.39% (83 runs sampled)
  minimatch x 7,458 ops/sec ±1.05% (84 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-multiple.js (51 bytes)
  brace-expansion x 133 ops/sec ±1.79% (73 runs sampled)
  braces x 9,371,152 ops/sec ±1.29% (87 runs sampled)
  minimatch x 139 ops/sec ±1.17% (76 runs sampled)

  fastest is braces
