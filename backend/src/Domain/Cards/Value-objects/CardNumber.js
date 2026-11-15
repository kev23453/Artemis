const crypto = require("crypto");

class CardNumber {
    #value;

    constructor(value) {
        if (typeof value !== "string") {
            throw new Error("Card number must be a string");
        }

        const normalized = value.replace(/[\s-]/g, "");
        if (!/^\d{16}$/.test(normalized)) {
            throw new Error("Card number must have exactly 16 digits");
        }

        this.#value = normalized;

        Object.freeze(this);
    }

    static generate() {
        let value = "4"; // prefijo estilo Visa, evita empezar en 0
        for (let i = 0; i < 15; i++) {
            value += crypto.randomInt(0, 10);
        }
        return new CardNumber(value);
    }

    get value() { return this.#value; }
    get last4() { return this.#value.slice(-4); }
    get masked() { return `**** **** **** ${this.last4}`; }

    equals(otherCardNumber) {
        return otherCardNumber instanceof CardNumber && this.#value === otherCardNumber.value;
    }
}

module.exports = CardNumber;