class Card {
    #id;
    #identifierNumber;
    #creditLimit;
    #expireDate;
    #cvcCode;
    #isActive;
    #userId;
    #adminId;
    #createdAt;
    #updatedAt;

    constructor({
        id,
        identifierNumber,
        creditLimit,
        expireDate,
        cvcCode,
        isActive = true,
        userId,
        adminId,
        createdAt,
        updatedAt
    })
    {
        if(typeof id !== "string" || id.trim() === "") {
            throw new Error("Id must be a non empty string");
        }

        if(typeof identifierNumber !== "number" || !Number.isInteger(identifierNumber) || identifierNumber <= 0) {
            throw new Error("Card identifier number must be a positive integer");
        }

        if(typeof creditLimit !== "number" || !Number.isFinite(creditLimit) || creditLimit < 0) {
            throw new Error("Credit limit must be a positive number");
        }

        const parsedExpireDate = expireDate instanceof Date ? expireDate : new Date(expireDate);
        if(expireDate === undefined || expireDate === null || Number.isNaN(parsedExpireDate.getTime())) {
            throw new Error("Expire date must be a valid date");
        }

        if(typeof cvcCode !== "string" || !/^\d{3,4}$/.test(cvcCode)) {
            throw new Error("Cvc code must be a string of 3 or 4 digits");
        }

        if(typeof isActive !== "boolean") {
            throw new Error("Is active must be a boolean");
        }

        if(typeof userId !== "string" || userId.trim() === "") {
            throw new Error("User id must be a non empty string");
        }

        if(typeof adminId !== "string" || adminId.trim() === "") {
            throw new Error("Admin id must be a non empty string");
        }

        this.#id = id;
        this.#identifierNumber = identifierNumber;
        this.#creditLimit = creditLimit;
        this.#expireDate = parsedExpireDate;
        this.#cvcCode = cvcCode;
        this.#isActive = isActive;
        this.#userId = userId;
        this.#adminId = adminId;
        this.#createdAt = createdAt ? new Date(createdAt) : new Date();
        this.#updatedAt = updatedAt ? new Date(updatedAt) : new Date();
    }

    get id() { return this.#id }
    get identifierNumber() { return this.#identifierNumber }
    get creditLimit() { return this.#creditLimit }
    get expireDate() { return this.#expireDate }
    get cvcCode() { return this.#cvcCode }
    get isActive() { return this.#isActive }
    get userId() { return this.#userId }
    get adminId() { return this.#adminId }
    get createdAt() { return this.#createdAt }
    get updatedAt() { return this.#updatedAt }

    activate() {
        this.#isActive = true;
        this.#updatedAt = new Date();
    }

    deactivate() {
        this.#isActive = false;
        this.#updatedAt = new Date();
    }

    cancel() {
        this.deactivate();
    }

    updateCreditLimit(newCreditLimit) {
        if(typeof newCreditLimit !== "number" || !Number.isFinite(newCreditLimit) || newCreditLimit < 0) {
            throw new Error("Credit limit must be a positive number");
        }

        this.#creditLimit = newCreditLimit;
        this.#updatedAt = new Date();
    }

    isExpired(referenceDate = new Date()) {
        return this.#expireDate.getTime() < new Date(referenceDate).getTime();
    }
}

module.exports = Card;
