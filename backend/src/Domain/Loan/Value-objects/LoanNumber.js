const { randomInt } = require("crypto");

class LoanNumber {
    #value;

    constructor(value) {
        if (typeof value !== "string") {
            throw new Error("Loan number must be a string");
        }

        const normalized = value.trim();
        if (!/^\d{9}$/.test(normalized)) {
            throw new Error("Loan number must have exactly 9 digits");
        }

        this.#value = normalized;
        Object.freeze(this);
    }

    static generate() {
        return new LoanNumber(String(randomInt(0, 1_000_000_000)).padStart(9, "0"));
    }

    get value() {
        return this.#value;
    }

    toString() {
        return this.#value;
    }

    equals(otherLoanNumber) {
        return otherLoanNumber instanceof LoanNumber && this.#value === otherLoanNumber.value;
    }
}

module.exports = LoanNumber;
