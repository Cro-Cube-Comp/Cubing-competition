var f = Object.defineProperty;
var h = (b, a, c) =>
  a in b
    ? f(b, a, { enumerable: !0, configurable: !0, writable: !0, value: c })
    : (b[a] = c);
var k = (b, a) => {
  for (var c in a) f(b, c, { get: a[c], enumerable: !0 });
};
var l = (b, a, c) => (h(b, typeof a != "symbol" ? a + "" : a, c), c),
  e = (b, a, c) => {
    if (!a.has(b)) throw TypeError("Cannot " + c);
  };
var i = (b, a, c) => (
    e(b, a, "read from private field"), c ? c.call(b) : a.get(b)
  ),
  m = (b, a, c) => {
    if (a.has(b))
      throw TypeError("Cannot add the same private member more than once");
    a instanceof WeakSet ? a.add(b) : a.set(b, c);
  },
  j = (b, a, c, d) => (
    e(b, a, "write to private field"), d ? d.call(b, c) : a.set(b, c), c
  );
var n = (b, a, c, d) => ({
    set _(g) {
      j(b, a, g, c);
    },
    get _() {
      return i(b, a, d);
    },
  }),
  o = (b, a, c) => (e(b, a, "access private method"), c);
export { k as a, l as b, i as c, m as d, j as e, n as f, o as g };
//# sourceMappingURL=chunk-YJ5RMHHJ.js.map
