const assert = require('assert');

describe("IS", () => {
    const { IS, Validate } = require("../simple_schema_validator.js");

    it("basic", () => {
        assert(Validate(1, IS(1)));
        assert(Validate(1.5, IS(1.5)));
        assert(!Validate(1, IS(0)));
        assert(!Validate(-1, IS(1)));
        assert(!Validate([], IS(0)));
        assert(!Validate("0", IS(0)));

        assert(Validate("", IS("")));
        assert(!Validate("", IS("a")));
        assert(!Validate("a", IS("")));
        assert(!Validate([], IS("")));
        assert(!Validate(0, IS("")));
        assert(!Validate(1, IS("1")));

        assert(Validate(null, IS(null)));
        assert(!Validate(0, IS(null)));
        assert(!Validate(undefined, IS(null)));

        assert(Validate(undefined, IS(undefined)));
        assert(!Validate(0, IS(undefined)));
        assert(!Validate(null, IS(undefined)));

        assert(Validate(true, IS(true)));
        assert(!Validate(false, IS(true)));
        assert(!Validate(1, IS(true)));
        assert(Validate(false, IS(false)));
        assert(!Validate(0, IS(false)));
        assert(!Validate(true, IS(false)));

        const oa = {}, ob = {};
        assert(Validate(oa, IS(oa)));
        assert(!Validate(oa, IS(ob)));

        const aa = [], ab = [];
        assert(Validate(aa, IS(aa)));
        assert(!Validate(aa, IS(ab)));
    });
    it("NaN", () => {
        assert(Validate(NaN, IS(NaN)));
        assert(!Validate(2,   IS(NaN)));
        assert(!Validate(NaN, IS(2)));
    });
});
