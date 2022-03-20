const assert = require('assert');

describe("EXISTS", () => {
    const { EXISTS, NOT, Validate } = require("../simple_schema_validator.js");

    it("basic", () => {
        assert(!Validate({},  { a: EXISTS }));

        assert(Validate({ a: {} },  { a: EXISTS }));
        assert(Validate({ a: 1 },  { a: EXISTS }));
        assert(Validate(true,  EXISTS));
        assert(Validate(false, EXISTS));
        assert(Validate(undefined, EXISTS));
        assert(Validate(null, EXISTS));
        assert(Validate([], EXISTS));
        assert(Validate([1], EXISTS));
        assert(Validate({}, EXISTS));
        assert(Validate({a : 1}, EXISTS));
        assert(Validate(0, EXISTS));
        assert(Validate("true", EXISTS));
        assert(Validate(NaN, EXISTS));
    });

    it("NOT(EXISTS)", () => {
        assert(Validate({},  { a: NOT(EXISTS) }));

        assert(!Validate({ a: {} },  { a: NOT(EXISTS) }));
        assert(!Validate({ a: 1 },  { a: NOT(EXISTS) }));
        assert(!Validate(true,  NOT(EXISTS)));
        assert(!Validate(false, NOT(EXISTS)));
        assert(!Validate(undefined, NOT(EXISTS)));
        assert(!Validate(null, NOT(EXISTS)));
        assert(!Validate([], NOT(EXISTS)));
        assert(!Validate([1], NOT(EXISTS)));
        assert(!Validate({}, NOT(EXISTS)));
        assert(!Validate({a : 1}, NOT(EXISTS)));
        assert(!Validate(0, NOT(EXISTS)));
        assert(!Validate("true", NOT(EXISTS)));
        assert(!Validate(NaN, NOT(EXISTS)));
    });
});
