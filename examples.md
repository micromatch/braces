# Examples

> Usage examples

TBC...

## Sequences

Letters

```js
'{a..c}'
//=> ['a', 'b', 'c']
```

Numbers

```js
'{1..3}'
//=> ['1', '2', '3']
```

### Sequences with steps

Letters with step:

```js
'{a..j..2}'
//=> ['b', 'd', 'f', 'h', 'j']
```

Numbers with step:

```js
'{1..10..2}'
//=> ['2', '4', '6', '8', '10']
```

## Lists

```js
'{a,b}'
//=> ['a', 'b']

'a/{b,c}'
//=> ['a/b', 'a/c']
```

## Nesting

```js
'a/{b,c/{d,e}}/f'
//=> ['a/b/f', 'a/c/d/f', 'a/c/e/f']

'a/{b,c/{d,e}/f,g}/h'
//=> ['a/b/h', 'a/c/d/f/h', 'a/c/e/f/h', 'a/g/h']

'a/{b,c/{2..8..2}}/f'
//=> ['a/b/f', 'a/c/2/f', 'a/c/4/f', 'a/c/6/f', 'a/c/8/f']
```
