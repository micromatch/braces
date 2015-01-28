'use strict';

/**
 * Export `regex`
 */

var regex = module.exports;

regex.delims = {
  extglob: /([?*+@!]{1})(\(([^)]+)\))/,
  bracesAdv: /(.|^)\{([^\\\/}]*)(?:\}[^\\\/}]*|([^}]*))\}/,
  braces: /([$\\]?)\{([^{]*?)\}/,
};

/**
 * Syntax characters. Minimum required to validate
 * that a syntax is present.
 */

regex.ch = {
  glob: /\*/,
  extglob: /[!?*+@][\(\[]/,
  braces: /\{/,
};

regex.escapeRegex = {
  glob: /\\\*/,
  extglob: /\\\(/,
  braces: /\\{/
};

regex.escapeRegex = {
  '\\*': /\\\*/g,
  '\\,': /\\,/g,
  '\\(': /\\\(/g,
  '\\[': /\\\[/g,
  '\\{': /\\{/g,
  '${': /\\{/g,
};
