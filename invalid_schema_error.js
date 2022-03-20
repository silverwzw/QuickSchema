class InvalidSchemaError extends Error {
    constructor() {
        super();
        this.path = "";
        this.GenerateMessage = (path) => `Invalid schema at ${path}`;
    }
}

module.exports = InvalidSchemaError;
