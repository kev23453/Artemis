const ICardRepository = require("../../../../Domain/Cards/Repositories/CardRepository");
const { randomUUID } = require("crypto")
const { CardModel } = require("../Models")

class CardRepository extends ICardRepository{
    constructor(DbClient, cardModel = CardModel) {
        super();
        this.DbClient = DbClient,
        this.cardModel = cardModel;
    }

    async save(card) {
        const data = {
            id: card.id,
            identifierNumber: card.identifierNumber.value, // autogenerado
            creditLimit: card.creditLimit,
            expireDate: card.expireDate.toString(), // autogenerada
            cvcCode: card.cvcCode.hash, // autogenerada
            amountDebt: card.amountDebt,
            isActive: card.isActive,
            userId: card.userId,
            adminId: card.adminId,
        }
        
        await this.cardModel.create(data);
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