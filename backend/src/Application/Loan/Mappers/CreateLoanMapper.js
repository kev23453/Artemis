const Loan = require("../../../Domain/Loan/Entities/Loan");
const Money = require("../../../Domain/Shared/Money");
const LoanNumber = require("../../../Domain/Loan/Value-objects/LoanNumber");
const TermMonths = require("../../../Domain/Loan/Value-objects/TermMonths");
const InterestRate = require("../../../Domain/Loan/Value-objects/InterestRate");
const PaymentStatus = require("../../../Domain/Loan/Value-objects/PaymentStatus");
const CreateLoanRequestDto = require("../Dtos/CreateLoanRequestDto");
const UuidGenerator = require("../../../Shared/Utils/IdGenerator/UuidGenerator")

class CreateLoanMapper {
    static toEntity(dto) {
        if(!(dto instanceof CreateLoanRequestDto)) {
            throw new Error("dto must be an instance of CreateLoanRequestDto");
        }

        return new Loan({
            id: new UuidGenerator().generate(),
            identifierNumber: new LoanNumber(dto.identifierNumber),
            loanAmount: new Money(dto.loanAmount),
            termMonths: new TermMonths(dto.termMonths),
            interestRate: new InterestRate(dto.interestRate),
            outstandingAmount: new Money(dto.loanAmount),
            isActive: dto.isActive,
            paymentStatus: new PaymentStatus(dto.paymentStatus),
            userId: dto.userId,
            adminId: dto.adminId,
            monthlyPayment: new Money(
                Loan.calculateMonthlyPayment({
                    loanAmount: new Money(dto.loanAmount), 
                    termMonths: new TermMonths(dto.termMonths), 
                    interestRate: new InterestRate(dto.interestRate)
                }
            )),
        })
    }
}

module.exports = CreateLoanMapper;