class Email_VO {
    constructor(value) {
        if(typeof(value) !== "string") {
            throw new Error("Email must be an string");
        }
        if(!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(value)) {
            throw new Error("Invalid email")
        }

        this.value = value;

        Object.freeze(this);
    }

    getValue() {
        return this.value;
    }
}

module.exports = Email_VO;