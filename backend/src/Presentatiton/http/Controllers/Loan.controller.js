const CreateLoanRequestDto = require("../../../Application/Loan/Dtos/CreateLoanRequestDto");
const CreateLoanResponseDto = require("../../../Application/Loan/Dtos/CreateLoanResponseDto");

class LoanController {
    constructor(createLoanUseCase) {
        this.createLoanUseCase = createLoanUseCase;
    }

    async save(req, res) {
        const data = new CreateLoanRequestDto(req.body);
        const execute = await this.createLoanUseCase.execute(data);
        const response = new CreateLoanResponseDto(execute);
        return res.status(201).json({
            success: true,
            message: "Loan assigned correctly",
            data: response
        })
    }
}

module.exports = LoanController;