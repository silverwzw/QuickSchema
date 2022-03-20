# Simple Schema Validator

Simple JSON Schema Validator is a javascript module that allows user to perform json object validation.

## Quick Start

To define a schema with SimpleSchemaValidator:
```js
const { Validate, STR, NUM, OPTIONAL, ONE_OF, IS } =
        require("simple-schema-validator");

// Schema definition for "Person"
const PersonSchema = {
  name: {
      first: STR,
      last: STR,
      middle: OPTIONAL(STR)
  },
  age: NUM,
  pronouns: ONE_OF(IS("he"), IS("she"))
};
```
Once we have a schema, we can easily validate an object against that schema:
```js
const Alice = {
    name: { first: "Alice", last: "Silva" },
    age: 35,
    pronouns: "she"
};
const assert = require('assert');  
let ok = Validate(Alice, PersonSchema);
assert(ok);    // Evaluates to true
```
## Retrive error message
Sometimes we want to know why an object failed the validation, this is expecially important when we have a complex object. The `Validate.WithReason(...)` function will return a concrete error message when the validation failed:
```js
const CompanySchema = {
    name: STR,
    empolyees: [
        {
            name: STR,
            title: OPTINAL(STR),
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
const { ok, message } = Validate(MyCompnay, CompanySchema);
assert(!ok);    // Evaluates to false, because `Bob.name` is a string not an object
```
