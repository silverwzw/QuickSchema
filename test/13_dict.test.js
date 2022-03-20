const assert = require('assert');

describe("DICT", () => {
    const { NUM, STR, DICT, Validate } =
        require("../simple_schema_validator.js");

    it("basic", () => {
        assert(Validate({}, DICT(NUM)));
        assert(Validate({ a: 1, c: 2 }, DICT(NUM)));

        assert(Validate({}, DICT({}, NUM)));
        assert(Validate({ a: 1, b: 2, c: 3 }, DICT({}, NUM)));
        assert(Validate({ a: "1", b: 2, c: 3 }, DICT({ a: STR }, NUM)));

        assert(!Validate({ a: "1", b: 2, c: 3 }, DICT(NUM)));
        assert(!Validate({ a: "1", b: 2, c: 3 }, DICT({}, NUM)));
        assert(!Validate({ a: 1, b: 2, c: 3 }, DICT({ a: STR }, NUM)));
    });
});
