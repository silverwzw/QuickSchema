const assert = require('assert');

describe("UserType (alias)", () => {
    const { ONE_OF, NUM, STR, NOT, Validate } =
        require("../quick_schema.js");

    it("basic", () => {
        const user_lib = { "NotNumber": NOT(NUM) };
        assert(Validate({}, {}, user_lib));
        assert(Validate({}, "NotNumber", user_lib));
        assert(!Validate(1, "NotNumber", user_lib));

        assert(Validate([{}, true], ["NotNumber"], user_lib));
        assert(Validate([], ["NotNumber"], user_lib));
        assert(!Validate([null, 1], ["NotNumber"], user_lib));

        assert(Validate({ name: "Steven" }, { name: "NotNumber" }, user_lib));
        assert(!Validate({ salary: 1 }, { salary: "NotNumber" }, user_lib));
    });

    it("Nested user type", () => {
        const user_lib_1 = {
            "MyContacts" : {
                "family": "ListOfPerson",
                "friend": "PersonArray"
            }
        };
        const user_lib_2 = {
            "Name": STR,
            "Person": {
                "first_name": "Name",
                "last_name": STR
            },
            "PersonArray": ["Person"],
            "ListOfPerson": "PersonArray"
        };

        const Alice = { "first_name": "Alice", "last_name": "A" };
        const Bob = { "first_name": "Bob", "last_name": "B" };
        const Carol = { "first_name": "Carol", "last_name": "C" };

        const Chad = { "first_name": "Chad" };

        const my_contacts_1 = {
            family: [Alice],
            friend: [Bob, Carol]
        };

        const my_contacts_2 = {
            family: [Alice],
            friend: Bob
        };

        const my_contacts_3 = {
            family: [Alice],
            friend: [Bob, Chad]
        };

        assert(Validate(my_contacts_1, "MyContacts", user_lib_1, user_lib_2));
        assert(!Validate(my_contacts_2, "MyContacts", user_lib_1, user_lib_2));
        assert(!Validate(my_contacts_3, "MyContacts", user_lib_1, user_lib_2));

        // this time user_lib_2 first, then user_lib_1
        assert(Validate(my_contacts_1, "MyContacts", user_lib_2, user_lib_1));
        assert(!Validate(my_contacts_2, "MyContacts", user_lib_2, user_lib_1));
        assert(!Validate(my_contacts_3, "MyContacts", user_lib_2, user_lib_1));
    });

    it("Nested user type (evaluation short cut) type 1", () => {
        // Self reference is OK
        const user_lib = {
            FamilyTree: {
                name: STR,
                father: ONE_OF(STR, "FamilyTree"),
                mother: ONE_OF(STR, "FamilyTree")
            }
        };

        const family_tree_1 = {
            name: "silverwzw",
            father: {
                name: "wxh",
                father: "xyx",
                mother: "wgl"
            },
            mother: {
                name: "lb",
                father: "ldb",
                mother: "yyh"
            }
        };

        const family_tree_2 = {
            name: "silverwzw",
            father: {
                name: "wxh",
                father: "xyx",
                mother: "wgl"
            },
            mother: {
                name: "lb",
                father: "ldb",
                mother: {}
            }
        };

        assert(Validate(family_tree_1, "FamilyTree", user_lib));
        assert(!Validate(family_tree_2, "FamilyTree", user_lib));
    });

    it("Nested user type (evaluation short cut) type 2", () => {
        // Self reference is OK
        const FamilyTree = {};
        FamilyTree.name = STR;
        FamilyTree.father = ONE_OF(STR, FamilyTree);
        FamilyTree.mother = ONE_OF(STR, FamilyTree);

        const user_lib = { FamilyTree };

        const family_tree_1 = {
            name: "silverwzw",
            father: {
                name: "wxh",
                father: "xyx",
                mother: "wgl"
            },
            mother: {
                name: "lb",
                father: "ldb",
                mother: "yyh"
            }
        };

        const family_tree_2 = {
            name: "silverwzw",
            father: {
                name: "wxh",
                father: "xyx",
                mother: "wgl"
            },
            mother: {
                name: "lb",
                father: "ldb",
                mother: {}
            }
        };

        assert(Validate(family_tree_1, "FamilyTree", user_lib));
        assert(!Validate(family_tree_2, "FamilyTree", user_lib));
    });

    it("error path", () => {
        const user_lib_1 = {
            "MyContacts" : {
                "family": "ListOfPerson",
                "friend": "PersonArray"
            }
        };
        const user_lib_2 = {
            "Person": {
                "first_name": STR,
                "last_name": STR
            },
            "PersonArray": ["Person"],
            "ListOfPerson": "PersonArray"
        };

        const Alice = { "first_name": "Alice", "last_name": "A" };
        const Bob = { "first_name": "Bob", "last_name": "B" };

        const Chad = { "first_name": "Chad" };

        const my_contacts = {
            family: [],
            friend: [Alice, Chad, Bob]
        };

        const { ok, message } = Validate.WithReason(
            my_contacts, "MyContacts", user_lib_1, user_lib_2);

        assert(!ok);
        assert.match(message, /'root\.friend\[1\]\.last_name'/);
    });
});
