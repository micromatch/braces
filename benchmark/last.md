Benchmarking: (6 of 6)
 · escape
 · multiple
 · nested
 · normal
 · range
 · ranges

# benchmark/fixtures/escape.js (42 bytes)
  brace-expansion x 86,633 ops/sec ±1.08% (82 runs sampled)
  braces x 8,413,921 ops/sec ±1.47% (86 runs sampled)
  minimatch x 91,438 ops/sec ±1.65% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/multiple.js (38 bytes)
  brace-expansion x 88,555 ops/sec ±1.43% (83 runs sampled)
  braces x 7,450,531 ops/sec ±1.43% (84 runs sampled)
  minimatch x 67,936 ops/sec ±1.23% (86 runs sampled)

  fastest is braces

# benchmark/fixtures/nested.js (39 bytes)
  brace-expansion x 67,551 ops/sec ±1.42% (86 runs sampled)
  braces x 7,086,549 ops/sec ±1.45% (81 runs sampled)
  minimatch x 66,975 ops/sec ±1.59% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/normal.js (38 bytes)
  brace-expansion x 141,188 ops/sec ±1.43% (83 runs sampled)
  braces x 6,728,393 ops/sec ±1.51% (83 runs sampled)
  minimatch x 130,210 ops/sec ±1.35% (87 runs sampled)

  fastest is braces

# benchmark/fixtures/range.js (39 bytes)
  brace-expansion x 91,959 ops/sec ±1.46% (87 runs sampled)
  braces x 6,549,020 ops/sec ±1.67% (85 runs sampled)
  minimatch x 82,684 ops/sec ±1.47% (84 runs sampled)

  fastest is braces

# benchmark/fixtures/ranges.js (49 bytes)
  brace-expansion x 6,002 ops/sec ±1.23% (86 runs sampled)
  braces x 7,424,642 ops/sec ±1.91% (82 runs sampled)
  minimatch x 4,155 ops/sec ±1.25% (85 runs sampled)
