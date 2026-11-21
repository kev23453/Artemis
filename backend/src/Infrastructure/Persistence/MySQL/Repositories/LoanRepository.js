const ILoanRepository = require("../../../../Domain/Loan/Repositories/LoanRepository");

class LoanRepository extends ILoanRepository{
    constructor(dbClient, loanModel) {
        super();
        this.loanModel = loanModel;
        this.dbClient = dbClient;
    }

    async save(loan) {
            const data = {
                id: loan.id,
                identifierNumber: loan.identifierNumber.value,
                loanAmount: loan.loanAmount.toString(),
                termMonths: loan.termMonths.value,
                interestRate: loan.interestRate.toString(),
                outstandingAmount: loan.loanAmount.toString(),
                isActive: loan.isActive,
                paymentStatus: loan.paymentStatus.value,
                userId: loan.userId,
                adminId: loan.adminId,
                monthlyPayment: loan.monthlyPayment.toString()
            }

            await this.loanModel.create(data);

    }

    async findByIdentifierNumber(identifierNumber) {
        throw new Error("Method findByIdentifierNumber not implemented");
    }

    async findByUserId(id, userId) {
        throw new Error("Method findByUserId not implemented");
    }

    async findAllByUserId(userId) {
        throw new Error("Method findAllByUserId not implemented");
    }

    async update(loan) {
        throw new Error("Method update not implemented");
    }

    async delete(id) {
        throw new Error("Method delete not implemented");
    }
}

module.exports = LoanRepository;