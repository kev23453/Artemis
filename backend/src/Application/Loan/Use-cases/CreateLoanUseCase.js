const CreateLoanRequestDto = require("../Dtos/CreateLoanRequestDto");
const CreateLoanMapper = require("../Mappers/CreateLoanMapper");

class CreateLoanUseCase {
    constructor(repository) {
        this.repository = repository;
    }   

    async execute(dto) {
        if(!(dto instanceof CreateLoanRequestDto)) {
            throw new Error("dto must be a instance of CreateLoanRequestDto");
        }
        const loan = CreateLoanMapper.toEntity(dto);
        await this.repository.save(loan);
        return loan;
    }
}

module.exports = CreateLoanUseCase;