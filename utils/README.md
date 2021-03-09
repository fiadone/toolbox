# @fiad/toolbox/utils

A collection of miscellaneous utility functions

---

## Get started

```sh
npm i @fiad/toolbox
```

```js
import * as utils from '@fiad/toolbox/utils'
```


## Utilities list

### debounce

It handles function [debouncing](https://css-tricks.com/debouncing-throttling-explained-examples/):

```js
import debounce from '@fiad/toolbox/utils/debounce'

const handler = () => {
  // something to do on resize
}

const debounceTime = 200
const onResize = debounce(handler, debounceTime)

window.addEventListener('resize', onResize)
```

### throttle

It handles function [throttling](https://css-tricks.com/debouncing-throttling-explained-examples/):

```js
import throttle from '@fiad/toolbox/utils/throttle'

const handler = () => {
  // something to do on click
}

const throttleTime = 200
const onClick = throttle(handler, throttleTime)

document.addEventListener('click', onClick)
```

### delegate

It delegates an event to the elements matching to the given selector:

```js
import delegate from '@fiad/toolbox/utils/delegate'

const gallery = document.getElementById('gallery')
const handler = delegate('img', (e, target) => {
  console.log(e) // logs the original event
  console.log(target) // logs the event delegate (the clicked img)
})

gallery.addEventListener('click', handler)
```

### equal

It checks if two entities are equal:

```js
import equal from '@fiad/toolbox/utils/equal'

// some code that defines the a and b entities

if (equal(a, b)) {
  // scoped code
}
```

### deepMerge

It deeply merges two objects (or arrays):

```js
import deepMerge from '@fiad/toolbox/utils/deep-merge'

// some code that defines the a and b objects/arrays

const c = deepMerge(a, b)
```

### diff

It recursively retrieves the differences between two objects:

```js
import diff from '@fiad/toolbox/utils/diff'

const a = {
  id: 1,
  total: 2,
  items: ['a', 'b'],
  config: {
    someProp: 'lorem',
    otherProp: 'ispum'
  }
}

const b = {
  id: 1,
  total: 3,
  items: ['a', 'b', 'c'],
  config: {
    someProp: 'lorem',
    otherProp: 'dolor'
  }
}

const c = diff(a, b)
```

The returned value will be:
```json
{
  "total": [2, 3],
  "items": [["a", "b"], ["a", "b", "c"]],
  "config": {
    "otherProp": ["ispum", "dolor"]
  }
}
```

As just seen, unchanged properties are ignored and each difference is returned as an *array* where the first element is the original value from *a* and the second one is the changed value in *b*.

💡 Notice: the comparison will only work with plain objects. The attempt to compare different kinds of items (arrays, class instances, etc.) will always return *[a, b]*.


### memoize

It allows to cache results of complex functions so that when they are recalled later the result will be returned directly from the internal cache without requiring a new execution

```js
import memoize from '@fiad/toolbox/utils/memoize'

const fn = (...args) => {
  // some complex operation
}

const memoFn = memoize(fn)
const result = memoFn(/* some arguments */)
```

### query-string

It handles query string parsing.

```js
import QueryString from '@fiad/toolbox/utils/query-string'
```

#### METHODS:

__toObject__

It takes the given query string (*window.location.search* as default) and converts it into an object.

```js
const params = QueryString.toObject('?resource=catalogue&token=JGwcicjA1Rl4whIBmrei')

// { resource: 'catalogue', token: 'JGwcicjA1Rl4whIBmrei' }
```

__fromObject__

It builds a query string starting from an object of parameters.

```js
const queryString = QueryString.fromObject({
  resource: 'catalogue',
  token: 'JGwcicjA1Rl4whIBmrei'
})

// ?resource=catalogue&token=JGwcicjA1Rl4whIBmrei
```

### string

It handles string transformations.

#### Functions list:

__capitalize__

It makes the first letter of (each word of) the given string uppercase:

```js
import { capitalize } from '@fiad/toolbox/utils/string'

capitalize('sample string') // Sample String
```

__uncapitalize__

It makes the first letter of (each word of) the given string lowercase:

```js
import { uncapitalize } from '@fiad/toolbox/utils/string'

uncapitalize('Sample PascalCase String') // sample pascalCase string
```

__camelCase__

It rewrites the given string in *camelCase*:

```js
import { camelCase } from '@fiad/toolbox/utils/string'

camelCase('sample string') // sampleString
```

__pascalCase__

It rewrites the given string in *PascalCase*:

```js
import { pascalCase } from '@fiad/toolbox/utils/string'

pascalCase('sample string') // SampleString
```

__snakeCase__

It rewrites the given string in *snake_case*:

```js
import { snakeCase } from '@fiad/toolbox/utils/string'

snakeCase('sample string') // sample_string
```

__kebabCase__

It rewrites the given string in *kebab-case*:

```js
import { kebabCase } from '@fiad/toolbox/utils/string'

kebabCase('sample string') // sample-string
```

__words__

It splits the given string into an array of trimmed words:

```js
import { words } from '@fiad/toolbox/utils/string'

words('sample string ') // ['sample', 'string']
```

It also allows to apply a transformation to each word by passing a filter function as second argument:

```js
import { words } from '@fiad/toolbox/utils/string'

words('sample string', word => `<span>${word}</span>`) // ['<span>sample</span>', '<span>string</span>']
```

__chars__

It splits the given string into an array of trimmed chars:

```js
import { chars } from '@fiad/toolbox/utils/string'

chars('sample string') // ['s', 'a', 'm', 'p', 'l', 'e', ...]
```

or into an array of array by passing *true* as second argument, if it's needed to preserve word grouping:

```js
chars('sample string', true) // [['s', 'a', 'm', 'p', 'l', 'e'], [...]]
```

It also allows to apply a transformation to each char by passing a filter function as third argument:

```js
import { words } from '@fiad/toolbox/utils/string'

chars('sample string', false, word => `<span>${word}</span>`) // ['<span>s</span>', '<span>a</span>', ...]
```
