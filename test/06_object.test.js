const assert = require('assert');

describe("OBJECT", () => {
    const { BOOL, NUM, STR, NULL, UNDEF, ANY, EXISTS, NOT, IS, Validate }
        = require("../quick_schema.js");

    it("basic", () => {
        assert(Validate({ },  { }));
        assert(Validate({ a : 1 },  { }));
        assert(Validate({ a : 1 },  { a : NUM }));
        assert(Validate({ a : true },  { a : BOOL }));
        assert(Validate({ a : "" },  { a : STR }));
        assert(Validate({ a : {} },  { a : ANY }));
        assert(Validate({ a : null },  { a : NULL }));
        assert(Validate({ a : 1 },  { a : IS(1) }));
        assert(Validate({ a : 1, b : 2 },  { a : NUM }));
        assert(Validate({ a : 1, b : "aa" },  { a : NUM, b : STR }));
        assert(!Validate({ },  { a : NUM }));
        assert(!Validate({ a : ""  },  { a : NUM }));
        assert(!Validate({ a : undefined  },  { a : NUM }));
        assert(!Validate(1,  { }));
        assert(!Validate(true,  { }));
        assert(!Validate("",  { }));
        assert(!Validate([],  { }));
        assert(!Validate(1,  { }));
        assert(!Validate(null,  { }));
        assert(!Validate(undefined,  { }));
    });

    it("interaction with NOT(EXISTS)", () => {
        assert(Validate({ },  { a : NOT(EXISTS) }));
        assert(Validate({ },  { a : NOT(EXISTS), b : UNDEF }));
        assert(Validate({ b: undefined },  { a : NOT(EXISTS), b : UNDEF }));
        assert(Validate({ b: 1 },  { a : NOT(EXISTS), b : NUM }));

        assert(!Validate({ a : 1 },  { a : NOT(EXISTS) }));
        assert(!Validate({ a : undefined  },  { a : NOT(EXISTS) }));
    });

    it("interaction with UNDEF", () => {
        assert(Validate({ a : undefined },  { a : UNDEF }));
        assert(Validate({ },  { a : UNDEF }));

        assert(!Validate({ a : 1 },  { a : UNDEF }));

        assert(Validate({ a : 1 },  { a : NOT(UNDEF) }));
        assert(!Validate({ },  { a : NOT(UNDEF) }));
    });

    it("interaction with ANY", () => {
        assert(Validate({ a : 1 },  { a : ANY }));
        assert(Validate({ },  { a : ANY }));
        assert(!Validate({ },  { a : NOT(ANY) }));
    });

    describe("complex object", () => {
        const a = { a: 1 };

        it("null object", () => {
            assert(!Validate(Object.create(null), { }));
        });

        it("object with prototype", () => {
            const c = Object.create(a, { c: { value: 3 } });
            c.cc = "3";
            assert(Validate(c, { a: NUM, c: NUM, cc: STR }));

            class B {
                b2;
                #b1;
                constructor() {
                    this.b = 2;
                    this.#b1 = 1;
                }
            };
            const b = new B();
            b.bb = "2";

            assert(Validate(b, { b: NUM, bb: STR }));
            assert(Validate(b, { b1: NOT(EXISTS) }));
            assert(Validate(b, { "#b1": NOT(EXISTS) }));
            assert(!Validate(b, { b2: NOT(EXISTS) }));

            class D extends B {
                d2;
                #d1;
                constructor() {
                    super();
                    this.d = 4;
                    this.#d1 = 1;
                }
            };
            const d = new D();
            d.dd = "4";

            assert(Validate(d, { b: NUM, dd: STR, d: NUM }));
            assert(Validate(d, { b1: NOT(EXISTS) }));
            assert(Validate(d, { "#b1": NOT(EXISTS) }));
            assert(!Validate(d, { b2: NOT(EXISTS) }));
            assert(Validate(d, { d1: NOT(EXISTS) }));
            assert(Validate(d, { "#d1": NOT(EXISTS) }));
            assert(!Validate(d, { d2: NOT(EXISTS) }));


            function F() { this.f = 6; };
            const f = new F();
            f.ff = "6";

            assert(Validate(f, { ff: STR, f: NUM }));
        });

        it("object with getter", () => {
            const a = Object.create(Object.prototype, {
                a: {
                    get: function() { return 1; }
                }
            });

            assert(Validate(a, { a : NUM }));
            assert(!Validate(a, { a : NOT(EXISTS) }));
        });

        it("object with setter only", () => {
            const a = Object.create(Object.prototype, {
                a: {
                    set: function() { return 1; }
                }
            });

            assert(Validate(a, { a : UNDEF }));
            assert(!Validate(a, { a : NOT(EXISTS) }));
        });

        it("object with non-enumerable", () => {
            const a = Object.create(Object.prototype, {
                a: {
                    value: 1,
                    enumerable : false
                }
            });

            assert(Validate(a, { a : NUM }));
            assert(!Validate(a, { a : NOT(EXISTS) }));
        });
    });

    it("non-identifier key value", () => {
        assert(Validate({ "1a" : 1 }, { "1a" : NUM }));
        assert(Validate({ "#1" : 1 }, { "#1" : NUM }));
        assert(Validate({ "1" : 1 }, { "1" : NUM }));

        assert(!Validate({ }, { "#1" : NUM }));
    });

    it("non-string key value", () => {
        assert(Validate({ true : 1, false : false },
                        { true : NUM, false : BOOL }));
        assert(!Validate({ true : 1 }, { true : BOOL }));
        assert(!Validate({ }, { true : BOOL }));

        assert(Validate({ 1 : "", 2 : null }, { 1 : STR, 2 : NULL }));
        assert(!Validate({ 1 : "" }, { 1: BOOL }));
        assert(!Validate({ }, { 1 : STR }));
    });

    it("nested OBJECT", () => {
        assert(Validate({ a: { } }, { a: ANY }));
        assert(Validate({ a: { } }, { }));
        assert(Validate({ a: { } }, { a: { } }));
        assert(Validate({ a: { a: 1 } }, { a: { } }));
        assert(Validate({ a: { a: 1 } }, { a: { a : NUM } }));

        assert(Validate(
            { a1: 1, a2: { b1: true }, a3: { b2: { c1: null, c2: "x" } } },
            { a1: NUM, a2: { b1: BOOL }, a3: { b2: { c1: NULL, c2: STR } } }));

        assert(!Validate({ }, { a: { } }));
        assert(!Validate({ a: undefined }, { a: { } }));
        assert(!Validate({ a: "" }, { a: { } }));
        assert(!Validate({ a: { } }, { a: STR }));
        assert(!Validate({ a: { a: 1 } }, { a: { a : BOOL } }));
    });

    it("error path", () => {
        const { ok, message } = Validate.WithReason({ a: { b: { c: 1 } } },
                                                    { a: { b: { c: BOOL } } });
        assert(!ok);
        assert.match(message, /'root\.a\.b\.c'/);
    });
});
