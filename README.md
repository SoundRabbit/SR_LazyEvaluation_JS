# SR_LAZYEVALUATION_JS

```js
let counterOfCallingFunction = 0;
const fibonacciNumber = $lazy(n=>{
    counterOfCallingFunction++;
    if (n == 0) {
        return 1;
    }
    if (n == 1) {
        return 1;
    }
    return fibonacciNumber(n - 1) + fibonacciNumber(n - 2);
});
fibonacciNumber(1000);
console.log(counterOfCallingFunction);  //1001
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

## How to instal

```
npm install sr-lazy
```

## What's this

this package give you lazy function and binding function.

## Lazy

```js
Lazy(mode, func)
```

`mode` is an enumeration type whitch has FirstNeed and FinalArgment. You can select each enumerator as `firstNeed` or `finalArgment`.

`func` is a **pure** function whitch will be lazy-evaluated function.

`lazy` is a syntax sugar for `Lazy(firstNeed, ...)`, and `$lazy` is a syntag sugar for `Lazy(finalArgument, ...)`.

### lazy: Lazy(firstNeed, ...)

`lazy(func)` needs **pure** function, and returns lazy-evaluated function. The function needs non-argmented call to evaluate it, and supoorts partial application and chacheing. This is an example:

```js
const add = lazy((x, y) => x + y);
const add10 = add(10);  // not evaluated
const res = add10(20);  // not evaluated
console.log(res());     // evaluated
console.log(res());     // read from chache
```

#### syntax

```js
lazy(
    func    //pure function
);
```

### $lazy: Lazy(finalArgument, ...)

`$lazy(func)` needs **pure** function, and returns lazy-evaluated function. The function is evaluated when final argment is given, and supoorts partial application and chacheing. This is an example:

```js
const add = $lazy((x, y) => x + y);
const add10 = add(10);  // not evaluated
const res = add10(20);  // evaluated
console.log(res);
```

This has possibility to be useful when you give the lazy-evaluated function as collback function to some function;

#### syntax

```js
$lazy(
    func    //pure function
);
```
