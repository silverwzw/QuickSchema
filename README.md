# Quick Schema

Quick Schema is a javascript module that allows user to perform json object validation.

## Table of Content
- [Quick Start](#quick-start)
	- [Define a schema](#define-a-schema)
	- [Validate an object](#validate-an-object)
- [Retrive Error Message](#retrive-error-message)
- [Built-in Validators](#built-in-validators)
	- [Primitive types](#primitive-types)
	- [Object](#object)
	- [Array](#array)
	- [Dictionary](#dictionary)
	- [Logical Operators](#logical-operators)
		- [NOT](#not)
		- [ONE_OF](#one_of)
		- [ALL_OF](#all_of)
	- [Special Validators](#special-validators)
		- [ANY](#any)
		- [EXISTS](#exists)
		- [IS](#is)
		- [STRINGIFIED](#stringified)
		- [OPTIONAL](#optional)
- [User Defined Validators](#user-defined-validators)
	- [Alias](#alias)
		- [Self Reference](#self-reference)
	- [Custom Validator Logic](#custom-validator-logic)

## Quick Start
The minimal syntax to validate a specified `obj` against a specified `schema`:

`Validate(obj, schema);`

[Back](#table-of-content)
### Define a schema
```js
const { Validate, STR, NUM, OPTIONAL, ONE_OF, IS } =
        require("quick-schema");

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

[Back](#table-of-content)
### Validate an object
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

[Back](#table-of-content)
## Retrive Error Message
Sometimes we want to know why an object failed the validation, this is expecially useful when we have a complex object. The `Validate.WithReason(...)` function will return a concrete error message when the validation failed:
```js
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
assert(!ok);          // 'ok' evaluates to false
console.log(message); // Prints: 'root.employees[1].id' is not a number."
```

[Back](#table-of-content)
## Built-in Validators
### Primitive types
```js
const { Validate, STR, NUM, BOOL, NULL, UNDEF } =
        require("quick-schema");

assert(Validate("string",  STR));
assert(Validate(true,      BOOL));
assert(Validate(0,         NUM));
assert(Validate(null,      NULL));
assert(Validate(undefined, UNDEF));
```

[Back](#table-of-content)
### Object
```js
const { Validate, STR, NUM, OPTIONAL } =
        require("quick-schema");
        
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
    },
    note: ""     // extra property (i.e. properties not metioned in schema) is OK
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
    }
}, ContactSchema));
```

[Back](#table-of-content)
### Array
```js
const { Validate, NUM } =
        require("quick-schema");
const NumberArraySchema = [NUM];
let ok = Validate([1,1,2,3,5,8], NumberArraySchema);
assert(ok);
ok = Validate([1,"1",2,3,5,8], NumberArraySchema);
assert(!ok);
```

[Back](#table-of-content)
### Dictionary
Use the `Dictionary` validator to validate a mapping (from string to another type):
```js
const { Validate, NUM, STR, DICT } =
        require("quick-schema");
const ImdbRatingSchema= DICT(NUM);
assert(Validate({
    "The Shawshank Redemption": 9.3,
    "The Godfather": 9.2,
    "The Dark Knight": 9.1,
    "The Lord of the Rings: The Return of the King": 9.0,
    "Schindler's List": 9.0
}, ImdbRatingSchema));
```
You can combine object schema with dictionary schema:
```js
const ImdbRatingSchema2 = DICT({ dictionary_name: STR}, NUM);
assert(Validate({
    "dictionary_name": "IMDB Score",
    "The Shawshank Redemption": 9.3,
    "The Godfather": 9.2,
    "The Dark Knight": 9.1,
    "The Lord of the Rings: The Return of the King": 9.0,
    "Schindler's List": 9.0
}, ImdbRatingSchema2));
```

[Back](#table-of-content)
### Logical Operators
#### NOT
```js
const { Validate, NUM, NOT } =
        require("quick-schema");
let ok;
ok = Validate("1", NOT(NUM));
assert(ok);
ok = Validate(1, NOT(NUM));
assert(!ok);
```

[Back](#table-of-content)
#### ONE_OF
```js
const { Validate, NUM, STR, ONE_OF } =
        require("quick-schema");
let ok;
ok = Validate(1, ONE_OF(NUM, STR));
assert(ok);
ok = Validate("", ONE_OF(NUM, STR));
assert(ok);
ok = Validate(true, ALL_OF(NUM, STR));
assert(!ok);
```

[Back](#table-of-content)
#### ALL_OF
```js
const { Validate, NUM, STR, ALL_OF } =
        require("quick-schema");
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
```

[Back](#table-of-content)
### Special Validators
#### ANY
`ANY` validator will match any value.
```js
const { Validate, ANY } =
        require("quick-schema");
assert(Validate({},        ANY));
assert(Validate(false,     ANY));
assert(Validate(undefined, ANY));
```
Note: `ANY` validator will always return a match, even if the property does not exist:
```js
assert(Validate({}, { data : ANY }));
```

[Back](#table-of-content)
#### EXISTS
`EXISTS` validator will match any value, if such property exists.
```js
const { Validate, NOT, EXISTS } =
        require("quick-schema");
const schema = {
    name: EXISTS,
    nick_name: NOT(EXISTS)
};
let ok;
ok = Validate({ name: "Nina" }, schema);
assert(ok);   // ok because property '.name' exists, and '.nick_name' does not exist.
ok = Validate({ }, schema);
assert(!ok);  // !ok because property '.name' does not exist.
ok = Validate({ name: "Catherine", nick_name: "Kay" }, schema);
assert(!ok);  // !ok because property 'nick_name' does exist.
```

[Back](#table-of-content)
#### IS
`IS` validator matches exact value:
```js
const { Validate, IS } =
        require("quick-schema");
let ok;
ok = Validate(1, IS(1));
assert(ok);
ok = Validate(2, IS(1));
assert(!ok);

// '.lang' must be one of "C++", "Javascript" or "Go"
ok = Validate({ lang: "C++" }, { lang: ONE_OF(IS("C++"),
                                              IS("Javascript"),
                                              IS("Go")) });
assert(ok);
```

[Back](#table-of-content)
#### STRINGIFIED
`STRINGIFIED` validator will match a string that can be `JSON.parse(...)` to a specified type:
```js
const { Validate, NUM, STRINGIFIED } =
        require("quick-schema");
assert(Validate("1", STRINGIFIED(NUM)));
assert(Validate('{ "name": "Maggie" }', STRINGIFIED({ name: STR })));
```

[Back](#table-of-content)
#### OPTIONAL
```js
const { Validate, STR, NUM, OPTIONAL } =
        require("quick-schema");
const Schema = {
    name: STR,
    salary: OPTIONAL(NUM)
};
assert(Validate({ name: "Summer" }, Schema));   // ok because '.salary' is optional
assert(Validate({ name: "Summer", salary: 100 }, Schema));
```

[Back](#table-of-content)
## User Defined Validators
User defined validators is very useful, they can be used to:
- Simplify schema definition
- Code reuse
- Enable validator self reference
- Create custom validator logic

User defined validators must be supplied in form of User Type Library:
```
const Library = {
   "User Type Name": <User Type Definition>
};
```
To supply a library to the `Validator` function:
```
Validate(obj, schema, library);
```

[Back](#table-of-content)
### Alias
```js
const { Validate, STR, NUM, ALL_OF } =
        require("quick-schema");
const Library = {
    // Define an alias type "Person"
    "Person": {
        name: STR,
    },
    // Define an alias type "Employee"
    // Note that "Employee" type depends on "Person"
    "Employee": ALL_OF("Person", { salary: NUM })
};
const employees = [ { name: "Alice", salary: 100 },
                    { name: "Bob",   salary: 100 } ];

// Referencing user type "Employee" in schema
assert(Validate(employees, ["Employee"], Library));
```

[Back](#table-of-content)
#### Self Reference
Validator self reference can be achieved via alias:
```js
const { Validate, ANY, OPTIONAL } =
        require("quick-schema");
const Library = {
    "LinkedList": {
        next: OPTIONAL("LinkedList"),
        data: ANY
    }
};
const node1 = { data: 3721 };
const node2 = { data: 360, next: node1 };
assert(Validate(node2, "LinkedList", Library));
```

[Back](#table-of-content)
### Custom Validator Logic
We can create a user defined validator with custom validator logic
```js
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
```
The custom validator function can return either a boolean, undefined, or a string:
|Return Value|Interpretation|
|------------|--------------|
|`true`|Success|
|`false`|Failed|
|`undefined`|Success|
|string|Failed, "error message" will be set to the string|
|all other|Invalid return value|
