const desc = require('macchiato');
const ensurePromise = require('./');
const pseudo = ensurePromise.pseudo;
const maybeRelease = ensurePromise.maybeRelease;

desc('pseudo-async: ensurePromise')
.it('should ensure that if passed promise, promise is fwd\'d through', function (t) {
  const p = Promise.resolve(true);
  const r = ensurePromise(p);

  t.equals(p, r);
  
  var isAsync = false;

  const end = r.then(function (result) {
    t.assert(result);
    t.assert(isAsync);
  });

  isAsync = true;

  return end;
})
.it('should ensure that if passed anything that isn\'t thenable, promise is returned', function (t) {
  const value = true;
  const r = ensurePromise(value);
  
  var isAsync = false;

  const end = r.then(function (result) {
    t.assert(result);
    t.assert(isAsync);
  });

  isAsync = true;

  return end;
});

desc('pseudo-async: pseudo')
.it('should fwd promise if supplied', function (t) {
  const p = Promise.resolve(true);
  const r = pseudo(p);

  t.equals(p, r);
  
  var isAsync = false;

  const end = r.then(function (result) {
    t.assert(result);
    t.assert(isAsync);
  });

  isAsync = true;

  return end;
})
.it('should ensure that if passed anything that isn\'t thenable, a pseudo promise is returned', function (t) {
  const value = true;
  const r = pseudo(value);
  
  var isAsync = false;

  const end = r.then(function (result) {
    t.assert(result);
    t.assert(!isAsync);
  });

  isAsync = true;

  return end;
})
.it('should return promise is one is introduced', function (t) {
  const value = true;
  const r = pseudo(value);
  
  var isAsync = false;

  var p;
  const next = r.then(function (result) {
    t.assert(result);
    t.assert(!isAsync);

    return (p = Promise.resolve(result));
  });

  t.equals(p, next);
  const end = next.then(function (result) {
    t.assert(result);
    t.assert(isAsync);
  });

  isAsync = true;

  return end;
});


desc('pseudo-async: maybeRelease')
.it('should return promise is value is promise', function (t) {
  const p = Promise.resolve(true);
  const v = maybeRelease(p);

  t.equals(p, v);
  return p.then(r => t.equals(r, true));
})
.it('should return if value', function (t) {
  t.assert(maybeRelease(true));
  t.end();
})
.it('should return promise if pseudo(promise)', function (t) {
  const p = Promise.resolve(true);
  const v = maybeRelease(pseudo(p));

  t.equals(p, v);
  return p.then(r => t.equals(r, true));
})
.it('should return value if pseudo(value)', function (t) {
  t.equals(maybeRelease(pseudo(true)), true);
  t.end();
});
