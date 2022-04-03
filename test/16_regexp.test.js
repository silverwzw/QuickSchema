const assert = require('assert');

describe("RegEx", () => {
    const { Validate, ALL_OF } = require("../quick_schema.js");

    it("default", () => {
        assert(Validate("", /^$/));
        assert(!Validate("1", /^$/));
        assert(Validate("abab", /^(ab)+$/));
        assert(!Validate("ba", /^(ab)+$/));

        assert(Validate("abab", /ba/));

        const schema = { name: ALL_OF(String, /Jack(son)?/, /Andrew/) };
        assert(Validate({ name: "Andrew Jack" }, schema));
        assert(Validate({ name: "Andrew Jackson" }, schema));
        assert(Validate({ name: "Jackson Andrew" }, schema));
        assert(!Validate({ name: "Andy Jackson" }, schema));
    });
});
