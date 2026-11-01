const ValidationError = require("../../../Shared/Errors/ValidationError");
const createBeneficiarySchema = require("../Validators/createBeneficiarySchema");

class CreateBeneficiaryRequestDto {
    constructor(data) {

        const result = createBeneficiarySchema.safeParse(data);

        if(!result.success) {
            throw new ValidationError("Invalid beneficiary data", result.error.issues);
        }

        const validatedData = result.data;

        this.firstName = validatedData.firstName;
        this.lastName = validatedData.lastName;
        this.accountNumber = validatedData.accountNumber;
        this.userId = validatedData.userId;
        this.active = validatedData.active;

        Object.freeze(this);
    }
}

module.exports = CreateBeneficiaryRequestDto;
