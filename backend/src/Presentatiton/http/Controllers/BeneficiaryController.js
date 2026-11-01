const BeneficiaryRequestDto = require("../../../Application/Beneficiary/Dtos/CreateBeneficiaryRequestDto");
const BeneficiaryResponseDto = require("../../../Application/Beneficiary/Dtos/BeneficiaryResponseDto");

class BeneficiaryController {
    constructor(createBeneficiaryUseCase) {
        this.createBeneficiaryUseCase = createBeneficiaryUseCase;
    }

    async create(req, res) {
        const data = new BeneficiaryRequestDto(req.body);

        const exec = await this.createBeneficiaryUseCase.execute(data);

        const response = new BeneficiaryResponseDto(exec);

        return res.status(201).json(response);
    }
}

module.exports = BeneficiaryController;