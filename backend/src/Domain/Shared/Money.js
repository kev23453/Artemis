const CENTS = Symbol("Money.cents");

class Money {
    #cents;

    constructor(value, token) {
        if (token === CENTS) {
            this.#cents = value;
        } else {
            this.#cents = Money.#parse(value);
        }

        Object.freeze(this);
    }

    static zero() {
        return new Money(0);
    }

    static of(value) {
        return new Money(value);
    }

    static fromCents(cents) {
        if (!Number.isInteger(cents) || cents < 0) {
            throw new Error("Cents must be a non-negative integer");
        }

        if (!Number.isSafeInteger(cents)) {
            throw new Error("Money is out of range");
        }

        return new Money(cents, CENTS);
    }

    static #parse(value) {
        if (value instanceof Money) {
            return value.#cents;
        }

        if (typeof value === "number") {
            if (!Number.isFinite(value)) {
                throw new Error("Money must be a finite number");
            }

            if (value < 0) {
                throw new Error("Money cannot be negative");
            }

            const cents = Math.round(value * 100);
            if (Math.abs(value * 100 - cents) > 1e-6) {
                throw new Error("Money cannot have more than 2 decimals");
            }

            if (!Number.isSafeInteger(cents)) {
                throw new Error("Money is out of range");
            }

            return cents;
        }

        if (typeof value === "string") {
            const normalized = value.trim();
            if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
                throw new Error("Money must be a non-negative amount with up to 2 decimals");
            }

            const [integerPart, decimalPart = ""] = normalized.split(".");
            const cents = Number(integerPart) * 100 + Number(decimalPart.padEnd(2, "0"));

            if (!Number.isSafeInteger(cents)) {
                throw new Error("Money is out of range");
            }

            return cents;
        }

        throw new Error("Money must be a number, string or Money");
    }

    static #centsOf(other) {
        if (!(other instanceof Money)) {
            throw new Error("Value must be a Money instance");
        }

        return other.#cents;
    }

    plus(other) {
        return Money.fromCents(this.#cents + Money.#centsOf(other));
    }

    minus(other) {
        const cents = Money.#centsOf(other);
        if (cents > this.#cents) {
            throw new Error("Money cannot be negative");
        }

        return Money.fromCents(this.#cents - cents);
    }

    times(multiplier) {
        if (typeof multiplier !== "number" || !Number.isFinite(multiplier) || multiplier < 0) {
            throw new Error("Multiplier must be a non-negative finite number");
        }

        return Money.fromCents(Math.round(this.#cents * multiplier));
    }

    isGreaterThan(other) {
        return this.#cents > Money.#centsOf(other);
    }

    isGreaterThanOrEqual(other) {
        return this.#cents >= Money.#centsOf(other);
    }

    isLessThan(other) {
        return this.#cents < Money.#centsOf(other);
    }

    isZero() {
        return this.#cents === 0;
    }

    equals(other) {
        return other instanceof Money && this.#cents === other.#cents;
    }

    toCents() {
        return this.#cents;
    }

    toNumber() {
        return this.#cents / 100;
    }

    toString() {
        return (this.#cents / 100).toFixed(2);
    }
}

module.exports = Money;
