const InvalidSchemaError = require("./invalid_schema_error.js");

module.exports = {
    RegexValidator: ({ target, schema, user_lib, global_validator }) => {
        if ("string" !== typeof target) {
            return {
                path: "",
                GenerateMessage: (path) => `${path} is not a string.`
            };
        }
        let match_result;
        try {
            match_result = target.match(schema);
        } catch (e) {
            return {
                path: "",
                GenerateMessage: (path) => `Error validating ${path
                   } against regexp '${schema.toString()}': ${e.message}`
            };
        }
        if (match_result === null) {
            return {
                path: "",
                GenerateMessage: (path) => `Unable to match ${path
                   } against regexp '${schema.toString()}'.`
            };
        }
        return;
    },
    IsRegexSchema: (schema) => schema instanceof RegExp
};
