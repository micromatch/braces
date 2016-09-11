'use strict';

var utils = require('./lib/utils');
var braces = [];
var before = [];

function parse(input) {
  var prevNode = {type: 'bos', val: ''};
  var node;
  var stack = [];
  var ast = [{type: 'root', nodes: [prevNode]}];
  var len = input.length;
  var idx = -1;

  while (++idx < len) {
    var ch = input[idx];
    var prev = stack.length ? utils.last(stack) : utils.last(ast);
    var last = prev.nodes && utils.last(prev.nodes);
    node = { val: ch };

    utils.define(node, 'parent', prev);

    if (ch === '{') {
      before.unshift(prev);

      node.type = 'brace.open';
      var tok = {
        type: 'brace',
        nodes: [node]
      };

      utils.define(tok, 'parent', prev);
      prev.nodes.push(tok);
      stack.push(tok);

    } else if (ch === '}') {
      var open = stack.pop();
      if (open.type !== 'brace') {
        throw new Error('missing opening "}"');
      }

      node.type = 'brace.close';
      open.nodes.push(node);
      braces.unshift(tok);

    } else {
      if (last && last.type === 'text') {
        last.val += ch;
      } else {
        node.type = 'text';
        prev.nodes.push(node);
      }
    }

    utils.define(prevNode, 'next', node);
    utils.define(node, 'prev', prevNode);
    prevNode = node;
  }

  var eos = {type: 'eos', val: ''};
  utils.define(prevNode, 'next', eos);
  ast[0].nodes.push(eos);

  ast[0].orig = input;
  return ast[0];
}


function Compiler(options, state) {
  this.options = options || {};
  this.compilers = {};
  this.output = '';
  this.set('eos', function(node) {
    return node.val;
  });
  this.set('bos', function(node) {
    return node.val;
  });
}

/**
 * Prototype methods
 */

Compiler.prototype = {

  /**
   * Throw an error message with details including the cursor position.
   * @param {String} `msg` Message to use in the Error.
   */

  error: function(msg, node) {
    var pos = node.position || {start: {column: 0}};
    var message = this.options.source + ' column:' + pos.start.column + ': ' + msg;

    var err = new Error(message);
    err.reason = msg;
    err.column = pos.start.column;
    err.source = this.pattern;

    if (this.options.silent) {
      this.errors.push(err);
    } else {
      throw err;
    }
  },

  /**
   * Emit `node.val`
   */

  emit: function(str) {
    this.output += str;
    return str;
  },

  /**
   * Add a compiler `fn` with the given `name`
   */

  set: function(name, fn) {
    this.compilers[name] = fn;
    return this;
  },

  /**
   * Get the previous AST node.
   */

  prev: function(n) {
    return this.ast.nodes[this.idx - (n || 1)] || { type: 'bos' };
  },

  /**
   * Get the next AST node.
   */

  next: function(n) {
    return this.ast.nodes[this.idx + (n || 1)] || { type: 'eos' };
  },

  /**
   * Visit `node`.
   */

  visit: function(node, nodes, i) {
    var fn = this.compilers[node.type];
    if (typeof fn !== 'function') {
      throw this.error('compiler "' + node.type + '" is not registered', node);
    }
    return fn.call(this, node, nodes, i);
  },

  /**
   * Map visit over array of `nodes`.
   */

  mapVisit: function(nodes) {
    var len = nodes.length;
    var idx = -1;
    while (++idx < len) {
      this.visit(nodes[idx], nodes, idx);
    }
    return this;
  },

  /**
   * Compile `ast`.
   */

  compile: function(ast, options) {
    this.ast = ast;
    this.mapVisit(this.ast.nodes);
    return this;
  }
};

// var str = 'foo{bar,{a,b},qux}fez';
var str = 'a{b,c{d,e}f}g';

var ast = parse(str);
var compiler = new Compiler();
compiler.expected = 'abg acdfg acefg';
var state = {};
state.after = [];
state.before = [];
state.queue = [];
state.output = [];

// foobarfez fooafez foobfez fooquxfez
// abg acdfg acefg
compiler
  .set('bos', function(node) {
    // var foo = braces.pop();
    // var res = this.compile(foo);
    // console.log(res.output)
    // console.log(braces)
    // console.log(before)
    return this.emit(node.val, node);
  })

  .set('text', function(node) {
    var segs = node.val.split(',');

    if (node.next.type === 'brace.open') {
      console.log(node, segs, node.next)
      state.before.push(segs.pop());
    }

    if (node.prev.type === 'brace.close') {
      state.after.push(segs.shift());
    }

    state.queue.push.apply(state.queue, segs);
    return this.emit(node.val, node);
  })
  .set('brace', function(node) {
    this.mapVisit(node.nodes);
  })
  .set('brace.open', function(node) {
    return this.emit('', node);
  })
  .set('brace.close', function(node) {
    return this.emit('', node);
  })
  .set('eos', function(node) {
    var temp = [];
    state.queue.forEach(function(str) {
      before.forEach(function(ele) {
        temp.push(ele + str);
      });
    });

    state.queue = temp;
    temp = [];

    state.queue.forEach(function(str) {
      state.after.forEach(function(ele) {
        temp.push(str + ele);
      });
    });

    state.output = temp;
    return this.emit(node.val, node);
  })

// console.log(ast);
var res = compiler.compile(ast);
// console.log(res.ast);
