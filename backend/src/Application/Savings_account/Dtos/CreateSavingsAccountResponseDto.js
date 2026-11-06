const SavingsAccount = require("../../../Domain/Savings_account/Entities/Savings_account");

class CreateSavingsAccountResponseDto {
    constructor(entity) {
        if(!(entity instanceof SavingsAccount)) {
            throw new Error("CreateSavingsAccountResponseDto expects a Savings account entity")
        }

        this.id = entity.id;
        this.accountNumber = entity.accountNumber.value;
        this.balance = entity.balance;
        this.userId = entity.userId;
        this.isPrincipal = entity.isPrincipal;
        this.isActive = entity.isActive;
        this.updatedAt = entity.updatedAt;
        this.adminId = entity.adminId;

        Object.freeze(this);
    }
}

module.exports = CreateSavingsAccountResponseDto;
