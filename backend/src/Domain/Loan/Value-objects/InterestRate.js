class InterestRate {
    #basisPoints;

    constructor(annualPercentage) {
        if (typeof annualPercentage !== "number" || !Number.isFinite(annualPercentage)) {
            throw new Error("Interest rate must be a finite number");
        }

        if (annualPercentage <= 0 || annualPercentage > 100) {
            throw new Error("Interest rate must be greater than 0 and at most 100");
        }

        const basisPoints = Math.round(annualPercentage * 100);
        if (Math.abs(annualPercentage * 100 - basisPoints) > 1e-6) {
            throw new Error("Interest rate cannot have more than 2 decimals");
        }

        this.#basisPoints = basisPoints;
        Object.freeze(this);
    }

    get annualPercentage() {
        return this.#basisPoints / 100;
    }

    get annualDecimal() {
        return this.#basisPoints / 10000;
    }

    monthlyRate() {
        return this.annualDecimal / 12;
    }

    toString() {
        return this.annualPercentage.toFixed(2);
    }

    equals(otherInterestRate) {
        return otherInterestRate instanceof InterestRate &&
            this.#basisPoints === otherInterestRate.#basisPoints;
    }
}

module.exports = InterestRate;
