import { c as r, d as f, e as m, f as te, g as R } from "./chunk-YJ5RMHHJ.js";
var be = !1,
  Se = class {
    is(t) {
      return this instanceof t;
    }
    as(t) {
      return this instanceof t ? this : null;
    }
  },
  Q = class extends Se {
    constructor() {
      super(),
        be &&
          Object.defineProperty(this, "_debugStr", {
            get: () => this.toString(),
          });
    }
    get log() {
      return console.log.bind(console, this, this.toString());
    }
  };
function Re(t, e = !0) {
  if (!e) return t;
  switch (t) {
    case 1:
      return -1;
    case -1:
      return 1;
  }
}
function Ue(t, e) {
  return e === -1 ? Array.from(t).reverse() : t;
}
function qe(t) {
  return Array.from(t).reverse();
}
function* nt(t, e) {
  e === -1 ? yield* Le(t) : yield* t;
}
function* Le(t) {
  for (let e of Array.from(t).reverse()) yield e;
}
var ne = 2147483647,
  re = "2^31 - 1",
  Pe = -2147483648,
  O,
  me,
  ze =
    ((me = class {
      constructor() {
        f(this, O, []);
      }
      push(t) {
        r(this, O).push(t);
      }
      experimentalPushAlg(t) {
        for (let e of t.childAlgNodes()) this.push(e);
      }
      experimentalNumAlgNodes() {
        return r(this, O).length;
      }
      toAlg() {
        return new u(r(this, O));
      }
      reset() {
        m(this, O, []);
      }
    }),
    (O = new WeakMap()),
    me),
  Be = { caratNISSNotationEnabled: !1 };
var $,
  T,
  fe,
  I =
    ((fe = class extends Q {
      constructor(e, n) {
        super();
        f(this, $, void 0);
        f(this, T, void 0);
        m(this, $, j(e)), m(this, T, j(n));
      }
      get A() {
        return r(this, $);
      }
      get B() {
        return r(this, T);
      }
      isIdentical(e) {
        let n = e.as(I);
        return !!(n?.A.isIdentical(this.A) && n?.B.isIdentical(this.B));
      }
      invert() {
        return new I(r(this, T), r(this, $));
      }
      *experimentalExpand(e = 1, n) {
        n ?? (n = 1 / 0),
          n === 0
            ? yield e === 1 ? this : this.invert()
            : e === 1
              ? (yield* this.A.experimentalExpand(1, n - 1),
                yield* this.B.experimentalExpand(1, n - 1),
                yield* this.A.experimentalExpand(-1, n - 1),
                yield* this.B.experimentalExpand(-1, n - 1))
              : (yield* this.B.experimentalExpand(1, n - 1),
                yield* this.A.experimentalExpand(1, n - 1),
                yield* this.B.experimentalExpand(-1, n - 1),
                yield* this.A.experimentalExpand(-1, n - 1));
      }
      toString() {
        return `[${r(this, $).toString()}, ${r(this, T).toString()}]`;
      }
    }),
    ($ = new WeakMap()),
    (T = new WeakMap()),
    fe),
  F,
  k,
  pe,
  E =
    ((pe = class extends Q {
      constructor(e, n) {
        super();
        f(this, F, void 0);
        f(this, k, void 0);
        m(this, F, j(e)), m(this, k, j(n));
      }
      get A() {
        return r(this, F);
      }
      get B() {
        return r(this, k);
      }
      isIdentical(e) {
        let n = e.as(E);
        return !!(n?.A.isIdentical(this.A) && n?.B.isIdentical(this.B));
      }
      invert() {
        return new E(r(this, F), r(this, k).invert());
      }
      *experimentalExpand(e, n) {
        n ?? (n = 1 / 0),
          n === 0
            ? yield e === 1 ? this : this.invert()
            : (yield* this.A.experimentalExpand(1, n - 1),
              yield* this.B.experimentalExpand(e, n - 1),
              yield* this.A.experimentalExpand(-1, n - 1));
      }
      toString() {
        return `[${this.A}: ${this.B}]`;
      }
    }),
    (F = new WeakMap()),
    (k = new WeakMap()),
    pe),
  P,
  we,
  X =
    ((we = class extends Q {
      constructor(e) {
        super();
        f(this, P, void 0);
        if (
          e.includes(`
`) ||
          e.includes("\r")
        )
          throw new Error("LineComment cannot contain newline");
        m(this, P, e);
      }
      get text() {
        return r(this, P);
      }
      isIdentical(e) {
        let n = e;
        return e.is(X) && r(this, P) === r(n, P);
      }
      invert() {
        return this;
      }
      *experimentalExpand(e = 1, n = 1 / 0) {
        yield this;
      }
      toString() {
        return `//${r(this, P)}`;
      }
    }),
    (P = new WeakMap()),
    we),
  z = class extends Q {
    toString() {
      return `
`;
    }
    isIdentical(t) {
      return t.is(z);
    }
    invert() {
      return this;
    }
    *experimentalExpand(t = 1, e = 1 / 0) {
      yield this;
    }
  },
  _ = class extends Q {
    toString() {
      return ".";
    }
    isIdentical(t) {
      return t.is(_);
    }
    invert() {
      return this;
    }
    *experimentalExpand(t = 1, e = 1 / 0) {
      yield this;
    }
  };
function ee(t, e) {
  return t ? parseInt(t) : e;
}
var oe = /^(\d+)?('?)/,
  Qe = /^[_\dA-Za-z]/,
  Oe = /^((([1-9]\d*)-)?([1-9]\d*))?([_A-Za-z]+)?/,
  $e = /^[^\n]*/,
  Te = /^(-?\d+), ?/,
  We = /^(-?\d+)\)/;
function Ie(t) {
  return new ue().parseAlg(t);
}
function Ge(t) {
  return new ue().parseMove(t);
}
function Fe(t) {
  return new ue().parseQuantumMove(t);
}
function g(t, e, n) {
  let s = t;
  return (s.startCharIndex = e), (s.endCharIndex = n), s;
}
function ke(t, e) {
  return (
    "startCharIndex" in t && (e.startCharIndex = t.startCharIndex),
    "endCharIndex" in t && (e.endCharIndex = t.endCharIndex),
    e
  );
}
var A,
  o,
  D,
  de,
  ue =
    ((de = class {
      constructor() {
        f(this, A, "");
        f(this, o, 0);
        f(this, D, []);
      }
      parseAlg(t) {
        m(this, A, t), m(this, o, 0);
        let e = this.parseAlgWithStopping([]);
        this.mustBeAtEndOfInput();
        let n = Array.from(e.childAlgNodes());
        if (r(this, D).length > 0)
          for (let h of r(this, D).reverse()) n.push(h);
        let s = new u(n),
          { startCharIndex: a, endCharIndex: l } = e;
        return g(s, a, l), s;
      }
      parseMove(t) {
        m(this, A, t), m(this, o, 0);
        let e = this.parseMoveImpl();
        return this.mustBeAtEndOfInput(), e;
      }
      parseQuantumMove(t) {
        m(this, A, t), m(this, o, 0);
        let e = this.parseQuantumMoveImpl();
        return this.mustBeAtEndOfInput(), e;
      }
      mustBeAtEndOfInput() {
        if (r(this, o) !== r(this, A).length)
          throw new Error("parsing unexpectedly ended early");
      }
      parseAlgWithStopping(t) {
        let e = r(this, o),
          n = r(this, o),
          s = new ze(),
          a = !1,
          l = (h) => {
            if (a)
              throw new Error(
                `Unexpected character at index ${h}. Are you missing a space?`,
              );
          };
        e: for (; r(this, o) < r(this, A).length; ) {
          let h = r(this, o);
          if (t.includes(r(this, A)[r(this, o)])) return g(s.toAlg(), e, n);
          if (this.tryConsumeNext(" ")) {
            (a = !1), s.experimentalNumAlgNodes() === 0 && (e = r(this, o));
            continue e;
          } else if (Qe.test(r(this, A)[r(this, o)])) {
            l(h);
            let S = this.parseMoveImpl();
            s.push(S), (a = !0), (n = r(this, o));
            continue e;
          } else if (this.tryConsumeNext("(")) {
            l(h);
            let S = this.tryRegex(Te);
            if (S) {
              let c = S[1],
                p = r(this, o),
                L = this.parseRegex(We),
                N = g(
                  new i(new B("U_SQ_"), parseInt(c)),
                  h + 1,
                  h + 1 + c.length,
                ),
                b = g(new i(new B("D_SQ_"), parseInt(L[1])), p, r(this, o) - 1),
                J = g(new u([N, b]), h + 1, r(this, o) - 1);
              s.push(g(new C(J), h, r(this, o))), (a = !0), (n = r(this, o));
              continue e;
            } else {
              let c = this.parseAlgWithStopping([")"]);
              this.mustConsumeNext(")");
              let p = this.parseAmount();
              s.push(g(new C(c, p), h, r(this, o))), (a = !0), (n = r(this, o));
              continue e;
            }
          } else if (this.tryConsumeNext("^")) {
            if (!Be.caratNISSNotationEnabled)
              throw new Error(
                "Alg contained a carat but carat NISS notation is not enabled.",
              );
            this.mustConsumeNext("(");
            let S = this.parseAlgWithStopping([")"]);
            this.popNext();
            let c = new C(S, -1),
              p = new _();
            (c.experimentalNISSPlaceholder = p),
              (p.experimentalNISSGrouping = c),
              r(this, D).push(c),
              s.push(p);
          } else if (this.tryConsumeNext("[")) {
            l(h);
            let S = this.parseAlgWithStopping([",", ":"]),
              c = this.popNext(),
              p = this.parseAlgWithStopping(["]"]);
            switch ((this.mustConsumeNext("]"), c)) {
              case ":": {
                s.push(g(new E(S, p), h, r(this, o))),
                  (a = !0),
                  (n = r(this, o));
                continue e;
              }
              case ",": {
                s.push(g(new I(S, p), h, r(this, o))),
                  (a = !0),
                  (n = r(this, o));
                continue e;
              }
              default:
                throw new Error("unexpected parsing error");
            }
          } else if (
            this.tryConsumeNext(`
`)
          ) {
            s.push(g(new z(), h, r(this, o))), (a = !1), (n = r(this, o));
            continue e;
          } else if (this.tryConsumeNext("/"))
            if (this.tryConsumeNext("/")) {
              l(h);
              let [S] = this.parseRegex($e);
              s.push(g(new X(S), h, r(this, o))), (a = !1), (n = r(this, o));
              continue e;
            } else {
              s.push(g(new i("_SLASH_"), h, r(this, o))),
                (a = !0),
                (n = r(this, o));
              continue e;
            }
          else if (this.tryConsumeNext(".")) {
            l(h), s.push(g(new _(), h, r(this, o))), (a = !0), (n = r(this, o));
            continue e;
          } else throw new Error(`Unexpected character: ${this.popNext()}`);
        }
        if (r(this, o) !== r(this, A).length)
          throw new Error("did not finish parsing?");
        if (t.length > 0) throw new Error("expected stopping");
        return g(s.toAlg(), e, n);
      }
      parseQuantumMoveImpl() {
        let [, , , t, e, n] = this.parseRegex(Oe);
        return new B(n, ee(e, void 0), ee(t, void 0));
      }
      parseMoveImpl() {
        let t = r(this, o);
        if (this.tryConsumeNext("/")) return g(new i("_SLASH_"), t, r(this, o));
        let e = this.parseQuantumMoveImpl(),
          [n, s] = this.parseAmountAndTrackEmptyAbsAmount(),
          a = this.parseMoveSuffix();
        if (a) {
          if (n < 0) throw new Error("uh-oh");
          if ((a === "++" || a === "--") && n !== 1)
            throw new Error(
              "Pochmann ++ or -- moves cannot have an amount other than 1.",
            );
          if ((a === "++" || a === "--") && !s)
            throw new Error(
              "Pochmann ++ or -- moves cannot have an amount written as a number.",
            );
          if ((a === "+" || a === "-") && s)
            throw new Error(
              "Clock dial moves must have an amount written as a natural number followed by + or -.",
            );
          a.startsWith("+") &&
            (e = e.modified({
              family: `${e.family}_${a === "+" ? "PLUS" : "PLUSPLUS"}_`,
            })),
            a.startsWith("-") &&
              ((e = e.modified({
                family: `${e.family}_${a === "-" ? "PLUS" : "PLUSPLUS"}_`,
              })),
              (n *= -1));
        }
        return g(new i(e, n), t, r(this, o));
      }
      parseMoveSuffix() {
        return this.tryConsumeNext("+")
          ? this.tryConsumeNext("+")
            ? "++"
            : "+"
          : this.tryConsumeNext("-")
            ? this.tryConsumeNext("-")
              ? "--"
              : "-"
            : null;
      }
      parseAmountAndTrackEmptyAbsAmount() {
        let t = r(this, o),
          [, e, n] = this.parseRegex(oe);
        if (e?.startsWith("0") && e !== "0")
          throw new Error(
            `Error at char index ${t}: An amount can only start with 0 if it's exactly the digit 0.`,
          );
        return [ee(e, 1) * (n === "'" ? -1 : 1), !e];
      }
      parseAmount() {
        let t = r(this, o),
          [, e, n] = this.parseRegex(oe);
        if (e?.startsWith("0") && e !== "0")
          throw new Error(
            `Error at char index ${t}: An amount number can only start with 0 if it's exactly the digit 0.`,
          );
        return ee(e, 1) * (n === "'" ? -1 : 1);
      }
      parseRegex(t) {
        let e = t.exec(this.remaining());
        if (e === null) throw new Error("internal parsing error");
        return m(this, o, r(this, o) + e[0].length), e;
      }
      tryRegex(t) {
        let e = t.exec(this.remaining());
        return e === null ? null : (m(this, o, r(this, o) + e[0].length), e);
      }
      remaining() {
        return r(this, A).slice(r(this, o));
      }
      popNext() {
        let t = r(this, A)[r(this, o)];
        return te(this, o)._++, t;
      }
      tryConsumeNext(t) {
        return r(this, A)[r(this, o)] === t ? (te(this, o)._++, !0) : !1;
      }
      mustConsumeNext(t) {
        let e = this.popNext();
        if (e !== t)
          throw new Error(`expected \`${t}\` while parsing, encountered ${e}`);
        return e;
      }
    }),
    (A = new WeakMap()),
    (o = new WeakMap()),
    (D = new WeakMap()),
    de),
  le = new Set();
function Ee(t) {
  le.has(t) || (console.warn(t), le.add(t));
}
var ie = class {
    constructor(t, e = 1) {
      if (
        ((this.quantum = t),
        (this.amount = e),
        !Number.isInteger(this.amount) || this.amount < Pe || this.amount > ne)
      )
        throw new Error(
          `AlgNode amount absolute value must be a non-negative integer below ${re}.`,
        );
    }
    suffix() {
      let t = "",
        e = Math.abs(this.amount);
      return e !== 1 && (t += e), this.amount < 0 && (t += "'"), t;
    }
    isIdentical(t) {
      return this.quantum.isIdentical(t.quantum) && this.amount === t.amount;
    }
    *experimentalExpand(t, e) {
      let n = Math.abs(this.amount),
        s = Re(t, this.amount < 0);
      for (let a = 0; a < n; a++) yield* this.quantum.experimentalExpand(s, e);
    }
  },
  q,
  d,
  x,
  xe,
  B =
    ((xe = class extends Se {
      constructor(e, n, s) {
        super();
        f(this, q, void 0);
        f(this, d, void 0);
        f(this, x, void 0);
        if (
          (m(this, q, e),
          m(this, d, n ?? null),
          m(this, x, s ?? null),
          Object.freeze(this),
          r(this, d) !== null &&
            (!Number.isInteger(r(this, d)) ||
              r(this, d) < 1 ||
              r(this, d) > ne))
        )
          throw new Error(
            `QuantumMove inner layer must be a positive integer below ${re}.`,
          );
        if (
          r(this, x) !== null &&
          (!Number.isInteger(r(this, x)) || r(this, x) < 1 || r(this, x) > ne)
        )
          throw new Error(
            `QuantumMove outer layer must be a positive integer below ${re}.`,
          );
        if (
          r(this, x) !== null &&
          r(this, d) !== null &&
          r(this, d) <= r(this, x)
        )
          throw new Error(
            "QuantumMove outer layer must be smaller than inner layer.",
          );
        if (r(this, x) !== null && r(this, d) === null)
          throw new Error(
            "QuantumMove with an outer layer must have an inner layer",
          );
      }
      static fromString(e) {
        return Fe(e);
      }
      modified(e) {
        return new B(
          e.family ?? r(this, q),
          e.innerLayer ?? r(this, d),
          e.outerLayer ?? r(this, x),
        );
      }
      isIdentical(e) {
        let n = e;
        return (
          e.is(B) &&
          r(this, q) === r(n, q) &&
          r(this, d) === r(n, d) &&
          r(this, x) === r(n, x)
        );
      }
      get family() {
        return r(this, q);
      }
      get outerLayer() {
        return r(this, x);
      }
      get innerLayer() {
        return r(this, d);
      }
      experimentalExpand() {
        throw new Error(
          "experimentalExpand() cannot be called on a `QuantumMove` directly.",
        );
      }
      toString() {
        let e = r(this, q);
        return (
          r(this, d) !== null &&
            ((e = String(r(this, d)) + e),
            r(this, x) !== null && (e = `${String(r(this, x))}-${e}`)),
          e
        );
      }
    }),
    (q = new WeakMap()),
    (d = new WeakMap()),
    (x = new WeakMap()),
    xe),
  w,
  ge,
  i =
    ((ge = class extends Q {
      constructor(...e) {
        super();
        f(this, w, void 0);
        if (typeof e[0] == "string")
          if (e[1] ?? null) {
            m(this, w, new ie(B.fromString(e[0]), e[1]));
            return;
          } else return i.fromString(e[0]);
        m(this, w, new ie(e[0], e[1]));
      }
      isIdentical(e) {
        let n = e.as(i);
        return !!n && r(this, w).isIdentical(r(n, w));
      }
      invert() {
        return ke(this, new i(r(this, w).quantum, -this.amount));
      }
      *experimentalExpand(e = 1) {
        e === 1 ? yield this : yield this.modified({ amount: -this.amount });
      }
      get quantum() {
        return r(this, w).quantum;
      }
      modified(e) {
        return new i(r(this, w).quantum.modified(e), e.amount ?? this.amount);
      }
      static fromString(e) {
        return Ge(e);
      }
      get amount() {
        return r(this, w).amount;
      }
      get type() {
        return Ee("deprecated: type"), "blockMove";
      }
      get family() {
        return r(this, w).quantum.family ?? void 0;
      }
      get outerLayer() {
        return r(this, w).quantum.outerLayer ?? void 0;
      }
      get innerLayer() {
        return r(this, w).quantum.innerLayer ?? void 0;
      }
      toString() {
        if (this.family === "_SLASH_") return "/";
        if (this.family.endsWith("_PLUS_"))
          return (
            r(this, w).quantum.toString().slice(0, -6) +
            Math.abs(this.amount) +
            (this.amount < 0 ? "-" : "+")
          );
        if (this.family.endsWith("_PLUSPLUS_")) {
          let e = Math.abs(this.amount);
          return (
            r(this, w).quantum.toString().slice(0, -10) +
            (e === 1 ? "" : e) +
            (this.amount < 0 ? "--" : "++")
          );
        }
        return r(this, w).quantum.toString() + r(this, w).suffix();
      }
    }),
    (w = new WeakMap()),
    ge),
  De = class {
    constructor() {
      (this.quantumU_SQ_ = null), (this.quantumD_SQ_ = null);
    }
    format(t) {
      let e = this.tuple(t);
      return e ? `(${e.map((n) => n.amount).join(", ")})` : null;
    }
    tuple(t) {
      this.quantumU_SQ_ || (this.quantumU_SQ_ = new B("U_SQ_")),
        this.quantumD_SQ_ || (this.quantumD_SQ_ = new B("D_SQ_"));
      let e = t.alg;
      if (e.experimentalNumChildAlgNodes() === 2) {
        let [n, s] = e.childAlgNodes();
        if (
          n.as(i)?.quantum.isIdentical(this.quantumU_SQ_) &&
          s.as(i)?.quantum.isIdentical(this.quantumD_SQ_)
        ) {
          if (t.amount !== 1)
            throw new Error(
              "Square-1 tuples cannot have an amount other than 1.",
            );
          return [n, s];
        }
      }
      return null;
    }
  },
  he = new De(),
  y,
  Ae,
  C =
    ((Ae = class extends Q {
      constructor(e, n) {
        super();
        f(this, y, void 0);
        let s = j(e);
        m(this, y, new ie(s, n));
      }
      isIdentical(e) {
        let n = e;
        return e.is(C) && r(this, y).isIdentical(r(n, y));
      }
      get alg() {
        return r(this, y).quantum;
      }
      get amount() {
        return r(this, y).amount;
      }
      get experimentalRepetitionSuffix() {
        return r(this, y).suffix();
      }
      invert() {
        return new C(r(this, y).quantum, -r(this, y).amount);
      }
      *experimentalExpand(e = 1, n) {
        n ?? (n = 1 / 0),
          n === 0
            ? yield e === 1 ? this : this.invert()
            : yield* r(this, y).experimentalExpand(e, n - 1);
      }
      static fromString() {
        throw new Error("unimplemented");
      }
      toString() {
        return (
          he.format(this) ??
          `(${r(this, y).quantum.toString()})${r(this, y).suffix()}`
        );
      }
      experimentalAsSquare1Tuple() {
        return he.tuple(this);
      }
    }),
    (y = new WeakMap()),
    Ae);
function U(t, e) {
  return t instanceof e;
}
function Xe(t) {
  return (
    U(t, C) || U(t, X) || U(t, I) || U(t, E) || U(t, i) || U(t, z) || U(t, _)
  );
}
function Ne(t, e, n) {
  if (e.is(C)) return t.traverseGrouping(e, n);
  if (e.is(i)) return t.traverseMove(e, n);
  if (e.is(I)) return t.traverseCommutator(e, n);
  if (e.is(E)) return t.traverseConjugate(e, n);
  if (e.is(_)) return t.traversePause(e, n);
  if (e.is(z)) return t.traverseNewline(e, n);
  if (e.is(X)) return t.traverseLineComment(e, n);
  throw new Error("unknown AlgNode");
}
function _e(t) {
  if (t.is(C) || t.is(i) || t.is(I) || t.is(E) || t.is(_) || t.is(z) || t.is(X))
    return t;
  throw new Error("internal error: expected AlgNode");
}
var Ce = class {
    traverseAlgNode(t, e) {
      return Ne(this, t, e);
    }
    traverseIntoAlgNode(t, e) {
      return _e(this.traverseAlgNode(t, e));
    }
  },
  rt = class extends Ce {
    traverseAlgNode(t) {
      return Ne(this, t, void 0);
    }
    traverseIntoAlgNode(t) {
      return _e(this.traverseAlgNode(t));
    }
  };
function He(t, e) {
  let n = new t(...(e ?? []));
  return n.traverseAlg.bind(n);
}
var je = "any-direction",
  Me = class {
    constructor(t = {}) {
      this.config = t;
    }
    cancelQuantum() {
      let { cancel: t } = this.config;
      return t === !0 ? je : t === !1 ? "none" : (t?.directional ?? "none");
    }
    cancelAny() {
      return this.config.cancel && this.cancelQuantum() !== "none";
    }
    cancelPuzzleSpecificModWrap() {
      let { cancel: t } = this.config;
      return t === !0 || t === !1
        ? "canonical-centered"
        : t?.puzzleSpecificModWrap
          ? t?.puzzleSpecificModWrap
          : t?.directional === "same-direction"
            ? "preserve-sign"
            : "canonical-centered";
    }
    puzzleSpecificSimplifyOptions() {
      return (
        this.config.puzzleLoader?.puzzleSpecificSimplifyOptions ??
        this.config.puzzleSpecificSimplifyOptions
      );
    }
  };
function Ke(t, e) {
  return t * Math.sign(e.amount) >= 0;
}
function Ve(t, e, n) {
  return ((((t - n) % e) + e) % e) + n;
}
function Ze(t, e, n) {
  let s = new Me(n),
    a = Array.from(t.childAlgNodes()),
    l = [e];
  function h() {
    return new u([...a, ...l]);
  }
  function S(c) {
    if (s.cancelPuzzleSpecificModWrap() === "none") return c;
    let p = s.puzzleSpecificSimplifyOptions()?.quantumMoveOrder;
    if (!p) return c;
    let L = p(e.quantum),
      N;
    switch (s.cancelPuzzleSpecificModWrap()) {
      case "gravity": {
        N = -Math.floor((L - (c.amount < 0 ? 0 : 1)) / 2);
        break;
      }
      case "canonical-centered": {
        N = -Math.floor((L - 1) / 2);
        break;
      }
      case "canonical-positive": {
        N = 0;
        break;
      }
      case "preserve-sign": {
        N = c.amount < 0 ? 1 - L : 0;
        break;
      }
      default:
        throw new Error("Unknown mod wrap");
    }
    let b = Ve(c.amount, L, N);
    return c.modified({ amount: b });
  }
  if (s.cancelAny()) {
    let c,
      p = s.puzzleSpecificSimplifyOptions()?.axis;
    if (p) c = (M) => p.areQuantumMovesSameAxis(e.quantum, M.quantum);
    else {
      let M = e.quantum.toString();
      c = (G) => G.quantum.toString() === M;
    }
    let L = s.cancelQuantum() === "same-direction",
      N = new Map();
    N.set(e.quantum.toString(), Math.sign(e.amount));
    let b;
    for (b = a.length - 1; b >= 0; b--) {
      let M = a[b].as(i);
      if (!M || !c(M)) break;
      let G = M.quantum.toString();
      if (L) {
        let Y = N.get(G);
        if (Y && !Ke(Y, M)) break;
        N.set(G, Math.sign(M.amount));
      }
    }
    let J = [...a.splice(b + 1), e];
    if (p)
      l = p.simplifySameAxisMoves(
        J,
        s.cancelPuzzleSpecificModWrap() !== "none",
      );
    else {
      let M = J.reduce((G, Y) => G + Y.amount, 0);
      if (N.size !== 1)
        throw new Error(
          "Internal error: multiple quantums when one was expected",
        );
      l = [new i(e.quantum, M)];
    }
  }
  return (l = l.map((c) => S(c)).filter((c) => c.amount !== 0)), h();
}
function Je(t, e, n) {
  let s = e.as(i);
  return s ? Ze(t, s, n) : new u([...t.childAlgNodes(), e]);
}
var K,
  V,
  se,
  W,
  H,
  Z,
  ae,
  ye,
  Ye =
    ((ye = class extends Ce {
      constructor() {
        super(...arguments);
        f(this, V);
        f(this, W);
        f(this, Z);
        f(this, K, void 0);
      }
      *traverseAlg(e, n) {
        if (n.depth === 0) {
          yield* e.childAlgNodes();
          return;
        }
        let s = [],
          a = R(this, W, H).call(this, n);
        for (let l of e.childAlgNodes())
          for (let h of this.traverseAlgNode(l, a))
            s = Array.from(Je(new u(s), h, a).childAlgNodes());
        for (let l of s) yield l;
      }
      *traverseGrouping(e, n) {
        if (n.depth === 0) {
          yield e;
          return;
        }
        if (e.amount === 0) return;
        let s = new C(
          this.traverseAlg(e.alg, R(this, W, H).call(this, n)),
          e.amount,
        );
        if (s.alg.experimentalIsEmpty()) return;
        let a = R(this, V, se).call(this).get(e);
        a &&
          ((s.experimentalNISSPlaceholder = a),
          (a.experimentalNISSGrouping = s)),
          yield s;
      }
      *traverseMove(e, n) {
        yield e;
      }
      *traverseCommutator(e, n) {
        if (n.depth === 0) {
          yield e;
          return;
        }
        let s = R(this, W, H).call(this, n),
          a = new I(this.traverseAlg(e.A, s), this.traverseAlg(e.B, s));
        a.A.experimentalIsEmpty() ||
          a.B.experimentalIsEmpty() ||
          a.A.isIdentical(a.B) ||
          a.A.isIdentical(a.B.invert()) ||
          R(this, Z, ae).call(this, a.A, a.B, n) ||
          (yield a);
      }
      *traverseConjugate(e, n) {
        if (n.depth === 0) {
          yield e;
          return;
        }
        let s = R(this, W, H).call(this, n),
          a = new E(this.traverseAlg(e.A, s), this.traverseAlg(e.B, s));
        if (!a.B.experimentalIsEmpty()) {
          if (
            a.A.experimentalIsEmpty() ||
            a.A.isIdentical(a.B) ||
            a.A.isIdentical(a.B.invert()) ||
            R(this, Z, ae).call(this, a.A, a.B, n)
          ) {
            yield* e.B.childAlgNodes();
            return;
          }
          yield a;
        }
      }
      *traversePause(e, n) {
        if (e.experimentalNISSGrouping) {
          let s = new _();
          R(this, V, se).call(this).set(e.experimentalNISSGrouping, s), yield s;
        } else yield e;
      }
      *traverseNewline(e, n) {
        yield e;
      }
      *traverseLineComment(e, n) {
        yield e;
      }
    }),
    (K = new WeakMap()),
    (V = new WeakSet()),
    (se = function () {
      return r(this, K) ?? m(this, K, new Map());
    }),
    (W = new WeakSet()),
    (H = function (e) {
      return { ...e, depth: e.depth ? e.depth - 1 : null };
    }),
    (Z = new WeakSet()),
    (ae = function (e, n, s) {
      if (
        e.experimentalNumChildAlgNodes() === 1 &&
        n.experimentalNumChildAlgNodes() === 1
      ) {
        let a = Array.from(e.childAlgNodes())[0]?.as(i),
          l = Array.from(n.childAlgNodes())[0]?.as(i);
        if (!(a && l)) return !1;
        if (
          l.quantum.isIdentical(a.quantum) ||
          new Me(s)
            .puzzleSpecificSimplifyOptions()
            ?.axis?.areQuantumMovesSameAxis(a.quantum, l.quantum)
        )
          return !0;
      }
      return !1;
    }),
    ye),
  et = He(Ye);
function ce(t) {
  if (!t) return [];
  if (U(t, u)) return t.childAlgNodes();
  if (typeof t == "string") return Ie(t).childAlgNodes();
  let e = t;
  if (typeof e[Symbol.iterator] == "function") return e;
  throw new Error("Invalid AlgNode");
}
function j(t) {
  return U(t, u) ? t : new u(t);
}
var v,
  ve,
  u =
    ((ve = class extends Q {
      constructor(e) {
        super();
        f(this, v, void 0);
        m(this, v, Array.from(ce(e)));
        for (let n of r(this, v))
          if (!Xe(n)) throw new Error("An alg can only contain alg nodes.");
      }
      isIdentical(e) {
        let n = e;
        if (!e.is(u)) return !1;
        let s = Array.from(r(this, v)),
          a = Array.from(r(n, v));
        if (s.length !== a.length) return !1;
        for (let l = 0; l < s.length; l++)
          if (!s[l].isIdentical(a[l])) return !1;
        return !0;
      }
      invert() {
        return new u(qe(Array.from(r(this, v)).map((e) => e.invert())));
      }
      *experimentalExpand(e = 1, n) {
        n ?? (n = 1 / 0);
        for (let s of Ue(r(this, v), e)) yield* s.experimentalExpand(e, n);
      }
      expand(e) {
        return new u(this.experimentalExpand(1, e?.depth ?? 1 / 0));
      }
      *experimentalLeafMoves() {
        for (let e of this.experimentalExpand()) e.is(i) && (yield e);
      }
      concat(e) {
        return new u(Array.from(r(this, v)).concat(Array.from(ce(e))));
      }
      experimentalIsEmpty() {
        for (let e of r(this, v)) return !1;
        return !0;
      }
      static fromString(e) {
        return Ie(e);
      }
      units() {
        return this.childAlgNodes();
      }
      *childAlgNodes() {
        for (let e of r(this, v)) yield e;
      }
      experimentalNumUnits() {
        return this.experimentalNumChildAlgNodes();
      }
      experimentalNumChildAlgNodes() {
        return Array.from(r(this, v)).length;
      }
      get type() {
        return Ee("deprecated: type"), "sequence";
      }
      toString() {
        let e = "",
          n = null;
        for (let s of r(this, v)) {
          n && (e += tt(n, s));
          let a = s.as(_)?.experimentalNISSGrouping;
          if (a) {
            if (a.amount !== -1)
              throw new Error("Invalid NISS Grouping amount!");
            e += `^(${a.alg.toString()})`;
          } else s.as(C)?.experimentalNISSPlaceholder || (e += s.toString());
          n = s;
        }
        return e;
      }
      experimentalSimplify(e) {
        return new u(et(this, e ?? {}));
      }
      simplify(e) {
        return this.experimentalSimplify(e);
      }
    }),
    (v = new WeakMap()),
    ve);
function tt(t, e) {
  return t.is(z) || e.is(z) || e.as(C)?.experimentalNISSPlaceholder
    ? ""
    : t.is(X) && !e.is(z)
      ? `
`
      : " ";
}
var it = {
    Sune: new u([
      new i("R", 1),
      new i("U", 1),
      new i("R", -1),
      new i("U", 1),
      new i("R", 1),
      new i("U", -2),
      new i("R", -1),
    ]),
    AntiSune: new u([
      new i("R", 1),
      new i("U", 2),
      new i("R", -1),
      new i("U", -1),
      new i("R", 1),
      new i("U", -1),
      new i("R", -1),
    ]),
    SuneCommutator: new u([
      new I(
        new u([new i("R", 1), new i("U", 1), new i("R", -2)]),
        new u([new E(new u([new i("R", 1)]), new u([new i("U", 1)]))]),
      ),
    ]),
    Niklas: new u([
      new i("R", 1),
      new i("U", -1),
      new i("L", -1),
      new i("U", 1),
      new i("R", -1),
      new i("U", -1),
      new i("L", 1),
      new i("U", 1),
    ]),
    EPerm: new u([
      new i("x", -1),
      new I(
        new u([new E(new u([new i("R", 1)]), new u([new i("U", -1)]))]),
        new u([new i("D", 1)]),
      ),
      new I(
        new u([new E(new u([new i("R", 1)]), new u([new i("U", 1)]))]),
        new u([new i("D", 1)]),
      ),
      new i("x", 1),
    ]),
    FURURFCompact: new u([
      new E(
        new u([new i("F", 1)]),
        new u([new I(new u([new i("U", 1)]), new u([new i("R", 1)]))]),
      ),
    ]),
    APermCompact: new u([
      new E(
        new u([new i("R", 2)]),
        new u([
          new I(
            new u([new i("F", 2)]),
            new u([new i("R", -1), new i("B", -1), new i("R", 1)]),
          ),
        ]),
      ),
    ]),
    FURURFMoves: new u([
      new i("F", 1),
      new i("U", 1),
      new i("R", 1),
      new i("U", -1),
      new i("R", -1),
      new i("F", -1),
    ]),
    TPerm: new u([
      new i("R", 1),
      new i("U", 1),
      new i("R", -1),
      new i("U", -1),
      new i("R", -1),
      new i("F", 1),
      new i("R", 2),
      new i("U", -1),
      new i("R", -1),
      new i("U", -1),
      new i("R", 1),
      new i("U", 1),
      new i("R", -1),
      new i("F", -1),
    ]),
    HeadlightSwaps: new u([
      new E(
        new u([new i("F", 1)]),
        new u([
          new C(
            new u([new I(new u([new i("R", 1)]), new u([new i("U", 1)]))]),
            3,
          ),
        ]),
      ),
    ]),
    TriplePause: new u([new _(), new _(), new _()]),
  },
  st = {
    73: new i("R"),
    75: new i("R'"),
    87: new i("B"),
    79: new i("B'"),
    83: new i("D"),
    76: new i("D'"),
    68: new i("L"),
    69: new i("L'"),
    74: new i("U"),
    70: new i("U'"),
    72: new i("F"),
    71: new i("F'"),
    78: new i("x'"),
    67: new i("l"),
    82: new i("l'"),
    85: new i("r"),
    77: new i("r'"),
    88: new i("d"),
    188: new i("d'"),
    84: new i("x"),
    89: new i("x"),
    66: new i("x'"),
    186: new i("y"),
    59: new i("y"),
    65: new i("y'"),
    80: new i("z"),
    81: new i("z'"),
    90: new i("M'"),
    190: new i("M'"),
    192: new _(),
  };
export {
  Ue as a,
  nt as b,
  ze as c,
  E as d,
  _ as e,
  B as f,
  i as g,
  C as h,
  Ce as i,
  rt as j,
  He as k,
  Ze as l,
  u as m,
};
//# sourceMappingURL=chunk-RSKU6P22.js.map
