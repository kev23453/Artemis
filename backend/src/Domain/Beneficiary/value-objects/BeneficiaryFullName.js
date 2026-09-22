class BeneficiaryFullName {
    #name;
    #lastName;

    constructor(name, lastName) {
        if (!name || name.length < 2) throw new Error("First name is too short");
        if (!lastName || lastName.length < 2) throw new Error("Last name is too short");

        this.#name = name.trim();
        this.#lastName = lastName.trim();
    }

    get firstName() { return this.#name; }
    get lastName() { return this.#lastName; }

    getFullName() {
        return `${this.#name} ${this.#lastName}`;
    }

    equals(otherName) {
        if (!(otherName instanceof FullName)) return false;
        return this.#name === otherName.firstName && 
               this.#lastName === otherName.lastName;
    }
}

module.exports = BeneficiaryFullName;