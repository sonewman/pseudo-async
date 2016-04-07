# pseudo-async

Handle sticky situations where you might have a promise or a value.

## Usage

```
// es-*
import ensurePromise, {ensure, pseudo, maybeRelease} from 'pseudo-async';

// es5
var pseudoAsync = require('pseudo-async');
```

### ensure(promise || value) ===  default === module.exports

Ensure that a value is always wrapped as a promise:

```
// passing a promise:
const promise1 = Promise.resolve(true);
const promise2 = ensure(promise1);

assert(promise1 === promise2);

// passing a value:
const promise3 = ensure(true);

promise3.then(result => {
  assert(result === true);
});
```

### pseudo(promise || value)

Returned value will smell like a promise, but if it was passed a value it will
be wrapped and the callback will be executed synchronously.

The purpose of this is purely for situations where you want to avoid creating
endless promise chains on data which has already resolved

example:
```
// passing a promise:
const promise1 = Promise.resolve(true);
const promise2 = pseudo(promise1);

// returned value will actually be the promise
assert(promise1 === promise2);


// passing a value:
const smellsLikePromise = ensure(true);

const promise3 = smellsLikePromise.then(result => {
  // this callback is executed synchronously
  assert(result === true);

  return Promise.resolve(result);
});

promise3.then(result => {
  // this callback is executed asynchronously
  // as it is actually a real promise
  assert(result === true);
});
```

### maybeRelease(promise || pseudo)

This method will either return the argument if it is a promise or return the
value if the argument is a pseudo promise.
```
// passing a promise:
const promise1 = Promise.resolve(true);
const promise2 = maybeRelease(promise1);

// returned value will be the promise
assert(promise1 === promise2);


// passing a value:
const smellsLikePromise = pseudo(true); 
const value = maybeRelease(smellsLikePromise);

// returned value is the actual value
assert(value === true);
```

## Licence
MIT
