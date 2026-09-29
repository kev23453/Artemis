const bcrypt = require("bcrypt");
const PasswordHasher = require("../../Application/Shared/Security/PasswordHasher");

class BcryptPasswordHasher extends PasswordHasher {
    constructor(rounds = 12) {
        super();

        this.rounds = rounds;
    }

    async hash(password) {
        return await bcrypt.hash(password, this.rounds);
    }

    async compare(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = BcryptPasswordHasher;