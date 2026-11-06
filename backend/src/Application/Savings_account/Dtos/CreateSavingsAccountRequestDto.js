const ValidationError = require("../../../Shared/Errors/ValidationError")
const CreateSavingsAccountSchema = require("../Validators/CreateSavingsAccountSchema")

class CreateSavingsAccountRequestDto {
    constructor(data) {
        const result = CreateSavingsAccountSchema.safeParse(data);
        if(!result) {
            throw new ValidationError("Invalid Savings account data", result.error.issues);
        }
        const validData = result.data;

        this.accountNumber = validData.accountNumber;
        this.balance = validData.balance;
        this.userId = validData.userId;
        this.isPrincipal = validData.isPrincipal;
        this.isActive = validData.isActive;
        this.adminId = validData.adminId;

        Object.freeze(this);
    }
}

module.exports = CreateSavingsAccountRequestDto;