const AL_DIA = "al dia";
const RETRASADO = "retrasado";

class PaymentStatus {
    #value;

    constructor(value = AL_DIA) {
        if (value !== AL_DIA && value !== RETRASADO) {
            throw new Error("Payment status must be al Dia or Retrasado");
        }

        
        this.#value = value;
        Object.freeze(this);
    }

    static get AL_DIA() {
        return AL_DIA;
    }

    static get RETRASADO() {
        return RETRASADO;
    }

    static alDia() {
        return new PaymentStatus(AL_DIA);
    }

    static retrasado() {
        return new PaymentStatus(RETRASADO);
    }

    static from(value) {
        if (value instanceof PaymentStatus) {
            return value;
        }

        if (typeof value !== "string") {
            throw new Error("Payment status must be a string or PaymentStatus");
        }

        const normalized = value.trim().toLowerCase();
        if (normalized === "al dia" || normalized === "al día" || normalized === "al_dia") {
            return new PaymentStatus(AL_DIA);
        }

        if (normalized === "retrasado" || normalized === "en mora" || normalized === "mora") {
            return new PaymentStatus(RETRASADO);
        }

        throw new Error("Payment status must be al Dia or Retrasado");
    }

    get value() {
        return this.#value;
    }

    isOverdue() {
        return this.#value === RETRASADO;
    }

    markOverdue() {
        return PaymentStatus.retrasado();
    }

    markCurrent() {
        return PaymentStatus.alDia();
    }

    toString() {
        return this.isOverdue() ? "en mora" : "al día";
    }

    equals(otherPaymentStatus) {
        return otherPaymentStatus instanceof PaymentStatus &&
            this.#value === otherPaymentStatus.value;
    }
}

module.exports = PaymentStatus;
