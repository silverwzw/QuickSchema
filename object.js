const InvalidSchemaError = require("./invalid_schema_error.js");
const { IsPlainObject, IsObjectExcludeArray } = require("./type_base.js");
const { PROPERTY_NOT_EXIST } = require("./exists.js");

module.exports = {
    ObjectValidator: ({ target, schema, user_lib, global_validator }) => {
        if (!IsPlainObject(schema)) {
            const err = new InvalidSchemaError();
            err.path = "";
            throw err;
        }
        if (!IsObjectExcludeArray(target)) {
            return {
                path: "",
                GenerateMessage: (path) => `${path} is not an object.`
            };
        }
        for (let key in schema) {
            const child_target = key in target ? target[key]
                                               : PROPERTY_NOT_EXIST;
            try {
                const validation_failure =
                    global_validator({ target: child_target,
                                       schema: schema[key],
                                       user_lib,
                                       global_validator });
                if (validation_failure) {
                    validation_failure.path = `.${key}${
                        validation_failure.path}`;
                    return validation_failure;
                }
            } catch (e) {
                if (e instanceof InvalidSchemaError) {
                    e.path = `.${key}${e.path}`;
                }
                throw e;
            }
        }
        return;
    },
    IsObjectSchema: IsPlainObject
};
