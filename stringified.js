const InvalidSchemaError = require("./invalid_schema_error.js");
const { ADVANCED_TYPE_BASE } = require("./type_base.js");

const symbol = {
    value_schema: Symbol("SimpleJsonSchema::Stringified::ValueSchema")
};

class STRINGIFIED_TYPE extends ADVANCED_TYPE_BASE {
    constructor(value_schema) {
        super("stringified");
        this[symbol.value_schema] = value_schema;
    }
}

module.exports = {
    CreateStringifiedSchema: (schema) => {
        return new STRINGIFIED_TYPE(schema);
    },
    StringifiedValidator: ({ target, schema, user_lib, global_validator }) => {
        if (typeof target !== "string") {
            return {
                path: "",
                GenerateMessage: (path) => `${path} is not a string.`
            };
        }
        if (!(symbol.value_schema in schema)) {
            const err = new InvalidSchemaError();
            err.path = "";
            err.GenerateMessage =
                (path) => `Malformed STRINGIFIED schema at ${path}`;
            throw err;
        }
        const val_s = schema[symbol.value_schema];
        let parsed;
        try {
            parsed = JSON.parse(target);
        } catch (e) {
            return {
                path: "",
                GenerateMessage:
                    (path) => `${path} cannot be parsed: ${e.message}`
            };
        }
        try {
            return global_validator({ target: parsed,
                                      schema: val_s,
                                      user_lib,
                                      global_validator });
        } catch (e) {
            if (e instanceof InvalidSchemaError) {
                e.path = `{Stringified}${e.path}`;
            }
            throw e;
        }
    },
    IsStringifiedSchema: (schema) => schema instanceof STRINGIFIED_TYPE,
    symbol
};
