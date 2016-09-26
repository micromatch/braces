'use strict';

var isNumber = require('is-number');
var nonAlpha = /[^a-zA-Z]/g;
var nonInteg = /[^0-9]/g;

module.exports = function naturalSort(a, b) {
  if (isNumber(a) && isNumber(b)) {
    return compare(+a, +b);
  }

  var parsedA = parseInt(a, 10);
  var parsedB = parseInt(b, 10);

  var isNumA = isNumber(parsedA);
  var isNumB = isNumber(parsedB);

  if (!isNumA && !isNumB) {
    var alphaA = strip(a, nonAlpha);
    var alphaB = strip(b, nonAlpha);
    return (alphaA === alphaB)
      ? compare(toInt(a), toInt(b))
      : compare(alphaA, alphaB);
  }

  if (!isNumA) return 1;
  if (!isNumB) return -1;
  return compare(parsedA, parsedB);
};

function compare(a, b) {
  return a === b ? 0 : (a < b ? -1 : 1);
}

function strip(val, re) {
  return val.split(re).join('');
}

function toInt(val) {
  return parseInt(strip(val, nonInteg), 10);
}
