const { createHash, randomInt } = require("crypto");

class Cvc {
    #value;

    constructor(value) {
        Cvc.assertValidValue(value);

        this.#value = value;

        Object.freeze(this);
    }

    static generate() {
        const value = String(randomInt(0, 1000)).padStart(3, "0");
        return new Cvc(value);
    }

    static hash(value) {
        Cvc.assertValidValue(value);
        return createHash("sha256").update(value).digest("hex");
    }

    static matches(value, hash) {
        if(typeof hash !== "string") {
            return false;
        }

        return Cvc.hash(value) === hash;
    }

    static assertValidValue(value) {
        if(typeof value !== "string" || !/^\d{3}$/.test(value)) {
            throw new Error("Cvc must be a string of exactly 3 digits");
        }
    }

    get value() { return this.#value; }
    get hash() { return Cvc.hash(this.#value); }

    matchesHash(hash) {
        return Cvc.matches(this.#value, hash);
    }

    equals(otherCvc) {
        return otherCvc instanceof Cvc && this.#value === otherCvc.value;
    }
}

module.exports = Cvc;
