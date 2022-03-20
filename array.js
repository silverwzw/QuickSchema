const InvalidSchemaError = require("./invalid_schema_error.js");

module.exports = {
    ArrayValidator: ({ target, schema, user_lib, global_validator }) => {
        if (schema.length > 1) {
            const err = new InvalidSchemaError();
            err.path = "[]";
            err.GenerateMessage = (path) =>
                `More than one element schema specified in array schema at ${
                    path}`;
            throw err;
        }
        if (!(target instanceof Array)) {
            return {
                path: "",
                GenerateMessage: (path) => `${path} is not an array.`
            };
        }
        if (schema.length === 0) {
            return;
        }
        for (let index in target) {
            try {
                const validation_failure =
                    global_validator({ target: target[index],
                                       schema: schema[0],
                                       user_lib,
                                       global_validator });
                if (validation_failure) {
                    validation_failure.path =
                        `[${index}]${validation_failure.path}`;
                    return validation_failure;
                }
            } catch (e) {
                if (e instanceof InvalidSchemaError) {
                    e.path = `[]${e.path}`;
                }
                throw e;
            }
        }
        return;
    },
    IsArraySchema: (schema) => schema instanceof Array
};
