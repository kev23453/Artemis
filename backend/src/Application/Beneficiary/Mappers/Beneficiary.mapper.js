const Beneficiary = require("../../../Domain/Beneficiary/entities/beneficiary");
const AccountNumber_VO = require("../../../Domain/Shared/AccountNumber");
const BeneficiaryFullName_VO = require("../../../Domain/Beneficiary/value-objects/BeneficiaryFullName");
const CreateBeneficiaryRequestDto = require("../Dtos/CreateBeneficiaryRequestDto");
const generateBeneficiaryId = require("../../../Shared/Utils/Beneficiary_id_generator");

class BeneficiaryMapper {
    static toEntity(dto) {
        if(!(dto instanceof CreateBeneficiaryRequestDto)) {
            throw new Error("BeneficiaryMapper.toEntity expects a CreateBeneficiaryRequestDto");
        }

        return new Beneficiary({
            id: generateBeneficiaryId(),
            fullname: new BeneficiaryFullName_VO(dto.firstName, dto.lastName),
            accountNumber: new AccountNumber_VO(dto.accountNumber),
            userId: dto.userId,
            active: dto.active
        })
    }
}

module.exports = BeneficiaryMapper;
