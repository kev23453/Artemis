const Beneficiary = require("../../../Domain/Beneficiary/entities/beneficiary");

class BeneficiaryResponseDto {
    constructor(entity) {
        if(!(entity instanceof Beneficiary)) {
            throw new Error("BeneficiaryResponseDto expects a Beneficiary entity")
        }

        this.id = entity.id;
        this.firstName = entity.fullname.firstName;
        this.lastName = entity.fullname.lastName;
        this.fullName = entity.fullname.getFullName();
        this.accountNumber = entity.accountNumber.value;
        this.userId = entity.userId;
        this.active = entity.active;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;

        Object.freeze(this);
    }
}

module.exports = BeneficiaryResponseDto;
