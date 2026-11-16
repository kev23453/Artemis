class TermMonths {
    #value;

    constructor(value) {
        if (!Number.isInteger(value)) {
            throw new Error("Term must be an integer number of months");
        }

        if (value < 6 || value > 60) {
            throw new Error("Term must be between 6 and 60 months");
        }

        if (value % 6 !== 0) {
            throw new Error("Term must be a multiple of 6 months");
        }

        this.#value = value;
        Object.freeze(this);
    }

    get value() {
        return this.#value;
    }

    toString() {
        return String(this.#value);
    }

    equals(otherTermMonths) {
        return otherTermMonths instanceof TermMonths && this.#value === otherTermMonths.value;
    }
}

module.exports = TermMonths;
