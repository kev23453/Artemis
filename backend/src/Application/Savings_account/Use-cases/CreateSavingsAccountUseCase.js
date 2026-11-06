const CreateSavingsAccountRequestDto = require("../Dtos/CreateSavingsAccountRequestDto");
const CreateSavingsAccountResponseDto = require("../Dtos/CreateSavingsAccountResponseDto");
const CreateSavingsAcoountMapper = require("../Mappers/CreateSavingsAccountMapper");

class CreateSavingsAccountUseCase {
    constructor(SavingsAccountRepository) {
        this.SavingsAccountRepository = SavingsAccountRepository;
    }

    async execute(requestDto, id) {
        if(!(requestDto instanceof CreateSavingsAccountRequestDto)) {
            throw new Error("Invalid CreateSavingsAccountRequestDto");
        }
        const savingAccount = CreateSavingsAcoountMapper.toEntity(requestDto, id);

        await this.SavingsAccountRepository.create(savingAccount);

        return new CreateSavingsAccountResponseDto(savingAccount);
    }
}

module.exports = CreateSavingsAccountUseCase;