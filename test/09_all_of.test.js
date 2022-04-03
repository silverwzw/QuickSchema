const assert = require('assert');

describe("ALL_OF", () => {
    const { ANY, NUM, IS, ALL_OF, STR, NOT, EXISTS, BOOL, Validate } =
        require("../quick_schema.js");

    it("basic", () => {
        assert(Validate(1, ALL_OF(NUM)));
        assert(Validate(1, ALL_OF(NUM, IS(1))));
        assert(Validate(1, ALL_OF(ANY, NUM, IS(1))));

        assert.throws(() => { Validate(1, ALL_OF()); });

        assert(!Validate(1, ALL_OF(STR)));
        assert(!Validate(1, ALL_OF(NUM, IS(2))));
        assert(!Validate(1, ALL_OF(NOT(ANY), NUM, IS(1))));
        assert(!Validate(1, ALL_OF(NOT(ANY), STR, IS(1))));

    });

    it("complex example", () => {
        assert(Validate({ a: { b : 2, c: true } },
                        { a: ALL_OF(EXISTS,
                                    {
                                        b: ALL_OF(
                                            NOT(IS(3)),
                                            ANY)
                                    },
                                    {
                                        c: BOOL
                                    })
                        }));
    });

    it("nested ALL_OF", () => {
        assert(Validate(1, ALL_OF(
                            ALL_OF(IS(1)),
                            ALL_OF(ANY,
                                   NUM,
                                   ALL_OF(NOT(STR))))));
    });
});
