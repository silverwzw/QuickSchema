const InvalidSchemaError = require("./invalid_schema_error.js");

const {
    IsTypeSchema,
    IsAdvancedSchema,
    IsPrimitiveSchema,
} = require("./type_base.js");

const {
    BOOLEAN_TYPE,
    NUMBER_TYPE,
    STRING_TYPE,
    NULL_TYPE,
    UNDEFINED_TYPE,
    PrimitiveValidator,
} = require("./primitives.js");

const {
    RegexValidator,
    IsRegexSchema
} = require("./regex.js");

const {
    ArrayValidator,
    IsArraySchema
} = require("./array.js");

const {
    CreateDictionarySchema,
    DictionaryValidator,
    IsDictionarySchema
} = require("./dictionary.js");

const {
    ObjectValidator,
    IsObjectSchema,
} = require("./object.js");

const {
    CreateOneOfSchema,
    OneOfValidator,
    IsOneOfSchema
} = require("./oneof.js");

const {
    ANY_TYPE,
} = require("./any.js");

const {
    CreateStringifiedSchema,
    StringifiedValidator,
    IsStringifiedSchema
} = require("./stringified.js");

const {
    CreateNotSchema,
    NotValidator,
    IsNotSchema
} = require("./not.js");

const {
    CreateIsSchema,
    IsValidator,
    IsIsSchema
} = require("./is.js");

const {
    CreateAllOfSchema,
    AllOfValidator,
    IsAllOfSchema
} = require("./allof.js");

const {
    UserTypeValidator,
    IsUserTypeSchema
} = require("./user_type.js");

const { EXISTS_TYPE, PROPERTY_NOT_EXIST } = require("./exists.js");

function ValidateRecursive(context) {
    const { target, schema } = context;
    if (schema === ANY_TYPE) {
        return;
    }
    if (schema === EXISTS_TYPE) {
        if (target === PROPERTY_NOT_EXIST) {
            return {
                path: "",
                GenerateMessage: (path) => `Property ${path} does not exist.`
            };
        } else {
            return;
        }
    }
    const types = [
        [ IsPrimitiveSchema,   PrimitiveValidator   ],
        [ IsRegexSchema,       RegexValidator       ],
        [ IsArraySchema,       ArrayValidator       ],
        [ IsDictionarySchema,  DictionaryValidator  ],
        [ IsAllOfSchema,       AllOfValidator       ],
        [ IsOneOfSchema,       OneOfValidator       ],
        [ IsIsSchema,          IsValidator          ],
        [ IsUserTypeSchema,    UserTypeValidator    ],
        [ IsNotSchema,         NotValidator         ],
        [ IsStringifiedSchema, StringifiedValidator ],
        [ IsObjectSchema,      ObjectValidator      ],
    ];
    for (const [selector, type_validator] of types) {
        if (selector(context.schema)) {
            return type_validator(context);
        }
    }
    const err = new InvalidSchemaError();
    err.path = "";
    err.GenerateMessage = (path) => `Invalid schema at ${path}.`;
    throw err;
}

function ValidateRaw(target, schema, ...user_lib) {
    try {
        return ValidateRecursive({ target, schema, user_lib,
                                   global_validator: ValidateRecursive });
    } catch (e) {
        if (e instanceof InvalidSchemaError)  {
            throw new Error(e.GenerateMessage(`'root${e.path}'`));
        }
        throw e;
    }
}

const Validate = (target, schema, ...user_lib) => {
    return ValidateRaw(target,schema, ...user_lib) === undefined;
};

Validate.WithReason = (target, schema, ...user_lib) => {
    const validation_failure = ValidateRaw(target, schema, ...user_lib);
    if (validation_failure === undefined) {
        return { ok: true }
    }
    return {
        ok: false,
        message: validation_failure.GenerateMessage(
            `'root${validation_failure.path}'`)
    };
};

module.exports = {
    // Validate function
    Validate,

    // Primitive types
    BOOL        : BOOLEAN_TYPE,
    NUM         : NUMBER_TYPE,
    STR         : STRING_TYPE,
    NULL        : NULL_TYPE,
    UNDEF       : UNDEFINED_TYPE,

    // Advance types
    ANY         : ANY_TYPE,
    DICT        : CreateDictionarySchema,
    ALL_OF      : CreateAllOfSchema,
    ONE_OF      : CreateOneOfSchema,
    IS          : CreateIsSchema,
    NOT         : CreateNotSchema,
    STRINGIFIED : CreateStringifiedSchema,
    EXISTS      : EXISTS_TYPE,

    // aliases
    OPTIONAL    : (schema) => CreateOneOfSchema(UNDEFINED_TYPE, schema),
    AND         : CreateAllOfSchema,
    OR          : CreateOneOfSchema
};
