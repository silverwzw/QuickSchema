
describe("code example in README", () => {
    it("Quick start", () => {
        const assert = require('assert');
        const { Validate, OPTIONAL, ONE_OF, IS } =
                require("../quick_schema.js");

        // Schema definition for "Person"
        const PersonSchema = {
          name: {
              first: String,
              last: String,
              middle: OPTIONAL(String)
          },
          age: Number,               // `age` must be a number
          pronouns: ONE_OF(IS("he"), IS("she")),
                                     // `pronouns` must be either "he" or "she"
        };

        const Alice = {
            name: { first: "Alice", last: "Silva" },
            age: 35,
            pronouns: "she"
        };

        let ok = Validate(Alice, PersonSchema);
        assert(ok);    // Evaluates to true
    });

    const assert = require('assert');
    const { Validate, OPTIONAL, IS, DICT, NOT, ALL_OF, ONE_OF, ANY,
            EXISTS, STRINGIFIED } =
            require("../quick_schema.js");

    describe("Validators", () => {
        it("Primitive types", () => {
            const { Validate, NULL, UNDEF } =
                        require("../quick_schema.js");

            assert(Validate("string",  String));
            assert(Validate(true,      Boolean));
            assert(Validate(0,         Number));
            assert(Validate(null,      NULL));
            assert(Validate(undefined, UNDEF));
        });
        it("Objects", () => {
            const ContactSchema = {
                name: String,
                phone: { country_code: Number, number: Number },
                address: {
                    line_1: String,
                    line_2: OPTIONAL(String),
                    city: String,
                    state: String,
                    zip_code: Number,
                    country: String
                }
            };
            assert(Validate({
                name: "Steven",
                phone: { country_code: 1, number: 5555555555 },
                address: {
                    line_1: "50 W 34St",
                    city: "Big Apple",
                    state: "NY",
                    zip_code: 10000,
                    country: "US"
                },
                note: ""
            }, ContactSchema));
        });
        it("Array", () => {
            const NumberArraySchema = [Number];
            let ok = Validate([1,1,2,3,5,8], NumberArraySchema);
            assert(ok);
            ok = Validate([1,"1",2,3,5,8], NumberArraySchema);
            assert(!ok);
        });
        it("Dictionary", () => {
            const ImdbRatingSchema= DICT(Number);
            assert(Validate({
                "The Shawshank Redemption": 9.3,
                "The Godfather": 9.2,
                "The Dark Knight": 9.1,
                "The Lord of the Rings: The Return of the King": 9.0,
                "Schindler's List": 9.0
            }, ImdbRatingSchema));

            const ImdbRatingSchema2 = DICT({ dictionary_name: String }, Number);
            assert(Validate({
                "dictionary_name": "IMDB Score",
                "The Shawshank Redemption": 9.3,
                "The Godfather": 9.2,
                "The Dark Knight": 9.1,
                "The Lord of the Rings: The Return of the King": 9.0,
                "Schindler's List": 9.0
            }, ImdbRatingSchema2));
        });
        describe("Logical Operators", () => {
            it("NOT", () => {
                let ok;
                ok = Validate("1", NOT(Number));
                assert(ok);
                ok = Validate(1, NOT(Number));
                assert(!ok);
            });
            it("ALL_OF", () => {
                const EmployeeSchema = {
                    name: String,
                    title: String
                };
                const PersonSchema = {
                    name: String,
                    age: Number,
                };
                assert(Validate({
                   name: "Steven",
                   title: "Individual Contributor",
                   age: 33
                }, ALL_OF(EmployeeSchema, PersonSchema)));
            });
            it("ONE_OF", () => {
                let ok;
                ok = Validate(1, ONE_OF(Number, String));
                assert(ok);
                ok = Validate("", ONE_OF(Number, String));
                assert(ok);
                ok = Validate(true, ALL_OF(Number, String));
                assert(!ok);
            });
        });
        describe("Special Validator", () => {
            it("ANY", () => {
                assert(Validate({},        ANY));
                assert(Validate(false,     ANY));
                assert(Validate(undefined, ANY));
                assert(Validate({}, { data: ANY }));
            });
            it("EXISTS", () => {
                const schema = {
                    name: EXISTS,
                    nick_name: NOT(EXISTS)
                };
                let ok;
                ok = Validate({ name: "Nina" }, schema);
                assert(ok);
                ok = Validate({ }, schema);
                assert(!ok);
                ok = Validate({ name: "Catherine", nick_name: "Kay" }, schema);
                assert(!ok);
            });
            it("IS", () => {
                let ok;
                ok = Validate(1, IS(1));
                assert(ok);
                ok = Validate(2, IS(1));
                assert(!ok);

                ok = Validate({ lang: "C++" }, { lang: ONE_OF(IS("C++"),
                                                              IS("Javascript"),
                                                              IS("Go")) });
                assert(ok);
            });
            it("STRINGIFIED", () => {
                assert(Validate("1", STRINGIFIED(Number)));
                assert(Validate('{ "name": "Maggie" }',
                                STRINGIFIED({ name: String })));
            });
            it("OPTIONAL", () => {
                const Schema = {
                    name: String,
                    salary: OPTIONAL(Number)
                };
                assert(Validate({ name: "Summer" }, Schema));
                assert(Validate({ name: "Summer", salary: 100 }, Schema));
            });
            it("Regular Expression", () => {
                const Schema = {
                    name: /^Andrew Jack(son)?$/
                };
                let ok;
                ok = Validate({ name: "Andrew Jackson"}, Schema);
                assert(ok);
                ok = Validate({ name: "Andrew Jack"}, Schema);
                assert(ok);
                ok = Validate({ name: "Andy Jack" }, Schema);
                assert(!ok);
            });
        });
    });

    describe("User defined validators", () => {
        describe("Schema alias", () => {
            it("default", () => {
                const Library = {
                    "Person": {
                        name: String,
                    },
                    "Employee": ALL_OF("Person", { salary: Number })
                };
                const employees = [ { name: "Alice", salary: 100 },
                                    { name: "Bob",   salary: 100 } ];
                assert(Validate(employees, ["Employee"], Library));
            });
            it("Self reference", () => {
                const Library = {
                    "LinkedList": {
                        next: OPTIONAL("LinkedList"),
                        data: ANY
                    }
                };
                const node1 = { data: 3721 };
                const node2 = { data: 360, next: node1 };
                assert(Validate(node2, "LinkedList", Library));
            });
        });
        it("Custom validator logic", () => {
            const Library = {
                "PositiveNumber": (num) => {
                    return num > 0;
                }
            };
            let ok;
            ok = Validate(1, "PositiveNumber", Library);
            assert(ok);
            ok = Validate(-1, "PositiveNumber", Library);
            assert(!ok);
        });
    });

    it("Retrive error message", () => {
        const CompanySchema = {
            name: String,
            employees: [
                {
                    name: String,
                    title: OPTIONAL(String),
                    id: Number
                }
            ],
        };
        const MyCompany = {
            name: "MyCompany",
            employees: [
                { name: "Alice", title: "CEO", id: 1 },
                { name: "Bob", title: "Manager", id: "2" },
                { name: "Carol", id: 3 }
            ]
        };
        const { ok, message } = Validate.WithReason(MyCompany, CompanySchema);
        assert(!ok);    // Evaluates to false
        assert.equal(message, "'root.employees[1].id' is not a number.");
    });
});
