

// var re = /.*(?:[^$]*)((.|^)\{([^}]*)\})/;
// var re = /(.|^)(\{(.)([^}]*)\})/;
var re = /(.|^)\{([^\\\/}]*)(?:\}[^\\\/}]*|([^}]*))\}/;

var braces = [
  'a{b,}c',
  'a{b,c/*/../d}e',
  'a{b\\,c}d',
  'a{b\\,c\\,d}e',
  'a{b,c,d,\\,e}e',
  'a${b,d}/{e,f}/\\{g,h}c',
  // 'a\\{b,d}/${e,f}/\\{g,h}c',
  'a${b,d}',
  'a{a..c}',
  // '{"x,x"}',
  // '{a-{b,c,d}}',
  // 'abc/${ddd}/xyz',
  // 'a{b}c',
  // 'a/b/c{d}e',
  // '{a-{b,c,d}}',
  // '{}',
  // '}',
  // '{',
  // '{,}'
];

braces.forEach(function (str) {
  console.log(re.exec(str));
});
