const Loan = require("../../../Domain/Loan/Entities/Loan");

class CreateLoanResponseDto {
    constructor(entity) {
        if(!(entity instanceof Loan)) {
            throw new Error("entity must be a instance of Loan");
        }
        
        this.id = entity.id;
        this.identifierNumber = entity.identifierNumber.value;
        this.loanAmount = entity.loanAmount.toString();
        this.termMonths = entity.termMonths.value;
        this.interestRate = entity.interestRate.toString();
        this.outstandingAmount = entity.outstandingAmount.toString();
        this.isActive = entity.isActive;
        this.paymentStatus = entity.paymentStatus.value;
        this.userId = entity.userId;
        this.adminId = entity.adminId;
        this.monthlyPayment = entity.monthlyPayment.toString();
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
    }
}

module.exports = CreateLoanResponseDto;