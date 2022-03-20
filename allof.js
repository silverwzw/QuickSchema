const InvalidSchemaError = require("./invalid_schema_error.js");
const { IsTypeSchema, ADVANCED_TYPE_BASE } = require("./type_base.js");

const symbol = {
    child_schemas: Symbol("SimpleJsonSchema::AllOf::ChildSchemas")
};

class ALLOF_TYPE extends ADVANCED_TYPE_BASE {
    constructor(child_schemas) {
        super("allof");
        this[symbol.child_schemas] = child_schemas;
    }
}

const CreateAllOfSchema = (...schema) => {
    return new ALLOF_TYPE(schema);
};

module.exports = {
    CreateAllOfSchema,
    AllOfValidator: ({ target, schema, user_lib, global_validator }) => {
        const child_schemas = schema[symbol.child_schemas];
        if (!(child_schemas instanceof Array) || child_schemas.length === 0) {
            const err = new InvalidSchemaError();
            err.path = `{AllOfSchema}`;
            err.GenerateMessage =
                (path) => `Malformed ALL_OF schema at ${path}`;
            throw err;
        }
        for (const index in child_schemas) {
            try {
                const validation_failure = global_validator({
                    target,
                    schema: child_schemas[index],
                    user_lib,
                    global_validator });
                if (validation_failure) {
                    validation_failure.path = validation_failure.path;
                    return validation_failure;
                }
            } catch (e) {
                if (e instanceof InvalidSchemaError) {
                    e.path = `{AllOfSchema[${index}]}${e.path}`;
                }
                throw e;
            }
        }
        return;
    },
    IsAllOfSchema: (schema) => schema instanceof ALLOF_TYPE,
    symbol
};
