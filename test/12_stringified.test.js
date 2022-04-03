const assert = require('assert');

describe("STRINGIFIED", () => {
    const { NUM, IS, STRINGIFIED, UNDEF, NOT, EXISTS, BOOL, STR, ANY, NULL,
            Validate } =
        require("../quick_schema.js");

    it("basic", () => {
        assert(Validate("1", STRINGIFIED(NUM)));
        assert(Validate("false", STRINGIFIED(IS(false))));

        assert(Validate({ str: '{ "a": "" }' },
                        { str: STRINGIFIED({ a: STR, b: UNDEF }) }));

        assert(Validate('{ "a": { "b": true, "c": [1, 2] }, "d": ""}',
                        STRINGIFIED({ a: { b: BOOL, c: [NUM] },
                                      d: STR, e: NOT(EXISTS) })));

        assert(!Validate(1, STRINGIFIED(NUM)));
        assert(!Validate("", STRINGIFIED(UNDEF)));
        assert(!Validate("", STRINGIFIED(NOT(EXISTS))));
        assert(!Validate("abc", STRINGIFIED(ANY)));
    });

    it("nested STRINGIFIED", () => {
        assert(Validate('"{\\"a\\":null}"',
                        STRINGIFIED(STRINGIFIED({a: NULL}))));
        assert(Validate('{"A":"{\\"a\\":1}"}',
                        STRINGIFIED({ A: STRINGIFIED({ a: ANY }) })));
    });
});
