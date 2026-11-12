class CardRepository {
    async save(card) {
        throw new Error("Method save(card) must be implemented");
    }

    async findById(id) {
        throw new Error("Method findById(id) must be implemented");
    }

    async findByCardNumber(cardNumber) {
        throw new Error("Method findByCardNumber(cardNumber) must be implemented");
    }

    async findByUserId(userId) {
        throw new Error("Method findByUserId(userId) must be implemented");
    }
}

module.exports = CardRepository;
