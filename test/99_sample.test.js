
describe("code example in README", () => {
    it("Quick start", () => {
        const assert = require('assert');
        const { Validate, STR, NUM, OPTIONAL, ONE_OF, IS } =
                require("../simple_schema_validator.js");

        // Schema definition for "Person"
        const PersonSchema = {
          name: {
              first: STR,
              last: STR,
              middle: OPTIONAL(STR)
          },
          age: NUM,                  // `age` must be a number
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
    const { Validate, STR, NUM, OPTIONAL, IS, DICT, NOT, ALL_OF, ONE_OF, ANY,
            EXISTS, STRINGIFIED } =
            require("../simple_schema_validator.js");

    describe("Validators", () => {
        it("Primitive types", () => {
            const { Validate, STR, NUM, BOOL, NULL, UNDEF } =
                        require("../simple_schema_validator.js");

            assert(Validate("string",  STR));
            assert(Validate(true,      BOOL));
            assert(Validate(0,         NUM));
            assert(Validate(null,      NULL));
            assert(Validate(undefined, UNDEF));
        });
        it("Objects", () => {
            const ContactSchema = {
                name: STR,
                phone: { country_code: NUM, number: NUM },
                address: {
                    line_1: STR,
                    line_2: OPTIONAL(STR),
                    city: STR,
                    state: STR,
                    zip_code: NUM,
                    country: STR
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
            const NumberArraySchema = [NUM];
            let ok = Validate([1,1,2,3,5,8], NumberArraySchema);
            assert(ok);
            ok = Validate([1,"1",2,3,5,8], NumberArraySchema);
            assert(!ok);
        });
        it("Dictionary", () => {
            const ImdbRatingSchema= DICT(NUM);
            assert(Validate({
                "The Shawshank Redemption": 9.3,
                "The Godfather": 9.2,
                "The Dark Knight": 9.1,
                "The Lord of the Rings: The Return of the King": 9.0,
                "Schindler's List": 9.0
            }, ImdbRatingSchema));

            const ImdbRatingSchema2 = DICT({ dictionary_name: STR }, NUM);
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
                ok = Validate("1", NOT(NUM));
                assert(ok);
                ok = Validate(1, NOT(NUM));
                assert(!ok);
            });
            it("ALL_OF", () => {
                const EmployeeSchema = {
                    name: STR,
                    title: STR
                };
                const PersonSchema = {
                    name: STR,
                    age: NUM,
                };
                assert(Validate({
                   name: "Steven",
                   title: "Individual Contributor",
                   age: 33
                }, ALL_OF(EmployeeSchema, PersonSchema)));
            });
            it("ONE_OF", () => {
                let ok;
                ok = Validate(1, ONE_OF(NUM, STR));
                assert(ok);
                ok = Validate("", ONE_OF(NUM, STR));
                assert(ok);
                ok = Validate(true, ALL_OF(NUM, STR));
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
                assert(Validate("1", STRINGIFIED(NUM)));
                assert(Validate('{ "name": "Maggie" }',
                                STRINGIFIED({ name: STR })));
            });
            it("OPTIONAL", () => {
                const Schema = {
                    name: STR,
                    salary: OPTIONAL(NUM)
                };
                assert(Validate({ name: "Summer" }, Schema));
                assert(Validate({ name: "Summer", salary: 100 }, Schema));
            });
        });
    });

    describe("User defined validators", () => {
        describe("Schema alias", () => {
            it("default", () => {
                const Library = {
                    "Person": {
                        name: STR,
                    },
                    "Employee": ALL_OF("Person", { salary: NUM })
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
            name: STR,
            employees: [
                {
                    name: STR,
                    title: OPTIONAL(STR),
                    id: NUM
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
