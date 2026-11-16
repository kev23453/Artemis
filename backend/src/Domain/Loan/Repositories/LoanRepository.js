class LoanRepository {
    async save(loan) {
        throw new Error("Method save not implemented");
    }

    async findByIdentifierNumber(identifierNumber) {
        throw new Error("Method findByIdentifierNumber not implemented");
    }

    async findByUserId(id, userId) {
        throw new Error("Method findByUserId not implemented");
    }

    async findAllByUserId(userId) {
        throw new Error("Method findAllByUserId not implemented");
    }

    async update(loan) {
        throw new Error("Method update not implemented");
    }

    async delete(id) {
        throw new Error("Method delete not implemented");
    }
}

module.exports = LoanRepository;