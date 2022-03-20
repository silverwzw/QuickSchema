const assert = require('assert');

describe("NOT", () => {
    const { NUM, STR, BOOL, NULL, UNDEF, IS, ANY, NOT, Validate } =
        require("../simple_schema_validator.js");

    it("basic", () => {
        assert(Validate("", NOT(NUM)));
        assert(Validate(true, NOT(NUM)));
        assert(Validate(null, NOT(NUM)));
        assert(Validate(undefined, NOT(NUM)));

        assert(Validate(1, NOT(STR)));
        assert(Validate(1, NOT(BOOL)));
        assert(Validate(1, NOT(NULL)));
        assert(Validate(1, NOT(UNDEF)));

        assert(Validate(1, NOT(IS(2))));
        assert(Validate(1, NOT(IS(true))));
        assert(Validate({}, NOT(IS({}))));

        assert(!Validate(1, NOT(NUM)));
        assert(!Validate(true, NOT(BOOL)));
        assert(!Validate(null, NOT(NULL)));
        assert(!Validate(undefined, NOT(UNDEF)));
        assert(!Validate("", NOT(STR)));

        assert(!Validate(1, NOT(IS(1))));

        const a = {};
        assert(!Validate(a, NOT(IS(a))));
    });


    it("NaN", () => {
        assert(Validate(NaN, NOT(NULL)));
        assert(Validate(NaN, NOT(UNDEF)));

        assert(!Validate(NaN, NOT(NUM)));
        assert(!Validate(NaN, NOT(IS(NaN))));
    });

    it("NOT(ANY)", () => {
        assert(!Validate(NaN, NOT(ANY)));
        assert(!Validate(1, NOT(ANY)));
        assert(!Validate({}, NOT(ANY)));
        assert(!Validate(undefined , NOT(ANY)));
        assert(!Validate(null, NOT(ANY)));
        assert(!Validate(false, NOT(ANY)));
        assert(!Validate("", NOT(ANY)));
    });

    it("NOT(NOT())", () => {
        assert(Validate(NaN, NOT(NOT(ANY))));
        assert(Validate(1, NOT(NOT(ANY))));
        assert(Validate({}, NOT(NOT(ANY))));
        assert(Validate(undefined , NOT(NOT(ANY))));
        assert(Validate(null, NOT(NOT(ANY))));
        assert(Validate(false, NOT(NOT(ANY))));
        assert(Validate("", NOT(NOT(ANY))));
    });
});
