const assert = require('assert');

describe("ONE_OF", () => {
    const { ANY, NUM, STR, ONE_OF, NOT, BOOL, Validate } =
        require("../simple_schema_validator.js");

    it("basic", () => {
        assert(Validate(1, ONE_OF(NUM)));
        assert(Validate(1, ONE_OF(ANY, STR)));
        assert(Validate(1, ONE_OF(NUM, STR)));
        assert(Validate(1, ONE_OF(NOT(ANY), NUM, BOOL)));

        assert(!Validate(1, ONE_OF(STR)));
        assert(!Validate(1, ONE_OF(STR, NOT(ANY))));
        assert(!Validate(1, ONE_OF(STR, BOOL, NOT(ANY))));
    });

    it("Invalid schema", () => {
        assert.throws(() => Validate(1, ONE_OF()));
    });

    it("with array", () => {
        assert(Validate([ 1 ], [ONE_OF(NUM, { a: NUM })]));
        assert(Validate([ {a: 3} ], [ONE_OF(NUM, { a: NUM })]));
        assert(Validate([ 1, {a: 3}, 2], [ONE_OF(NUM, { a: NUM })]));

        assert(!Validate([ true ], [ONE_OF(NUM, { a: NUM })]));
    });

    it("nested ONE_OF", () => {
        assert(Validate(1, ONE_OF(ONE_OF(NUM, STR), BOOL)));
        assert(Validate("", ONE_OF(ONE_OF(NUM, STR), BOOL)));
        assert(Validate(true, ONE_OF(ONE_OF(NUM, STR), BOOL)));

        assert(!Validate({}, ONE_OF(ONE_OF(NUM, STR), BOOL)));
    });

    it("with object", () => {
        assert(Validate({ a: 1, b: true },
                        { a: ONE_OF(NUM, BOOL), b: ONE_OF(NUM, BOOL)}));
        assert(!Validate({ a: "" },
                         { a: ONE_OF(NUM, BOOL), b: ONE_OF(NUM, BOOL)}));
    });
});
