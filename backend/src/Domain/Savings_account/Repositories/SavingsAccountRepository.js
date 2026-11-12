class SavingsAccountRepository {
    async save(SavingsAccount) {
        throw new Error("Method save() must be implemented");
    }

    async findById(id) {
        throw new Error("Method findById(id) must be implemented");
    }

    async findByUserId(userId) {
         throw new Error("Method findByUserId(userId) must be implemented");
    }

    async findByAccountNumber(accountNumber) {
        throw new Error("Method findByAccountNumber(accountNumber) must be implemented");
    }
}

module.exports = SavingsAccountRepository;