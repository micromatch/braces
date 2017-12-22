var braces = require('..');

var ast = braces.parse('a/{\\{b,c,d},z}/e', {unescape: false});
var str = '';
console.log(ast);

visit(ast, function(node) {
  if (node.val) str += node.val;
});

function visit(node, fn) {
  return node.nodes ? mapVisit(node, fn) : fn(node);
}

function mapVisit(node, fn) {
  for (var i = 0; i < node.nodes.length; i++) {
    visit(node.nodes[i], fn);
  }
  return node;
}
