const AccountNumber = require("./value-objects/AccountNumber");
const BeneficiaryFullName = require("./value-objects/BeneficiaryFullName");

class Beneficiary {
    #id;
    #fullname;
    #accountNumber;
    #userId;
    #active = false;
    #createdAt;
    #updatedAt;

    constructor({
        id,
        fullname,
        accountNumber,
        userId,
        active = true,
        createdAt,
        updatedAt
    }) {
        if(!(accountNumber instanceof AccountNumber)) throw new Error("Account Number is invalid");
        if(!(fullname instanceof BeneficiaryFullName)) throw new Error("Name is invalid");
        if(typeof userId !== "string" || userId.trim() === "") throw new Error("Id is invalid");

        this.#id = id;
        this.#fullname = fullname;
        this.#userId = userId;
        this.#accountNumber = accountNumber;
        this.#active = active;
        this.#createdAt = createdAt ? new Date(createdAt) : new Date();
        this.#updatedAt = updatedAt ? new Date(updatedAt) : new Date();
    }

    get id() {return this.#id}
    get fullname() {return this.#fullname}
    get userId() {return this.#userId}
    get active() {return this.#active}
    get createdAt() {return this.#createdAt}
    get updatedAt() {return this.#updatedAt}
    get accountNumber() {return this.#accountNumber}
}

