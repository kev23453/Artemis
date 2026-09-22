class AccountNumber {
    #value;

    constructor(value) {
        if(typeof value !== "string"){
            throw new Error("El número de cuenta debe ser un formato de texto.");
        }
        if(value.length !== 9){
            throw new Error("El numero de cuenta debe tener exactamente 9 caracteres.");
        }
        if(!/^\d+$/.test(value)){
            throw new Error("El número de cuenta solo puede contener números.");
        }

        this.#value = value;
    }

    get value(){
        return this.#value;
    }

    equals(otherAccountNumber){
        if(!(otherAccountNumber instanceof AccountNumber)){
            return false;
        }
        return this.#value === otherAccountNumber.value;
    }

}

module.exports = AccountNumber;