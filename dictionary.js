const InvalidSchemaError = require("./invalid_schema_error.js");
const { ADVANCED_TYPE_BASE,
        IsPrimitiveSchema,
        IsPlainObject,
        IsObjectExcludeArray } = require("./type_base.js");
const { IsObjectSchema, ObjectValidator } = require("./object.js");

const symbol = {
    object_schema: Symbol("SimpleJsonSchema::Dictionary::ObjectSchema"),
    valut_schema:  Symbol("SimpleJsonSchema::Dictionary::ValueSchema"),
};

const default_object_schema = Object.freeze({});

class DICTIONARY_TYPE extends ADVANCED_TYPE_BASE {
    constructor(object_schema, value_schema) {
        super("dictionary");
        this[symbol.object_schema] = object_schema;
        this[symbol.value_schema] = value_schema;
    }
}

const DictionaryValidator = ({ target,
                               schema,
                               user_lib,
                               global_validator }) => {
    const obj_s = schema[symbol.object_schema];
    const val_s = schema[symbol.value_schema];

    if (!IsObjectExcludeArray(target)) {
        return {
            path: "",
            GenerateMessage: (path) => `${path} is not an object.`
        };
    }

    const exclude_keys = new Set();

    if (obj_s !== default_object_schema) {
        if (!IsObjectSchema(obj_s)) {
            const err = new InvalidSchemaError();
            err.path = "";
            err.GenerateMessage =
                (path) => `Invalid dictionary schema at ${path}`;
            throw err;
        }

        try {
            const validation_failure = global_validator({ target,
                                                          schema: obj_s,
                                                          user_lib,
                                                          global_validator });
            if (validation_failure) {
                return validation_failure;
            }
        } catch (e) {
            if (e instanceof InvalidSchemaError) {
                e.path = `{ObjectSchema}${e.path}`;
            }
            throw e;
        }

        for (const key in obj_s) {
            exclude_keys.add(key);
        }
    }

    for (let key in target) {
        if (exclude_keys.has(key)) {
            continue;
        }
        try {
            const validation_failure =
                global_validator({ target: target[key],
                                   schema: val_s,
                                   user_lib,
                                   global_validator });
            if (validation_failure) {
                const child_path = validation_failure.path;
                validation_failure.path = `.${key}${child_path}`;
                return validation_failure;
            }
        } catch (e) {
            if (e instanceof InvalidSchemaError) {
                e.path = `{ValueSchema}${e.path}`;
            }
            throw e;
        }
    }
    return;
};

const CreateDictionarySchema = (...args) => {
    let a0 = args[0]
    if (args.length === 1) {
        return new DICTIONARY_TYPE(default_object_schema, a0);
    }
    if (args.length === 2) {
        return new DICTIONARY_TYPE(a0, args[1]);
    }
    throw new Error("Cannot create dictionary schema, invalid arguments.");
};

module.exports = {
    CreateDictionarySchema,
    DictionaryValidator,
    IsDictionarySchema: (schema) => schema instanceof DICTIONARY_TYPE,
    symbol
};
