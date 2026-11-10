const CreateSavingsAccountRequestDto = require("../Dtos/CreateSavingsAccountRequestDto");
const CreateSavingsAccountResponseDto = require("../Dtos/CreateSavingsAccountResponseDto");
const CreateSavingsAcoountMapper = require("../Mappers/CreateSavingsAccountMapper");

class CreateSavingsAccountUseCase {
    constructor(SavingsAccountRepository) {
        this.SavingsAccountRepository = SavingsAccountRepository;
    }

    async execute(dto) {
        if(!(dto instanceof CreateSavingsAccountRequestDto)) {
            throw new Error("Invalid CreateSavingsAccountRequestDto");
        }
        const savingAccount = CreateSavingsAcoountMapper.toEntity(dto);

        await this.SavingsAccountRepository.save(savingAccount);

        return new CreateSavingsAccountResponseDto(savingAccount);
    }
}

module.exports = CreateSavingsAccountUseCase;