module.exports.validateInput = (line, {maxSymbols}) => {
  const symbols = {};

    for (const current of line) {
        symbols[current] = (symbols[current] || 0) + 1;
    }

    for (const [value, count] of Object.entries(symbols)) {
      if (count > maxSymbols)
        throw SyntaxError(`To many symbols '${value}'. Maximum: ${maxSymbols} allowed. Received: ${count}`);
    }
};
