const InvalidSchemaError = require("./invalid_schema_error.js");
const { ADVANCED_TYPE_BASE } = require("./type_base.js");

const symbol = {
    possible_schema: Symbol("QuickSchema::OneOf::PossibleSchema")
};

class ONEOF_TYPE extends ADVANCED_TYPE_BASE {
    constructor(value_schemas) {
        super("oneof");
        this[symbol.possible_schema] = value_schemas;
    }
}

const CreateOneOfSchema = (...schema) => {
    return new ONEOF_TYPE(schema);
};

module.exports = {
    CreateOneOfSchema,
    OneOfValidator: ({ target, schema, user_lib, global_validator }) => {
        const possible_schemas = schema[symbol.possible_schema];
        if (!(possible_schemas instanceof Array) ||
            possible_schemas.length === 0) {
            const err = new InvalidSchemaError();
            err.path = "{OneOfSchema}";
            err.GenerateMessage =
                (path) => `Malformed ONE_OF schema at ${path}.`;
            throw err;
        }
        for (let index in possible_schemas) {
            try {
                const validation_failure = global_validator({
                    target,
                    schema: possible_schemas[index],
                    user_lib,
                    global_validator });
                if (!validation_failure) {
                    return;
                }
            } catch (e) {
                if (e instanceof InvalidSchemaError) {
                    e.path = `{OneOfSchema[${index}]}${e.path}`;
                }
                throw e;
            }
        }
        return {
            path: "",
            GenerateMessage: (path) => `${path
                } does not match any of the child schema of the one-of schema.`
        };
    },
    IsOneOfSchema: (schema) => schema instanceof ONEOF_TYPE,
    symbol
};
