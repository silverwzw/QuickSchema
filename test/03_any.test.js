const assert = require('assert');

describe("ANY", () => {
    const { ANY, Validate } = require("../quick_schema.js");

    it("basic", () => {
        assert(Validate(true,  ANY));
        assert(Validate(false, ANY));
        assert(Validate(undefined, ANY));
        assert(Validate(null, ANY));
        assert(Validate([], ANY));
        assert(Validate([1], ANY));
        assert(Validate({}, ANY));
        assert(Validate({a:1}, ANY));
        assert(Validate(0, ANY));
        assert(Validate("true", ANY));
        assert(Validate(NaN, ANY));
    });
});
