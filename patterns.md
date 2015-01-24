# Patterns

> Possible patterns

_(this is just a start, see the tests for lots of examples)_

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

### Range steps

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

### Range special characters

A special character may be passed as the third arg instead of a step increment. These characters can be pretty useful for creating file paths, test fixtures and similar use cases.

```js
'{a..z..SPECIAL_CHARACTER_HERE}'
```

**Supported characters**

 - `+`: repeat the given string `n` times
 - `|`: create a regex-ready string, instead of an array
 - `>`: collapse/join values to single array element
 - `?`: randomize the given pattern using [randomatic]


#### `+`

Repeat the first argument `n` times, where `n` is the number passed as the second argument.

**Examples:**

```js
'{a..3..+}'
//=> ['a', 'a', 'a']

'{abc..2..+}'
//=> ['abc', 'abc']
```

#### `|`

Creates a regex-friendly **string** from the expanded arguments.

**Examples:**

```js
'{a..c..|}'
//=> ['(a|b|c)']

'{a..z..|5}'
//=> ['(a|f|k|p|u|z)']
```

#### `>`

Collapses all values in the returned array to a single value.

**Examples:**

```js
'{a..e..>}'
//=> ['abcde']

'{5..8..>}'
//=> ['5678']

'{2..20..2>}'
//=> ['2468101214161820']
```


#### `?`

Uses [randomatic] to generate randomized alpha, numeric, or alpha-numeric patterns based on the provided arguments.

**Examples:**

_(actual results would obviously be randomized)_

Generate a 5-character, uppercase, alphabetical string:

```js
'{A..5..?}'
//=> ['NSHAK']
```

Generate a 5-digit random number:

```js
'{0..5..?}'
//=> ['36583']
```

Generate a 10-character alpha-numeric string:

```js
'{A0..10..?}'
//=> ['5YJD60VQNN']
```

See the [randomatic] repo for all available options and or to create issues or feature requests related to randomization.
`

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

[randomatic]: https://github.com/jonschlinkert/randomatic
