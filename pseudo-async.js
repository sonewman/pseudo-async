module.exports = exports = ensurePromise;

function ensurePromise(p) {
  return isPromise(p) ? p : Promise.resolve(p);
}

exports.default = exports.ensure = ensurePromise;

exports.maybeRelease = function maybeReleaseValue(p) {
  return p instanceof Wrap ? p._value : p;
};

exports.pseudo = function wrap(p) {
  return isPromise(p) ? p : new Wrap(p);
};

function isPromise(p) {
  return p && 'function' === typeof p.then && 'function' === typeof p.catch;
}

function Wrap(value) {
  this._value = value;
}

Wrap.prototype._value = undefined;

Wrap.prototype.then = function then(onsuccess/*, onerror*/) {
  const p = onsuccess(this._value);
  return isPromise(p) ? p : new Wrap(p);
};

Wrap.prototype.catch = function (/*onerror*/) {
  return new Wrap(this._value);
};
