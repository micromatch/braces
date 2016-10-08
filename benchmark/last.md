Benchmarking: (7 of 7)
 · combination-nested
 · combination
 · escaped
 · list-basic
 · list-multiple
 · sequence-basic
 · sequence-multiple

# benchmark/fixtures/combination-nested.js (52 bytes)
  brace-expansion x 5,326 ops/sec ±1.19% (83 runs sampled)
  braces x 11,510,149 ops/sec ±1.38% (84 runs sampled)
  minimatch x 5,560 ops/sec ±1.18% (82 runs sampled)

  fastest is braces

# benchmark/fixtures/combination.js (51 bytes)
  brace-expansion x 637 ops/sec ±1.39% (84 runs sampled)
  braces x 10,902,159 ops/sec ±1.36% (86 runs sampled)
  minimatch x 686 ops/sec ±1.42% (81 runs sampled)

  fastest is braces

# benchmark/fixtures/escaped.js (44 bytes)
  brace-expansion x 157,111 ops/sec ±1.35% (83 runs sampled)
  braces x 11,238,206 ops/sec ±1.41% (85 runs sampled)
  minimatch x 175,069 ops/sec ±1.25% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/list-basic.js (40 bytes)
  brace-expansion x 105,715 ops/sec ±1.53% (85 runs sampled)
  braces x 11,668,861 ops/sec ±1.39% (85 runs sampled)
  minimatch x 103,579 ops/sec ±1.23% (88 runs sampled)

  fastest is braces

# benchmark/fixtures/list-multiple.js (52 bytes)
  brace-expansion x 35,800 ops/sec ±1.23% (85 runs sampled)
  braces x 9,853,090 ops/sec ±1.42% (82 runs sampled)
  minimatch x 34,487 ops/sec ±1.57% (83 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-basic.js (41 bytes)
  brace-expansion x 5,396 ops/sec ±1.44% (85 runs sampled)
  braces x 9,469,841 ops/sec ±1.33% (81 runs sampled)
  minimatch x 5,409 ops/sec ±1.48% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-multiple.js (51 bytes)
  brace-expansion x 105 ops/sec ±1.96% (70 runs sampled)
  braces x 8,603,064 ops/sec ±1.34% (82 runs sampled)
  minimatch x 116 ops/sec ±1.50% (72 runs sampled)

  fastest is braces
