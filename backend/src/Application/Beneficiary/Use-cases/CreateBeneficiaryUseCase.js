const CreateBeneficiaryRequestDto = require("../Dtos/CreateBeneficiaryRequestDto");
const BeneficiaryMapper = require("../Mappers/Beneficiary.mapper");

class CreateBeneficiaryUseCase {
    constructor(BeneficiaryRepository) {
        this.BeneficiaryRepository = BeneficiaryRepository;
    }

    async execute(dto) {
        if(!(dto instanceof CreateBeneficiaryRequestDto)) {
            throw new Error("Invalid CreateBeneficiaryRequestDto");
        }

        const beneficiary = BeneficiaryMapper.toEntity(dto);

        await this.BeneficiaryRepository.create(beneficiary);

        return beneficiary;
    }
}

module.exports = CreateBeneficiaryUseCase;
