const assert = require('assert');

describe("ARRAY", () => {
    const { BOOL, NUM, STR, NULL, UNDEF, ANY, EXISTS, NOT, IS, Validate }
        = require("../quick_schema.js");

    it("basic", () => {
        assert(Validate([1], [NUM]));
        assert(Validate([1], [IS(1)]));
        assert(Validate([1], [ANY]));
        assert(Validate([1, 2], [NUM]));

        assert(Validate([undefined], [EXISTS]));

        assert(!Validate([true], [NUM]));
        assert(!Validate([undefined], [NUM]));
        assert(!Validate([null], [NUM]));
        assert(!Validate([1, true], [NUM]));
    });

    it("invalid schema", () => {
        assert.throws(() => Validate([], [NUM, ANY]));
    });

    it("empty array", () => {
        assert(Validate([], []));
        assert(Validate([1, true], []));
        assert(Validate([], [NUM]));

        assert(!Validate({}, []));
        assert(!Validate(0, []));
        assert(!Validate(NaN, []));
        assert(!Validate(undefined, []));
        assert(!Validate(null, []));
    });

    it("nested array", () => {
        assert(Validate([], [[]]));
        assert(Validate([[1], [true]], [[]]));
        assert(Validate([[1], [1]], [[NUM]]));

        assert(!Validate([[1], [true]], [[NUM]]));
    });

    it("array and object", () => {
        assert(Validate([ { a : 1 }, { b : 2 } ], [ {} ]));
        assert(Validate({ a: [ 1, 2 ] }, { a: [ NUM ] }));

        assert(!Validate([ { a : 1 }, { b : 2 } ], [ { a : STR } ]));
        assert(!Validate({ a: [ 1, 2 ] }, { a: [ STR ] }));
    });

    it("array and NOT(EXISTS)", () => {
        assert(Validate([], [ NOT(EXISTS) ]));
        assert(!Validate([undefined], [ NOT(EXISTS) ]));
        assert(!Validate([1], [ NOT(EXISTS) ]));
    });

    it("array and UNDEF", () => {
        assert(Validate([undefined], [UNDEF]));
        assert(!Validate([undefined], [NUM]));
    });

    it("array and object", () => {
        assert(!Validate([], { }));
        assert(!Validate({}, []));
    });

    it("error path", () => {
        const { ok, message } = Validate.WithReason([[1,2],[1, NaN, true]],
                                                    [[NUM]]);
        assert(!ok);
        assert.match(message, /'root\[1\]\[2\]'/);
    });
});
