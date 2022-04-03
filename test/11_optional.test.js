const assert = require('assert');

describe("OPTIONAL", () => {
    const { OPTIONAL, NUM, Validate } =
        require("../quick_schema.js");

    it("basic", () => {
        assert(Validate(1, OPTIONAL(NUM)));
        assert(Validate(undefined, OPTIONAL(NUM)));
        assert(Validate(NaN, OPTIONAL(NUM)));

        assert(!Validate(null, OPTIONAL(NUM)));
        assert(!Validate("", OPTIONAL(NUM)));

        assert(Validate({}, { a: OPTIONAL(NUM) }));
        assert(Validate({ a: 1 }, { a: OPTIONAL(NUM) }));
        assert(Validate({ a: undefined }, { a: OPTIONAL(NUM) }));

        assert(!Validate({ a: true }, { a: OPTIONAL(NUM) }));
    });

    it("Invalid schema", () => {
        assert.throws(() => Validate(1, OPTIONAL()));
    });

    it("nested optional", () => {
        assert(Validate(1, OPTIONAL(OPTIONAL(NUM))));
        assert(Validate(undefined, OPTIONAL(OPTIONAL(NUM))));

        assert(!Validate(null, OPTIONAL(OPTIONAL(NUM))));
        assert(!Validate(true, OPTIONAL(OPTIONAL(NUM))));
    });
});
