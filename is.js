const InvalidSchemaError = require("./invalid_schema_error.js");
const { ADVANCED_TYPE_BASE } = require("./type_base.js");

const symbol = {
    value: Symbol("SimpleJsonSchema::Is::Value")
};

class IS_TYPE extends ADVANCED_TYPE_BASE {
    constructor(value) {
        super("is");
        this[symbol.value] = value;
    }
}

function IsNaN(v) {
    return v !== v;
}

module.exports = {
    CreateIsSchema: (schema) => {
        return new IS_TYPE(schema);
    },
    IsValidator: ({ target, schema, user_lib, global_validator }) => {
        if (!(symbol.value in schema)) {
            const err = new InvalidSchemaError();
            err.path = "";
            err.GenerateMessage = (path) => `Malformed IS schema at ${path}`;
            throw err;
        }
        const val = schema[symbol.value];
        if (val === target || (IsNaN(val) && IsNaN(target))) {
            return;
        } else {
            return {
                path: "",
                GenerateMessage: (path) => `${path} is not ${val}`
            };
        }
    },
    IsIsSchema: (schema) => schema instanceof IS_TYPE,
    symbol
};
