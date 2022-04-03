const { PRIMITIVE_TYPE_BASE } = require("./type_base.js");
const { PROPERTY_NOT_EXIST } = require("./exists.js");

const InvalidSchemaError = require("./invalid_schema_error.js");

const BOOLEAN_TYPE   = new PRIMITIVE_TYPE_BASE("boolean");
const NUMBER_TYPE    = new PRIMITIVE_TYPE_BASE("number");
const STRING_TYPE    = new PRIMITIVE_TYPE_BASE("string");
const NULL_TYPE      = new PRIMITIVE_TYPE_BASE("null");
const UNDEFINED_TYPE = new PRIMITIVE_TYPE_BASE("undefined");

function PrimitiveValidator({ target, schema }) {
    if (schema === BOOLEAN_TYPE || schema === Boolean) {
        if ("boolean" !== typeof target) {
            return {
                path: "",
                GenerateMessage: (path) => `${path} is not a boolean.`
            };
        }
        return;
    }

    if (schema === NUMBER_TYPE || schema === Number) {
        if ("number" !== typeof target) {
            return {
                path: "",
                GenerateMessage: (path) => `${path} is not a number.`
            };
        }
        return;
    }

    if (schema === STRING_TYPE || schema === String){
        if ("string" !== typeof target) {
            return {
                path: "",
                GenerateMessage: (path) => `${path} is not a string.`
            };
        }
        return;
    }

    if (schema === NULL_TYPE) {
        if (target !== null) {
            return {
                path: "",
                GenerateMessage: (path) => `${path} is not null.`
            };
        }
        return;
    }

    if (schema === UNDEFINED_TYPE) {
        if (target !== undefined && target !== PROPERTY_NOT_EXIST) {
            return {
                path: "",
                GenerateMessage: (path) => `${path} is not undefined.`
            };
        }
        return;
    }

    throw new InvalidSchemaError();
}

module.exports = {
    BOOLEAN_TYPE,
    NUMBER_TYPE,
    STRING_TYPE,
    NULL_TYPE,
    UNDEFINED_TYPE,
    PrimitiveValidator,
};
