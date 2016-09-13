'use strict';

var utils = require('./lib/utils');
var util = require('util');
var define = require('define-property');
var braces = require('braces');
var pad = require('pad-left');

function pointer(pos) {
  return pad('^', pos, ' ');
}

function join(a, b) {
  a = utils.arrayify(a);
  b = utils.arrayify(b);
  var len = a.length;
  var idx = -1;
  var arr = [];
  while (++idx < len) {
    var str = a[idx];
    for (var i = 0; i < b.length; i++) {
      arr.push(str + b[i]);
    }
  }
  return arr;
}


function parser(input) {
  var ast = {
    type: 'root',
    input: input,
    nodes: [{
      type: 'bos',
      val: ''
    }]
  };

  var nodes = [ast];
  var pairs = [];
  var pos = -1;

  function position(pos) {
    if (!pos) return;
    console.log('---');
    console.log(input);
    console.log(pointer(pos));
    console.log();
  }

  function prev() {
    return pairs.length ? utils.last(pairs) : utils.last(nodes);
  }

  function token(type, val) {
    var parent = prev();
    var tok = {type: type};
    if (typeof val === 'string') {
      tok.val = val;
    }
    define(tok, 'parent', parent);
    parent.nodes.push(tok);
    return tok;
  }

  function parse(str) {
    var len = str.length;

    while (++pos < len) {
      var val = str[pos];
      position(pos);

      if (val === '\\' || val === '"') {
        escape(str);
        continue;
      }

      if (val === '{') {
        openBrace(str);

      } else if (val === '}') {
        closeBrace(str);

      } else {
        text(str);
      }
    }
  }

  function text(str, i) {
    var parent = prev();
    var node = {};

    if (parent.nodes) {
      node = utils.last(parent.nodes);
    }

    var val = str[pos];
    while (str[pos + 1] && !/[{}]/.test(str[pos + 1])) {
      val += str[++pos];
      position(pos);
    }

    if (node.type === 'text') {
      node.val += val;
    } else {
      token('text', val);
    }
  }

  function escape(str) {
    var node = prev();
    var val = '\\' + str[++pos];

    if (node.type === 'text') {
      node.val += val;
    } else {
      token('text', val);
    }
  }

  function openBrace(str) {
    var parent = prev();

    Object.defineProperty(parent, 'total', {
      configurable: true,
      get: function() {
        var len = 0;
        this.nodes.forEach(function(node) {
          if (node.type === 'brace') {
            len++;
          }
        });
        return len;
      }
    });

    var brace = {
      type: 'brace',
      nodes: []
    };

    var open = {
      type: 'brace.open',
      val: '{'
    };

    define(open, 'parent', brace);
    define(brace, 'parent', parent);
    brace.nodes.push(open);
    parent.nodes.push(brace);
    pairs.push(brace);
  }

  function closeBrace(str) {
    var parent = pairs.pop();
    if (parent && parent.type === 'brace') {
      var tok = {type: 'brace.close', val: '}'};
      define(tok, 'parent', parent);
      parent.nodes.push(tok);
    }
    return parent;
  }

  parse(input);
  var brace = pairs.pop();
  if (brace) {
    brace.escaped = true;
  }

  token('eos', '');
  return ast;
}

function render(ast) {
  var nodesLength = 0;
  var groups = [];
  var queue = [];
  var stash = [];
  var pairs = 1;
  var depth = 1;
  var fns = [];
  var prev;

  function set(name, fn) {
    fns[name] = fn;
  }

  function visit(node) {
    var fn = fns[node.type];
    if (typeof fn !== 'function') {
      throw new Error(`compiler "${node.type}" is not registered`);
    }
    return fn(node);
  }

  /**
   * Map visit over array of AST `nodes`
   */

  function mapVisit(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      define(node, 'prev', nodes[i - 1] || prev);
      define(node, 'next', nodes[i + 1]);
      visit(node, nodes, i);
      if (!node.nodes) {
        // console.log(node)
      }
      prev = node;
    }
  }

  function stashed(stash) {
    var ele = utils.last(stash);
    if (Array.isArray(ele) && Array.isArray(utils.last(ele))) {
      return stashed(ele);
    }
    return ele;
  }

  set('bos', function(node) {
  });

  set('text', function(node) {
    var segs = [node.val];

    if (node.parent.type === 'brace' && /(,|\.\.)/.test(node.val)) {
      var expanded = utils.expand(node.val, {toRegex: false, stringify: false});
      segs = expanded.val || '\\{' + expanded.segs + '\\}';
    }

    var last = stashed(stash);
    if (stash.length && last.length) {

      var arr = join(last, segs);
      var prev = node.parent.prev;
      if (prev && prev.type === 'text') {
        if (prev.val.slice(-1) === ',') {
          arr = [arr];
        } else if (depth > 1) {

          // console.log(prev)
          // console.log('LAST:', last);
          // console.log('SEGS:', segs);
          // console.log('STASH:', stash);
          queue = queue.concat(join(queue.pop(), segs));
          // console.log('QUEUE:', queue);
          // console.log('ARR:', arr);
          if (queue.length) {
            arr = [];
          }
          // arr = [join(queue.pop(), segs)];
        }
      }


      queue.push.apply(queue, arr);
    } else {
      queue.push.apply(queue, segs);
    }
  });

  set('brace', function(node) {
    return mapVisit(node.nodes);
  });

  set('brace.open', function(node) {
    var prev = node.parent.prev;

    if (depth > 1 && prev && prev.type === 'text' && prev.val.slice(-1) !== ',') {

      if (node.parent.parent.total > 1) {
        var tmp = queue.slice();
        stashed(stash).push(queue);
        queue = stash.pop();
        queue[queue.length - 1] = tmp;
      }

    } else if (depth > 1 && queue.length > 1) {
      stash.push(queue.slice(queue.length - 1));
      queue = queue.slice(0, queue.length - 1);

    } else {
      stash.push(queue.slice());
      queue = [];
    }
    depth++;
  });

  set('brace.close', function(node) {
    if (queue.length) {
      stash.push(queue.slice());
      queue = [];
    }
    depth--;
  });

  set('eos', function(node) {
    if (node.prev.type !== 'text') {
      queue = stash.pop();
    }
  });

  mapVisit(ast.nodes);
  return queue;
}

var strings = [
  'a{b,c,d{e,f}}g/a{b,d}',
  'a{b,c}d/e{f,g}',
  'a/b/{b,c{d,e{f,g}}}/h/i',
  'a{b,c}g/a',
  'a{b\\,c}g/a',
  'a{b,c,d{e,f}}ghi',
  'a/{a,b,c}/{b,g}',
  'a/{a,b,c,{d,e}/{f,g}}/h'
];

var str = strings[0];
var ast = parser(str);
var res = render(ast);
// console.log(JSON.stringify(ast, null, 2));

// console.log(ast)

console.log();
console.log('---');
console.log('result  ', res.sort());
console.log('expected\n', braces(str).sort());
console.log('string', str);
console.log('exact', util.inspect(braces(str).sort()) === util.inspect(res.sort()));
