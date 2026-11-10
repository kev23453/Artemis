const createSavingsAccountRequestDto = require("../../../Application/Savings_account/Dtos/CreateSavingsAccountRequestDto");
const createSavingsAccountResponseDto = require("../../../Application/Savings_account/Dtos/CreateSavingsAccountResponseDto");

class SavingAccountController {
    constructor(CreateSavingAccountUseCase){
        this.CreateSavingAccountUseCase = CreateSavingAccountUseCase;
    }
    
    async create(req, res) {
        const data = new createSavingsAccountRequestDto(req.body);
        const exec = await this.CreateSavingAccountUseCase.execute(data);
        return res.status(201).json({
            success: true,
            message: "Savings account created successfully!",
            data: exec
        });
    }
}

module.exports = SavingAccountController;