const Money = require("../../Shared/Money");
const LoanNumber = require("../Value-objects/LoanNumber");
const TermMonths = require("../Value-objects/TermMonths");
const InterestRate = require("../Value-objects/InterestRate");
const PaymentStatus = require("../Value-objects/PaymentStatus");

class Loan {
    #id;
    #identifierNumber;
    #loanAmount;
    #termMonths;
    #interestRate;
    #outstandingAmount;
    #isActive;
    #paymentStatus;
    #userId;
    #adminId;
    #monthlyPayment;
    #createdAt;
    #updatedAt;

    constructor({
        id,
        identifierNumber,
        loanAmount,
        termMonths,
        interestRate,
        outstandingAmount = loanAmount,
        isActive = true,
        paymentStatus = PaymentStatus.alDia(),
        userId,
        adminId,
        monthlyPayment,
        createdAt,
        updatedAt
    }) {
        if (typeof id !== "string" || id.trim() === "") {
            throw new Error("Id must be a non empty string");
        }

        if (!(identifierNumber instanceof LoanNumber)) {
            throw new Error("Identifier number must be a LoanNumber");
        }

        if (!(loanAmount instanceof Money)) {
            throw new Error("Loan amount must be a Money instance");
        }

        if (!loanAmount.isGreaterThan(Money.zero())) {
            throw new Error("Loan amount must be greater than 0");
        }

        if (!(termMonths instanceof TermMonths)) {
            throw new Error("Term months must be a TermMonths instance");
        }

        if (!(interestRate instanceof InterestRate)) {
            throw new Error("Interest rate must be an InterestRate instance");
        }

        if (!(outstandingAmount instanceof Money)) {
            throw new Error("Outstanding amount must be a Money instance");
        }

        if (outstandingAmount.isGreaterThan(loanAmount)) {
            throw new Error("Outstanding amount cannot exceed the loan amount");
        }

        if (typeof isActive !== "boolean") {
            throw new Error("Is active must be a boolean");
        }

        if (!(paymentStatus instanceof PaymentStatus)) {
            throw new Error("Payment status must be a PaymentStatus instance");
        }

        if (typeof userId !== "string" || userId.trim() === "") {
            throw new Error("User id must be a non empty string");
        }

        if (typeof adminId !== "string" || adminId.trim() === "") {
            throw new Error("Admin id must be a non empty string");
        }

        if (monthlyPayment !== undefined && !(monthlyPayment instanceof Money)) {
            throw new Error("Monthly payment must be a Money instance");
        }

        if (monthlyPayment !== undefined && !monthlyPayment.isGreaterThan(Money.zero())) {
            throw new Error("Monthly payment must be greater than 0");
        }

        this.#id = id;
        this.#identifierNumber = identifierNumber;
        this.#loanAmount = loanAmount;
        this.#termMonths = termMonths;
        this.#interestRate = interestRate;
        this.#outstandingAmount = outstandingAmount;
        this.#isActive = isActive;
        this.#paymentStatus = paymentStatus;
        this.#userId = userId;
        this.#adminId = adminId;
        this.#monthlyPayment = monthlyPayment ?? Loan.calculateMonthlyPayment({
            loanAmount,
            termMonths,
            interestRate
        });
        this.#createdAt = Loan.#toDate(createdAt, "CreatedAt");
        this.#updatedAt = Loan.#toDate(updatedAt, "UpdatedAt");
    }

    static calculateMonthlyPayment({ loanAmount, termMonths, interestRate }) {
        if (!(loanAmount instanceof Money)) {
            throw new Error("Loan amount must be a Money instance");
        }

        if (!(termMonths instanceof TermMonths)) {
            throw new Error("Term months must be a TermMonths instance");
        }

        if (!(interestRate instanceof InterestRate)) {
            throw new Error("Interest rate must be an InterestRate instance");
        }

        const principal = loanAmount.toNumber();
        const monthlyRate = interestRate.monthlyRate();
        const months = termMonths.value;
        const growth = Math.pow(1 + monthlyRate, months);
        const payment = principal * (monthlyRate * growth) / (growth - 1);

        return Money.fromCents(Math.round(payment * 100));
    }

    static #toDate(value, field) {
        if (value === undefined) {
            return new Date();
        }

        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) {
            throw new Error(`${field} must be a valid date`);
        }

        return date;
    }

    get id() { return this.#id; }
    get identifierNumber() { return this.#identifierNumber; }
    get loanAmount() { return this.#loanAmount; }
    get termMonths() { return this.#termMonths; }
    get interestRate() { return this.#interestRate; }
    get outstandingAmount() { return this.#outstandingAmount; }
    get isActive() { return this.#isActive; }
    get paymentStatus() { return this.#paymentStatus; }
    get userId() { return this.#userId; }
    get adminId() { return this.#adminId; }
    get monthlyPayment() { return this.#monthlyPayment; }
    get createdAt() { return this.#createdAt; }
    get updatedAt() { return this.#updatedAt; }

    activate() {
        if (this.isSettled()) {
            throw new Error("A settled loan cannot be activated");
        }

        this.#isActive = true;
        this.#touch();
    }

    deactivate() {
        this.#isActive = false;
        this.#touch();
    }

    complete() {
        if (!this.isSettled()) {
            throw new Error("Loan cannot be completed with an outstanding amount");
        }

        this.#isActive = false;
        this.#paymentStatus = PaymentStatus.alDia();
        this.#touch();
    }

    applyPayment(amount) {
        if (!(amount instanceof Money)) {
            throw new Error("Payment amount must be a Money instance");
        }

        if (!amount.isGreaterThan(Money.zero())) {
            throw new Error("Payment amount must be greater than 0");
        }

        if (amount.isGreaterThan(this.#outstandingAmount)) {
            throw new Error("Payment amount cannot exceed the outstanding amount");
        }

        this.#outstandingAmount = this.#outstandingAmount.minus(amount);

        if (this.#outstandingAmount.isZero()) {
            this.#isActive = false;
            this.#paymentStatus = PaymentStatus.alDia();
        }

        this.#touch();
        return this.#outstandingAmount;
    }

    updateInterestRate(interestRate) {
        if (!(interestRate instanceof InterestRate)) {
            throw new Error("Interest rate must be an InterestRate instance");
        }

        this.#interestRate = interestRate;
        this.#monthlyPayment = Loan.calculateMonthlyPayment({
            loanAmount: this.#loanAmount,
            termMonths: this.#termMonths,
            interestRate
        });
        this.#touch();
    }

    markOverdue() {
        this.#paymentStatus = this.#paymentStatus.markOverdue();
        this.#touch();
    }

    markUpToDate() {
        this.#paymentStatus = this.#paymentStatus.markCurrent();
        this.#touch();
    }

    isOverdue() {
        return this.#paymentStatus.isOverdue();
    }

    isSettled() {
        return this.#outstandingAmount.isZero();
    }

    isCompleted() {
        return this.isSettled();
    }

    #touch() {
        this.#updatedAt = new Date();
    }
}

module.exports = Loan;
