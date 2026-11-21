const createLoanSchema = require("../Validators/CreateLoanSchema");
const ValidationError = require("../../../Shared/Errors/ValidationError");

class CreateLoanRequestDto {
    constructor(data) {
        const result = createLoanSchema.safeParse(data);
        if(!result.success) {
            throw new ValidationError("Invalid CreateLoan data", result.error.issues);
        }
        this.identifierNumber = data.identifierNumber
        this.loanAmount = data.loanAmount
        this.termMonths = data.termMonths
        this.interestRate = data.interestRate
        this.isActive = data.isActive
        this.paymentStatus = data.paymentStatus
        this.userId = data.userId
        this.adminId = data.adminId

        Object.freeze(this);
    }
}
module.exports = CreateLoanRequestDto;