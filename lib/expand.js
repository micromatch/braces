'use strict';

const stringify = require('./stringify');

// let append = (stash, value) => {
//   let len = stash.length;

//   if (stash[len - 1] === '') {
//     stash[len - 1] = value;
//     return;
//   }

//   if (len) {
//     for (let i = 0; i < len; i++) {
//       stash[i] += value
//     }
//   } else {
//     stash.push(value);
//   }
// };

/**
 * Flatten an array
 */

const flatten = (...args) => {
  const result = [];
  const flat = arr => {
    for (let i = 0; i < arr.length; i++) {
      let ele = arr[i];
      Array.isArray(ele) ? flat(ele, result) : ele !== void 0 && result.push(ele);
    }
    return result;
  };
  flat(args);
  return result;
};

const append = (queue, stash) => {
  let result = [];

  queue = [].concat(queue || []);
  stash = [].concat(stash || []);

  if (!queue.length) return stash;
  if (!stash.length) return queue;

  for (let item of queue) {
    if (Array.isArray(item)) {
      for (let i = 0; i < item.length; i++) {
        item[i] = append(item[i], stash);
      }
      result.push(item);
    } else {
      for (let ele of stash) {
        result.push(Array.isArray(ele) ? append(item, ele) : (item + ele));
      }
    }
  }
  return result;
};

const expand = ast => {
  console.log(ast)
  console.log(ast.nodes.find(node => node.type === 'brace'));

  let walk = (node, parent = {}) => {
    if (node.commas === 0 && node.ranges === 0) {
      parent.queue.push(stringify(node));
      return;
    }

    node.queue = [];

    for (let child of node.nodes) {
      if (child.type === 'comma') {
        node.queue.push('');
        continue;
      }

      if (child.type === 'text') {
        node.queue.push(append(node.queue.pop(), child.value));
        continue;
      }

      if (child.type === 'close') {
        parent.queue.push(append(parent.queue.pop(), node.queue));
        continue;
      }

      if (child.nodes) {
        walk(child, node);
      }
    }

    return node.queue;
  };

  return flatten(walk(ast));
};

module.exports = expand;

// const colors = require('ansi-colors');
// const parse = require('./parse');
// const cp = require('child_process');
// const color = (arr, c) => arr.map(s => c(s)).join(', ');
// const braces = input => {
//   return cp.execSync(`echo ${input}`).toString().trim().split(' ');
// };

// // const fixture = '{a,{b,c},d}';
// // const fixture = '{a,b}{c,d}{e,f}';
// // const fixture = 'a/{b,c{x,y}d,e}/f';
// // const fixture = '{{a,b}/i,j,k}';
// // const fixture = '{c,d{e,f}g,h}';
// // const fixture = '{{c,d{e,f}g,h}/i,j,k}';
// // const fixture = '{a,b}/{c,d{e,f}g,h}';
// const fixture = '{{a,b}/{c,d{e,f}g,h}/i,j,k}';
// console.log();
// console.log(' FIXTURE:', colors.magenta(fixture));
// console.log('  ACTUAL:', color(compile(parse(fixture)), colors.yellow));
// console.log('EXPECTED:', color(braces(fixture), colors.blue));
// console.log();


