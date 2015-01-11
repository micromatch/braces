# Patterns

> Possible patterns

## Ranges

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

## Sets

Basic

```js
'{a,b}'
//=> ['a', 'b']

'a/{b,c}'
//=> ['a/b', 'a/c']
```

Nested

```js
'a/{b,c/{d,e}}/f'
//=> ['a/b/f', 'a/c/d/f', 'a/c/e/f']

'a/{b,c/{d,e}/f,g}/h'
//=> ['a/b/h', 'a/c/d/f/h', 'a/c/e/f/h', 'a/g/h']
```
