const { ADVANCED_TYPE_BASE } = require("./type_base.js");

// Note: NEVER is not the same as NOT(ANY)

const EXISTS_TYPE = new ADVANCED_TYPE_BASE("never");

const PROPERTY_NOT_EXIST = Symbol("SimpleJsonSchema::Never::PropertyNotExist");

module.exports = { EXISTS_TYPE, PROPERTY_NOT_EXIST };
