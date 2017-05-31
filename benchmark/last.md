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
  brace-expansion x 5,605 ops/sec ±1.14% (83 runs sampled)
  braces x 14,410,490 ops/sec ±1.15% (85 runs sampled)
  minimatch x 5,977 ops/sec ±1.28% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/combination.js (51 bytes)
  brace-expansion x 755 ops/sec ±1.18% (83 runs sampled)
  braces x 10,759,364 ops/sec ±0.94% (85 runs sampled)
  minimatch x 723 ops/sec ±0.98% (84 runs sampled)

  fastest is braces

# benchmark/fixtures/escaped.js (44 bytes)
  brace-expansion x 189,901 ops/sec ±1.23% (86 runs sampled)
  braces x 10,832,036 ops/sec ±0.89% (85 runs sampled)
  minimatch x 150,475 ops/sec ±1.29% (88 runs sampled)

  fastest is braces

# benchmark/fixtures/list-basic.js (40 bytes)
  brace-expansion x 126,961 ops/sec ±0.70% (85 runs sampled)
  braces x 11,004,254 ops/sec ±1.29% (84 runs sampled)
  minimatch x 111,199 ops/sec ±1.26% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/list-multiple.js (52 bytes)
  brace-expansion x 36,894 ops/sec ±0.70% (86 runs sampled)
  braces x 8,609,924 ops/sec ±1.03% (85 runs sampled)
  minimatch x 41,010 ops/sec ±1.17% (88 runs sampled)

  fastest is braces

# benchmark/fixtures/no-braces.js (48 bytes)
  brace-expansion x 309,785 ops/sec ±0.82% (88 runs sampled)
  braces x 8,709,136 ops/sec ±1.23% (88 runs sampled)
  minimatch x 2,208,995 ops/sec ±1.03% (88 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-basic.js (41 bytes)
  brace-expansion x 6,236 ops/sec ±0.94% (83 runs sampled)
  braces x 9,241,779 ops/sec ±1.26% (83 runs sampled)
  minimatch x 7,230 ops/sec ±1.35% (85 runs sampled)

  fastest is braces

# benchmark/fixtures/sequence-multiple.js (51 bytes)
  brace-expansion x 133 ops/sec ±1.08% (73 runs sampled)
  braces x 8,859,756 ops/sec ±1.31% (85 runs sampled)
  minimatch x 135 ops/sec ±0.94% (73 runs sampled)

  fastest is braces
