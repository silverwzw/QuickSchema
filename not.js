const InvalidSchemaError = require("./invalid_schema_error.js");
const { ADVANCED_TYPE_BASE } = require("./type_base.js");

const symbol = {
    value_schema: Symbol("SimpleJsonSchema::Not::ValueSchema")
};

class NOT_TYPE extends ADVANCED_TYPE_BASE {
    constructor(value_schema) {
        super("not");
        this[symbol.value_schema] = value_schema;
    }
}

module.exports = {
    CreateNotSchema: (schema) => {
        return new NOT_TYPE(schema);
    },
    NotValidator: ({ target, schema, user_lib, global_validator }) => {
        if (!(symbol.value_schema in schema)) {
            const err = new InvalidSchemaError();
            err.path = "";
            err.GenerateMessage = (path) => `Malformed NOT schema at ${path}`;
            throw err;
        }
        const val_s = schema[symbol.value_schema];
        const validation_failure = global_validator({ target,
                                                      schema: val_s,
                                                      user_lib,
                                                      global_validator });
        if (validation_failure) {
            return;
        }
        return {
            path: "",
            GenerateMessage: (path) => `NOT matcher violated at ${path}.`
        };
    },
    IsNotSchema: (schema) => schema instanceof NOT_TYPE,
    symbol
};
