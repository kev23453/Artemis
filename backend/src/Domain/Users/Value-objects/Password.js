class Password_VO {
    constructor(value) {

        if(typeof value !== "string") {
            throw new Error("Password must be an number");
        }

        if(value.length < 8) {
            throw new Error("Password must contain at least 8 characters")
        }

        if(!/[a-z]/.test(value)) {
            throw new Error("Password must contain at least one lowercase letter")
        }

        if(!/[A-Z]/.test(value)) {
            throw new Error("Password must contain at least one uppercase letter")
        }

        if(!/\d/.test(value)) {
            throw new Error("Password must contain at least one number")
        }

        if(!/[#$&%@!?_*-]/.test(value)) {
            throw new Error("Password must contain at least one special character")
        }

        this.value = value;
        Object.freeze(this);
    }

    getValue() {
        return this.value;
    }
}



module.exports = Password_VO; 