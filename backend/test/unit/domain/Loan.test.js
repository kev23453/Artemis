const Loan = require("../../../src/Domain/Loan/Entities/Loan");
const LoanNumber = require("../../../src/Domain/Loan/Value-objects/LoanNumber");
const TermMonths = require("../../../src/Domain/Loan/Value-objects/TermMonths");
const InterestRate = require("../../../src/Domain/Loan/Value-objects/InterestRate");
const PaymentStatus = require("../../../src/Domain/Loan/Value-objects/PaymentStatus");
const Money = require("../../../src/Domain/Shared/Money");

const buildLoanProps = (overrides = {}) => ({
    id: "loan-1",
    identifierNumber: new LoanNumber("123456789"),
    loanAmount: Money.of("100000.00"),
    termMonths: new TermMonths(12),
    interestRate: new InterestRate(12),
    outstandingAmount: Money.of("100000.00"),
    isActive: true,
    paymentStatus: PaymentStatus.alDia(),
    userId: "user-1",
    adminId: "admin-1",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides
});

describe("Loan Entity", () => {
    describe("Constructor and validations", () => {
        test("creates a valid instance with all its params", () => {
            const props = buildLoanProps();
            const loan = new Loan(props);

            expect(loan.id).toBe(props.id);
            expect(loan.identifierNumber).toBe(props.identifierNumber);
            expect(loan.loanAmount).toBe(props.loanAmount);
            expect(loan.termMonths).toBe(props.termMonths);
            expect(loan.interestRate).toBe(props.interestRate);
            expect(loan.outstandingAmount).toBe(props.outstandingAmount);
            expect(loan.isActive).toBe(true);
            expect(loan.paymentStatus).toBe(props.paymentStatus);
            expect(loan.userId).toBe(props.userId);
            expect(loan.adminId).toBe(props.adminId);
            expect(loan.createdAt).toBeInstanceOf(Date);
            expect(loan.updatedAt).toBeInstanceOf(Date);
        });

        test("defaults outstanding amount to the loan amount", () => {
            const { outstandingAmount, ...props } = buildLoanProps();

            const loan = new Loan(props);

            expect(loan.outstandingAmount.equals(loan.loanAmount)).toBe(true);
        });

        test("defaults isActive to true and payment status to al dia", () => {
            const { isActive, paymentStatus, ...props } = buildLoanProps();

            const loan = new Loan(props);

            expect(loan.isActive).toBe(true);
            expect(loan.paymentStatus.isOverdue()).toBe(false);
        });

        test("calculates the monthly payment with the french system", () => {
            const loan = new Loan(buildLoanProps());

            expect(loan.monthlyPayment).toBeInstanceOf(Money);
            expect(loan.monthlyPayment.toString()).toBe("8884.88");
        });

        test("keeps a provided monthly payment", () => {
            const monthlyPayment = Money.of("9000.00");
            const loan = new Loan(buildLoanProps({ monthlyPayment }));

            expect(loan.monthlyPayment).toBe(monthlyPayment);
        });

        test.each([
            ["identifier number", { identifierNumber: "123456789" }, "Identifier number must be a LoanNumber"],
            ["loan amount", { loanAmount: Money.zero() }, "Loan amount must be greater than 0"],
            ["outstanding amount", { outstandingAmount: Money.of("100001.00") }, "Outstanding amount cannot exceed the loan amount"],
            ["term months", { termMonths: 12 }, "Term months must be a TermMonths instance"],
            ["interest rate", { interestRate: 12 }, "Interest rate must be an InterestRate instance"],
            ["payment status", { paymentStatus: "al Dia" }, "Payment status must be a PaymentStatus instance"],
            ["user id", { userId: " " }, "User id must be a non empty string"],
            ["admin id", { adminId: "" }, "Admin id must be a non empty string"],
            ["monthly payment", { monthlyPayment: Money.zero() }, "Monthly payment must be greater than 0"],
            ["createdAt", { createdAt: "fecha-invalida" }, "CreatedAt must be a valid date"]
        ])("throws when %s is invalid", (_label, overrides, message) => {
            expect(() => new Loan(buildLoanProps(overrides))).toThrow(message);
        });
    });

    describe("Behavior", () => {
        test("applies a payment to the outstanding amount", () => {
            const loan = new Loan(buildLoanProps());

            const remaining = loan.applyPayment(Money.of("1000.00"));

            expect(remaining.toString()).toBe("99000.00");
            expect(loan.outstandingAmount.toString()).toBe("99000.00");
            expect(loan.isActive).toBe(true);
        });

        test("settles the loan when the outstanding amount reaches zero", () => {
            const loan = new Loan(buildLoanProps());

            loan.applyPayment(Money.of("100000.00"));

            expect(loan.isSettled()).toBe(true);
            expect(loan.isCompleted()).toBe(true);
            expect(loan.isActive).toBe(false);
        });

        test("rejects invalid payments", () => {
            const loan = new Loan(buildLoanProps());

            expect(() => loan.applyPayment(Money.zero())).toThrow("Payment amount must be greater than 0");
            expect(() => loan.applyPayment(Money.of("100001.00"))).toThrow("Payment amount cannot exceed the outstanding amount");
            expect(() => loan.applyPayment(100)).toThrow("Payment amount must be a Money instance");
        });

        test("does not activate a settled loan", () => {
            const loan = new Loan(buildLoanProps());
            loan.applyPayment(Money.of("100000.00"));

            expect(() => loan.activate()).toThrow("A settled loan cannot be activated");
        });

        test("only completes a settled loan", () => {
            const loan = new Loan(buildLoanProps());

            expect(() => loan.complete()).toThrow("Loan cannot be completed with an outstanding amount");

            loan.applyPayment(Money.of("100000.00"));
            loan.complete();

            expect(loan.isActive).toBe(false);
        });

        test("updates the interest rate and recalculates the monthly payment", () => {
            const loan = new Loan(buildLoanProps());
            const previousPayment = loan.monthlyPayment.toString();
            const newRate = new InterestRate(24);

            loan.updateInterestRate(newRate);

            expect(loan.interestRate).toBe(newRate);
            expect(loan.monthlyPayment.toString()).not.toBe(previousPayment);
        });

        test("rejects an invalid interest rate update", () => {
            const loan = new Loan(buildLoanProps());

            expect(() => loan.updateInterestRate(24)).toThrow("Interest rate must be an InterestRate instance");
        });

        test("marks the loan as overdue and back to up to date", () => {
            const loan = new Loan(buildLoanProps());

            expect(loan.isOverdue()).toBe(false);

            loan.markOverdue();
            expect(loan.isOverdue()).toBe(true);

            loan.markUpToDate();
            expect(loan.isOverdue()).toBe(false);
        });
    });
});
