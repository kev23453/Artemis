const AccountNumber_valueObject = require("../../Shared/AccountNumber")

class SavingsAccount {
    #id;
    #accountNumber;
    #balance;
    #userId;
    #isPrincipal;
    #isActive;
    #createdAt;
    #adminId;

    constructor({
        id,
        accountNumber,
        balance,
        userId,
        isPrincipal,
        isActive,
        createdAt,
        adminId
    })
    {
        if(typeof id !== "string") {
            throw new Error("Id must be an string");
        }

        if(!(accountNumber instanceof AccountNumber_valueObject)) {
            throw new Error("account number must be an accountNumber_VO");
        }

        if(typeof balance !== "number") {
            throw new Error("Balance must be an number");
        }

        if(typeof userId !== "string") {
            throw new Error("Id must be an string");
        }

        if(typeof isPrincipal !== "boolean") {
            throw new Error("Id must be an boolean");
        }

        if(typeof isActive !== "boolean") {
            throw new Error("Id must be an boolean");
        }

        if(createdAt && typeof createdAt !== "object") {
            throw new Error("CreatedAt must be an object");
        }

        if(typeof adminId !== "string") {
            throw new Error("AdminId must be an string");
        }

        this.#id = id;
        this.#accountNumber = accountNumber;
        this.#balance = balance;
        this.#userId = userId;
        this.#isPrincipal = isPrincipal;
        this.#isActive = isActive;
        this.#createdAt = createdAt ? new Date(createdAt) : new Date();
        this.#adminId = adminId;

    }

    get id() { return this.#id }
    get accountNumber() { return this.#accountNumber; }
    get balance() { return this.#balance; }
    get userId() { return this.#userId; }
    get isPrincipal() { return this.#isPrincipal; }
    get isActive() { return this.#isActive; }
    get createdAt() { return this.#createdAt; }
    get adminId() { return this.#adminId; }


    deposit(amount) {
        if(amount <= 0) {
            throw new Error("Amount must be greater than 0 to deposit in your account");
        }
        this.#balance += amount;
    }

    withdraw(amount) {
        if(amount <= 0) {
            throw new Error("Withdraw amount must be greater than 0")
        }

        if(amount > this.#balance) {
            throw new Error("Insuficient funds for this withdraw");
        }

        this.#balance -= amount;
    }

    activate() {
        this.#isActive = true;
    }

    deactivate() {
        if(this.#balance > 0) {
            throw new Error("Cannot deactivate an account with a remaining balance");
        }
        this.#isActive = false;
    }
}

module.exports = SavingsAccount; 