Benchmarking: (7 of 7)
 · escape
 · multiple
 · nested
 · normal
 · range
 · ranges
 · sets

# benchmark/fixtures/escape.js (42 bytes)
  brace-expansion x 94,818 ops/sec ±1.27% (85 runs sampled)
  braces x 6,048,506 ops/sec ±1.57% (85 runs sampled)
  minimatch x 86,119 ops/sec ±1.54% (84 runs sampled)

  fastest is braces

# benchmark/fixtures/multiple.js (38 bytes)
  brace-expansion x 92,090 ops/sec ±1.33% (85 runs sampled)
  braces x 5,443,935 ops/sec ±1.38% (84 runs sampled)
  minimatch x 78,065 ops/sec ±1.26% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/nested.js (39 bytes)
  brace-expansion x 67,944 ops/sec ±1.20% (85 runs sampled)
  braces x 5,505,548 ops/sec ±1.28% (82 runs sampled)
  minimatch x 65,146 ops/sec ±1.44% (83 runs sampled)

  fastest is braces

# benchmark/fixtures/normal.js (38 bytes)
  brace-expansion x 131,066 ops/sec ±1.43% (84 runs sampled)
  braces x 5,219,862 ops/sec ±1.32% (83 runs sampled)
  minimatch x 133,832 ops/sec ±1.47% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/range.js (39 bytes)
  brace-expansion x 87,936 ops/sec ±1.62% (86 runs sampled)
  braces x 5,340,487 ops/sec ±1.55% (85 runs sampled)
  minimatch x 90,769 ops/sec ±1.20% (87 runs sampled)

  fastest is braces

# benchmark/fixtures/ranges.js (49 bytes)
  brace-expansion x 6,272 ops/sec ±1.34% (85 runs sampled)
  braces x 5,725,516 ops/sec ±1.47% (85 runs sampled)
  minimatch x 5,773 ops/sec ±1.27% (83 runs sampled)

  fastest is braces

# benchmark/fixtures/sets.js (52 bytes)
  brace-expansion x 39,163 ops/sec ±1.62% (83 runs sampled)
  braces x 5,892,748 ops/sec ±1.52% (86 runs sampled)
  minimatch x 41,328 ops/sec ±1.46% (82 runs sampled)

  fastest is braces
