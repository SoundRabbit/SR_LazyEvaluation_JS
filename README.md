# SR_LAZYEVALUATION_JS

```js
const assert = require("assert");
const now = require("performance-now");

const fib = $lazy(n => {
    if (n == 0) {
        return 1;
    }
    if (n == 1) {
        return 1;
    }
    return fib(n - 1) + fib(n - 2);
});

const start = now();
for (let i = 0; i < 1000; i++) {
    fib(i);
}
const performance = now() - start;

assert(performance < 1000);
```

```js
const sumOf = $lazy((a, b, c, d) => a + b + c + d);

const sumOf_1 = sumOf(1);
const sumOf_2 = sumOf(1, 2);
const sumOf_3 = sumOf(1, 2, 3);

console.log(sumOf_1(10, 11, 12));   //34
console.log(sumOf_2(10, 11));       //24
console.log(sumof_3(10));           //16
```

```js
const ary = Array(100).fill(0).map((_, i) => i);
const lazyAry = lazy(ary);
const cb = x => x + 1;

const lazyMap_start = now();
for (let i = 0; i < 1000000; i++) {
    lazyAry.map(cb).toArray();
}
const lazyMap_performance = now() - lazyMap_start;

const map_start = now();
for (let i = 0; i < 1000000; i++) {
    ary.map(cb);
}
const map_performance = now() - map_start;

assert(lazyMap_performance * 5 < map_performance);
```

## How to instal

```bash
> npm install sr-lazy
```

## What's this

this package give you lazy function and binding function.

## Lazy for function

Lazy needs a function as a **pure** function.

### lazy

#### sample

```js
const add = lazy((x, y) => x + y);
const add10 = add(10);  // not evaluated
const res = add10(20);  // not evaluated
console.log(res());     // evaluated
console.log(res());     // read from chache
```

### $lazy

#### sample

```js
const add = $lazy((x, y) => x + y);
const add10 = add(10);  // not evaluated
console.log(add10(20)); // evaluated
console.log(add10(20)); // read from chache
```

#### sample

Each mapper ( `mapper(1)`, `mapper(2)`, `mapper(3)`, `mapper(4)` ) will calls only once.

```js
const ary = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
const mapper = $lazy(v => v + 1);
ary.map(mapper);
```

## Lazy for Array

```js
const ary =
    lazy([1, 2, 3])             // create lazy array
    .map($lazy(x => x + 1))     // not evaluated
    .map($lazy(x => x + 1));    // not evaluated
console.log(ary.$toArray());    // evaluted
```

### map

map : ( any -> any ) -> Lazy(Array)

```js
const ary =
    lazy([1, 2, 3])
    .map($lazy(x => x + 1));
console.log(ary.$toArray()); // [2, 3, 4]
```

### filter

filter : ( any -> Boolean ) -> Lazy(Array)

```js
const ary = lazy([1, 2, 3, 4, 5, 6])
    .filter($lazy(x => x < 4));
console.log(ary.$toArray());    // [1, 2, 3]
```

### flatten

flatten : () -> Lazy(Array)

```js
const ary = lazy([1, 2, [3, 4, [5]], 6])
                .flatten();
console.log(ary.$toArray());    // [1, 2, 3, 4, 5, 6]
```