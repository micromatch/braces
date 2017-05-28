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
  brace-expansion x 5,936 ops/sec ±1.15% (85 runs sampled)
  braces x 15,076,302 ops/sec ±1.14% (84 runs sampled)
  minimatch x 5,936 ops/sec ±1.39% (86 runs sampled)

  fastest is braces

# benchmark/fixtures/combination.js (51 bytes)
  brace-expansion x 632 ops/sec ±1.33% (86 runs sampled)
  braces x 13,059,942 ops/sec ±0.91% (89 runs sampled)
  minimatch x 771 ops/sec ±1.29% (87 runs sampled)

  fastest is braces

# benchmark/fixtures/escaped.js (44 bytes)
  brace-expansion x 177,138 ops/sec ±0.96% (88 runs sampled)
  braces x 10,775,925 ops/sec ±1.46% (85 runs sampled)
  minimatch x 147,911 ops/sec ±1.39% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/list-basic.js (40 bytes)
  brace-expansion x 132,550 ops/sec ±1.17% (88 runs sampled)
  braces x 12,421,008 ops/sec ±1.39% (87 runs sampled)
  minimatch x 115,527 ops/sec ±1.26% (87 runs sampled)

  fastest is braces

# benchmark/fixtures/list-multiple.js (52 bytes)
  brace-expansion x 40,855 ops/sec ±1.24% (87 runs sampled)
  braces x 8,878,850 ops/sec ±1.54% (85 runs sampled)
  minimatch x 39,669 ops/sec ±1.53% (83 runs sampled)

  fastest is braces

# benchmark/fixtures/no-braces.js (48 bytes)
  brace-expansion x 298,368 ops/sec ±1.15% (86 runs sampled)
  braces x 9,704,670 ops/sec ±1.37% (84 runs sampled)
  minimatch x 2,145,548 ops/sec ±1.17% (84 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-basic.js (41 bytes)
  brace-expansion x 7,381 ops/sec ±1.13% (84 runs sampled)
  braces x 9,401,818 ops/sec ±1.37% (88 runs sampled)
  minimatch x 6,574 ops/sec ±1.62% (87 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-multiple.js (51 bytes)
  brace-expansion x 131 ops/sec ±1.09% (77 runs sampled)
  braces x 9,042,941 ops/sec ±1.28% (88 runs sampled)
  minimatch x 140 ops/sec ±1.25% (76 runs sampled)

  fastest is braces
