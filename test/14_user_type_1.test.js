const assert = require('assert');

describe("UserType (function)", () => {
    const { IS, BOOL, ALL_OF, ONE_OF, NOT, NUM, Validate } =
        require("../simple_schema_validator.js");

    it("Basic", () => {
        const user_lib = { "AlwaysTrue": () => true };
        assert(Validate(1, "AlwaysTrue", user_lib));
        assert(Validate(1, NUM, user_lib));
    });

    it("Missing user type", () => {
        const user_lib = { "AlwaysTrue": () => true };
        assert.throws(() => Validate(1, "AlwaysFalse", user_lib));
    });

    it("User function returning boolean", () => {
        const user_lib = { "NonZero": n => n !== 0 };
        assert(Validate(1, "NonZero", user_lib));
        assert(!Validate(0, "NonZero", user_lib));
    });

    it("User function returning string", () => {
        const user_lib = {
            "NonZero": n => { if (n === 0) { return "error123"; } }
        };

        assert(Validate(1, "NonZero", user_lib));
        assert(!Validate(0, "NonZero", user_lib));

        const { ok, message } = Validate.WithReason(0, "NonZero", user_lib);
        assert(!ok);
        assert(message.match(/error123/) !== null);
    });

    it("Invalid user type", () => {
        const user_lib = { "WrongType": 1 };
        assert.throws(() => Validate(1, "WrongType", user_lib));
    });

    it("Mutiple user types", () => {
        const user_lib = {
            "NonEmptyString": s => s.length > 0,
            "IsRegexp": r => r instanceof RegExp
        };

        assert(Validate({ s: "a", r: /.*/, a: 1 },
                        { s: "NonEmptyString",
                          r: "IsRegexp",
                          a: NUM }, user_lib));

        assert(!Validate("", "NonEmptyString", user_lib));
        assert(!Validate("", "IsRegexp", user_lib));
    });

    it("User type with ALL_OF", () => {
        const user_lib = { "GT5": n => n > 5, "LE10": n => n < 10 };

        assert(Validate(6, "GT5", user_lib));
        assert(!Validate(1, "GT5", user_lib));
        assert(Validate(6, "LE10", user_lib));
        assert(!Validate(100, "LE10", user_lib));

        assert(Validate(6, ALL_OF("GT5", IS(6)), user_lib));
        assert(!Validate(7, ALL_OF("GT5", IS(6)), user_lib));
        assert(!Validate(4, ALL_OF(IS(4), "GT5"), user_lib));
        assert(Validate(6, ALL_OF(NUM, "GT5"), user_lib));

        assert(Validate(6, ALL_OF("GT5", "LE10"), user_lib));
        assert(!Validate(11, ALL_OF("GT5", "LE10"), user_lib));
        assert(!Validate(0, ALL_OF("GT5", "LE10"), user_lib));
    });

    it("User type with ONE_OF", () => {
        const user_lib = { "GT5": n => n > 5, "LE3": n => n < 3 };

        assert(Validate(6, "GT5", user_lib));
        assert(!Validate(1, "GT5", user_lib));
        assert(!Validate(6, "LE3", user_lib));
        assert(Validate(1, "LE3", user_lib));
        assert(!Validate(true, "GT5", user_lib));

        assert(Validate(true, ONE_OF("GT5", BOOL), user_lib));
        assert(Validate(1, ONE_OF("GT5", IS(1)), user_lib));
        assert(Validate(6, ONE_OF("GT5", IS(1)), user_lib));
        assert(Validate(8, ONE_OF("GT5", NUM), user_lib));
        assert(!Validate(1, ONE_OF("GT5", BOOL), user_lib));


        assert(Validate(1, ONE_OF("GT5", "LE3"), user_lib));
        assert(Validate(6, ONE_OF("GT5", "LE3"), user_lib));
        assert(!Validate(4, ONE_OF("GT5", "LE3"), user_lib));
    });

    it("User type with NOT", () => {
        const user_lib = { "NonZero": n => n !== 0 };

        assert(Validate(1, "NonZero", user_lib));
        assert(!Validate(0, "NonZero", user_lib));
        assert(!Validate(1, NOT("NonZero"), user_lib));
        assert(Validate(0, NOT("NonZero"), user_lib));
    });

    it("User type in array", () => {
        let user_lib = { "NonZero": n => n !== 0 };

        assert(Validate([1], ["NonZero"], user_lib));
        assert(!Validate([0], ["NonZero"], user_lib));
        assert(Validate([[1]], [["NonZero"]], user_lib));
        assert(!Validate([[0]], [["NonZero"]], user_lib));

        user_lib = { "IsArray": e => e instanceof Array };
        assert(Validate([[]], ["IsArray"], user_lib));
        assert(!Validate([[]], [NOT("IsArray")], user_lib));
    });

    it("User type in object", () => {
        let user_lib = { "NonZero": n => n !== 0 };
        assert(Validate({ a: 1 }, { a: "NonZero" }, user_lib));
        assert(!Validate({ a: 0 }, { a: "NonZero" }, user_lib));
        assert(Validate({ a: { a: 1 } }, { a: { a: "NonZero" } }, user_lib));
        assert(!Validate({ a: { a: 0 } }, { a: { a: "NonZero" } }, user_lib));

        user_lib = { "IsObject": e => e instanceof Object};
        assert(Validate({a: {} }, { a: "IsObject" }, user_lib));
        assert(!Validate({a: {} }, { a: NOT("IsObject") }, user_lib));
    });

    it("Mutiple user libraries", () => {
        const user_lib = {
            "NonEmptyString": s => s.length > 0,
            "IsRegexp": r => r instanceof RegExp
        };

        const user_lib_2 = {
            "IsDate": d => d instanceof Date
        };

        assert(Validate({ s: "a", r: /.*/, a: 1, d: new Date() },
                        { s: "NonEmptyString",
                          r: "IsRegexp",
                          d: "IsDate",
                          a: NUM }, user_lib, user_lib_2));

        assert(!Validate("", "NonEmptyString", user_lib, user_lib_2));
        assert(!Validate("", "IsRegexp", user_lib, user_lib_2));
        assert(!Validate("", "IsDate", user_lib, user_lib_2));

        assert(Validate("", NOT("NonEmptyString"), {}, {}, user_lib));
        assert(!Validate("a", NOT("NonEmptyString"), {}, {}, user_lib));
    });

    it("Duplicate user type", () => {
        const user_lib = {
            "NonEmptyString": s => s.length > 0,
            "IsRegexp": r => r instanceof RegExp
        };

        const user_lib_2 = {
            "NonEmptyString": s => s[0] !== undefined,
            "IsDate": d => d instanceof Date
        };

        assert.throws(
            () => Validate("a", "NonEmptyString", user_lib, user_lib_2));
    });

    it("Nested Validate", () => {
        const user_lib = {};
        user_lib["one"] = e => e > 5 || Validate(e, "two", user_lib);
        user_lib["two"] = e => e < -2 || Validate(e, NOT("three"), user_lib);
        user_lib["three"] = e => e !== 0;

        assert(Validate(6, "one", user_lib));
        assert(Validate(-3, "one", user_lib));
        assert(Validate(0, "one", user_lib));

        assert(!Validate(-1, "one", user_lib));
        assert(!Validate(1, "one", user_lib));
    });

    it("User type function throws", () => {
        const user_lib = {
            WillThrow: () => { throw new Error("error abc"); }
        };

        assert.throws(() => Validate(1, "WillThrow", user_lib), /error abc/);
    });
});
