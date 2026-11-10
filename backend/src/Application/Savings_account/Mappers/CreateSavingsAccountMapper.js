const SavingsAccount = require("../../../Domain/Savings_account/Entities/Savings_account");
const CreateSavingsAccountRequestDto = require("../Dtos/CreateSavingsAccountRequestDto");
const AccountNumber = require("../../../Domain/Shared/AccountNumber");
const { randomUUID } = require("crypto");

class CreateSavingsAcoountMapper {
    static toEntity(dto) {
        if(!(dto instanceof CreateSavingsAccountRequestDto)) {
            throw new Error("CreateSavingsAccountMapper.toEntity expects a CreateSavingsAccountRequestDto");
        }

        return new SavingsAccount({
            id: randomUUID(),
            accountNumber: new AccountNumber(dto.accountNumber),
            balance: dto.balance,
            userId: dto.userId,
            isPrincipal: dto.isPrincipal,
            isActive: dto.isActive,
            adminId: dto.adminId
        })
    }
}
module.exports = CreateSavingsAcoountMapper;