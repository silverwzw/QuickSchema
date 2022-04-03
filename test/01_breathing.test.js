const assert = require('assert');

describe("module", () => {
    let sjc;
    it("module require", () => {
        sjc = require("../quick_schema.js");
    });
    describe("module exports", () => {
        it("BOOL", () => {
            assert.notEqual(sjc.BOOL, undefined);
        });
        it("NUM", () => {
            assert.notEqual(sjc.NUM, undefined);
        });
        it("STR", () => {
            assert.notEqual(sjc.STR, undefined);
        });
        it("NULL", () => {
            assert.notEqual(sjc.NULL, undefined);
        });
        it("UNDEF", () => {
            assert.notEqual(sjc.UNDEF, undefined);
        });
        it("ANY", () => {
            assert.notEqual(sjc.ANY, undefined);
        });
        it("DICT", () => {
            assert.notEqual(sjc.DICT, undefined);
        });
        it("ALL_OF", () => {
            assert.notEqual(sjc.ALL_OF, undefined);
        });
        it("ONE_OF", () => {
            assert.notEqual(sjc.ONE_OF, undefined);
        });
        it("IS", () => {
            assert.notEqual(sjc.IS, undefined);
        });
        it("NOT", () => {
            assert.notEqual(sjc.NOT, undefined);
        });
        it("STRINGIFIED", () => {
            assert.notEqual(sjc.STRINGIFIED, undefined);
        });
        it("OPTIONAL", () => {
            assert.notEqual(sjc.OPTIONAL, undefined);
        });
        it("EXISTS", () => {
            assert.notEqual(sjc.EXISTS, undefined);
        });
        it("Validator", () => {
            assert.equal(typeof sjc.Validate, "function");
        });
    });
});
