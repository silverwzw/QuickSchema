const assert = require('assert');

describe("primitives", () => {
    const { Validate, BOOL, NUM, STR, NULL, UNDEF } =
        require("../simple_schema_validator.js");

    it("BOOL", () => {
        assert(Validate(true,  BOOL));
        assert(Validate(false, BOOL));

        assert(!Validate(undefined, BOOL));
        assert(!Validate(null, BOOL));
        assert(!Validate([], BOOL));
        assert(!Validate({}, BOOL));
        assert(!Validate(0, BOOL));
        assert(!Validate("true", BOOL));
        assert(!Validate(Boolean, BOOL));
        assert(!Validate(BOOL, BOOL));
    });
    it("NUM", () => {
        assert(Validate(1,         NUM));
        assert(Validate(0,         NUM));
        assert(Validate(-1,        NUM));
        assert(Validate(0.1,       NUM));
        assert(Validate(1e8,       NUM));
        assert(Validate(NaN,       NUM));
        assert(Validate(Infinity,  NUM));
        assert(Validate(-Infinity, NUM));

        assert(!Validate(undefined, NUM));
        assert(!Validate(null, NUM));
        assert(!Validate([], NUM));
        assert(!Validate({}, NUM));
        assert(!Validate(true, NUM));
        assert(!Validate("1", NUM));
        assert(!Validate("number", NUM));
        assert(!Validate(Number, NUM));
        assert(!Validate(NUM, NUM));
    });
    it("STR", () => {
        assert(Validate("",        STR));
        assert(Validate("abc",     STR));

        assert(!Validate(undefined, STR));
        assert(!Validate(null, STR));
        assert(!Validate([], STR));
        assert(!Validate(['a','b'], STR));
        assert(!Validate({}, STR));
        assert(!Validate(true, STR));
        assert(!Validate(1, STR));
        assert(!Validate(String, STR));
        assert(!Validate(STR, STR));
    });
    it("NULL", () => {
        assert(Validate(null, NULL));

        let null_proto_object = Object.create(null);
        assert(!Validate(undefined, NULL));
        assert(!Validate([], NULL));
        assert(!Validate({}, NULL));
        assert(!Validate(true, NULL));
        assert(!Validate(1, NULL));
        assert(!Validate("null", NULL));
        assert(!Validate(null_proto_object, NULL));
        assert(!Validate(NULL, NULL));
    });
    it("UNDEF", () => {
        assert(Validate(undefined, UNDEF));
        assert(Validate(({}).a, UNDEF));

        let null_proto_object = Object.create(null);
        assert(!Validate(null, UNDEF));
        assert(!Validate([], UNDEF));
        assert(!Validate({}, UNDEF));
        assert(!Validate(true, UNDEF));
        assert(!Validate(1, UNDEF));
        assert(!Validate("undefined", UNDEF));
        assert(!Validate(null_proto_object, UNDEF));
        assert(!Validate(UNDEF, UNDEF));
    });
});
