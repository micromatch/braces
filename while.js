
var arr = ['a*', 'b*', '!c*', '!d*', 'e*'];


function combine(arr) {
  var len = arr.length;
  var res = [];
  var i = 0;

  while (len--) {
    var item = arr[i++];
    var next;

    if (next = arr[i]) {
      var exclude = item[0] === '!';
      var excludeNext = next && next[0] === '!';
      if (exclude && excludeNext) {
        res.push(item + '|' + next.slice(1));
      } else if (!exclude && !excludeNext) {
        res.push(item + '|' + next);
      }
    } else {
      res.push(item);
    }
  }
  return res;
}

console.log(combine(arr));
