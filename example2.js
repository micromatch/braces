
var strings = [
  'a/{b,c}',
  'a/{b,c}d{e,f}/g',
  'a/{b,c}{e,f}/g',
  'a/\\{{b,c}{e,f}/g',
  'a/{b,c\\}}{e,f}/g',
  'a/{b,c,d}{e,f}/g',
  'a/{b,c\\,d}{e,f}/g',
  'a/\\{b,c,d}{e,f}/g',
  '{generate,{assemble,update,verb}{file,-generate-*},generator}.js',
  'a/{b,c}{e,f}{g,h,i}/k',
  'a/{b,{c,d},e}/f',
  'a/{b,{c,d}/{e,f},g}/h',
  'a/{b{c,d},e{f,g}h{i,j}}/k',
  'a/{b{c,d},e}/f', // [ 'a/bc/f', 'a/bd/f', 'a/e/f' ]
  'a/{b{c,d}e{f,g}h{i,j}}/k',
  'a/{x,z}{b,{c,d}/{e,f},g}/h',
  'a/b/{b,c,{d,e{f,g},{w,x}/{y,z}}}/h/i',
  'a/{{a,b}/{c,d}}/z',
  'a/{{b,c}/{d,e}}',
  'a/{{b,c}/{d,e}}/f',
  '{a,b,{c,d},e}',
  '{a,b,{c,d}e}',
  '{a,b,{c,d}}',
  '{a,b{c,d}}',
  '{a,b}/{c,d}',
  '{a,b}{c,d}',
  '{b{c,d},e}',
  '{b{c,d},e}/f',
  '{{a,b},{c,d}}',
  '{{a,b}/{c,d}}',
  '{{a,b}/{c,d}}/z',
].forEach(function(str) {
  var ast = parser(str);
  var res = compile(ast);
  var a = util.inspect(res.sort(), null, 10);
  var arr = braces(str).map(function(str) {
    return str.replace(/\\?([{}])/g, '\\$1');
  })
  var b = util.inspect(arr.sort(), null, 10);
  if (a !== b) {
    console.log(str)
    console.log(a === b);
    console.log(a, b);
    console.log('---')
  }
});
