const symbol = {
    type_name: Symbol("QuickSchema::TypeName")
};

class TYPE_BASE {
    constructor(name) {
        this[symbol.type_name] = name;
    }
}

class ADVANCED_TYPE_BASE extends TYPE_BASE {
    constructor(name) {
        super(name);
    }
}

class PRIMITIVE_TYPE_BASE extends TYPE_BASE {
    constructor(name) {
        super(name);
    }
}

const obj_proto = Object.getPrototypeOf({});
function IsPlainObject(obj) {
    return obj instanceof Object && Object.getPrototypeOf(obj) === obj_proto;
}

function IsObjectExcludeArray(obj) {
    return obj instanceof Object && !(obj instanceof Array);
}

function IsAdvancedSchema(schema) {
    return "string" === typeof schema ||
           schema instanceof ADVANCED_TYPE_BASE ||
           (schema instanceof Array && schema.length === 1) ||
           (schema !== undefined && schema !== null && IsPlainObject(schema));
}

function IsPrimitiveSchema(schema) {
    return schema instanceof PRIMITIVE_TYPE_BASE;
}

function IsTypeSchema(schema) {
    return IsPrimitiveSchema(schema) || IsAdvancedSchema(schema);
}

module.exports = {
    IsTypeSchema,
    IsAdvancedSchema,
    IsPrimitiveSchema,
    IsPlainObject,
    IsObjectExcludeArray,
    ADVANCED_TYPE_BASE,
    PRIMITIVE_TYPE_BASE,
    symbol
};
