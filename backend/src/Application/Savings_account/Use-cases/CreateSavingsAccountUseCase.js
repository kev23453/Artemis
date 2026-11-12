const CreateSavingsAccountRequestDto = require("../Dtos/CreateSavingsAccountRequestDto");
const CreateSavingsAccountResponseDto = require("../Dtos/CreateSavingsAccountResponseDto");
const CreateSavingsAcoountMapper = require("../Mappers/CreateSavingsAccountMapper");
const ConflictError = require("../../../Shared/Errors/ConflictError");

class CreateSavingsAccountUseCase {
    constructor(SavingsAccountRepository) {
        this.SavingsAccountRepository = SavingsAccountRepository;
    }

    async execute(dto) {
        if(!(dto instanceof CreateSavingsAccountRequestDto)) {
            throw new Error("Invalid CreateSavingsAccountRequestDto");
        }
        const savingAccount = CreateSavingsAcoountMapper.toEntity(dto);

        const existingAccount = await this.SavingsAccountRepository.findByAccountNumber(
            savingAccount.accountNumber.value
        )

        if(existingAccount) {
            throw new ConflictError(`The account number: "${existingAccount.accountNumber}" already exists`)
        }

        await this.SavingsAccountRepository.save(savingAccount);

        return new CreateSavingsAccountResponseDto(savingAccount);
    }
}

module.exports = CreateSavingsAccountUseCase;