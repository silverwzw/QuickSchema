const InvalidSchemaError = require("./invalid_schema_error.js");
const { IsTypeSchema } = require("./type_base.js");

function FindUserLib(user_lib, schema) {
    let user_type_def;

    for (const lib of user_lib) {
        if (!(schema in lib)) {
            continue;
        }
        if (user_type_def) {
            const err = new InvalidSchemaError();
            err.path = "";
            err.GenerateMessage =
                (path) => `Duplicate definition of user library '${schema
                    }', required at ${path}.`;
            throw err;
        } else {
            user_type_def = lib[schema];
        }
    }

    if (!user_type_def) {
        const err = new InvalidSchemaError();
        err.path = "";
        err.GenerateMessage = (path) => `Cannot find user type '${schema
            }', require at ${path}.`;
        throw err;
    }

    return user_type_def;
}

module.exports = {
    UserTypeValidator: ({ target, schema, user_lib, global_validator }) => {
        if ("string" !== typeof schema) {
            const err = new InvalidSchemaError();
            err.path = "";
            throw err;
        }
        const user_type_def = FindUserLib(user_lib, schema);
        if ("function" === typeof user_type_def) {
            let result;
            try {
                result = user_type_def(target);
            } catch (e) {
                const err = new InvalidSchemaError();
                err.path = "";
                err.GenerateMessage =
                    (path) => `Error executing user type check '${schema
                        }', on '${path}': ${e.toString()}`;
                throw err;
            }
            if ("boolean" === typeof result) {
                if (!result) {
                    return {
                        path: "",
                        GenerateMessage:
                            (path) => `${path
                                } failed validation for user type '${schema}'`
                    };
                }
                return;
            } else if ("string" === typeof result) {
                return {
                    path: "",
                    GenerateMessage:
                        (path) => `${path} failed validation for user type '${
                            schema}': ${result}`
                };
            } else if ("undefined" === typeof result) {
                return;
            }
            const err = new InvalidSchemaError();
            err.path = "";
            err.GenerateMessage =
                (path) => `Invalid return type for user type check '${schema
                    }', return value is ${result.toString()}`;
            throw err;
        } else if (IsTypeSchema(user_type_def)) {
            return global_validator({
                target,
                schema: user_type_def,
                user_lib,
                global_validator
            });
        }
        const err = new InvalidSchemaError();
        err.path = "";
        err.GenerateMessage =
            (path) => `Invalid definition for user type '${schema}'`;
        throw err;
    },
    IsUserTypeSchema: (schema) => "string" === typeof schema
};
