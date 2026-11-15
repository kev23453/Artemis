const I_idGenerator = require("./I_idGenerator");
const crypto = require("crypto");

class UuidGenerator extends I_idGenerator {
    constructor() {
        super();
    }
    generate() { return crypto.randomUUID() }
}
module.exports = UuidGenerator;