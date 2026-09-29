class PasswordHasher {
    async hash(password) {
        throw new Error("Method not implemented");
    }

    async compare(password, hashedPassword) {
        throw new Error("Method not implemented");
    }
}

module.exports = PasswordHasher;