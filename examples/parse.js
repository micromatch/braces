'use strict';

// const input = 'foo/{a,bar/{b,c},d}';
// const input = 'a/{b,c{x,y}}/d';
// const input = '{{x,y},/{b,c{x,y}d,e}/f}';
// const input = '{{a,b}/{b,c{x,y}d,e}/f,x,z}';
// const input = 'a/{b,c}/d';
// const ast = parse(input);
// console.log(ast)
// console.log(JSON.stringify(ast.queue));
// console.log('EXPECTED:', [ 'a/b/f', 'a/cxd/f', 'a/cyd/f', 'a/e/f' ]);
// console.log(JSON.stringify(ast, null, 2))
// console.log(expand(ast));
// expand(ast);

// const sets = parse('foo/{a/b,{c,d,{x..z},e},f}/bar');
// const sets = parse('{a,{c,d}');
// console.log(sets.nodes[2]);
// console.log(compile(sets));

// const range = parse(']{a..e,z}');
// console.log(range.nodes[2]);
// console.log(braces.expand(']{a..e,z}'))
// console.log(compile(range));
// console.log(parse('[abc]'))
