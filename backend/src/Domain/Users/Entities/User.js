const Email_VO = require("../Value-objects/Email");
const Password_VO = require("../Value-objects/Password");

class User {
    constructor({
        id,
        firstName,
        lastName,
        username,
        normalizedUsername,
        identityNumber,
        email,
        emailConfirmed = false,
        password,
        numberPhone,
        role_id
    })
    {
        if(typeof(firstName) !== "string" || firstName.trim() === "") {
            throw new Error("First name is required");
        }

        if(typeof(lastName) !== "string" || lastName.trim() === "") {
            throw new Error("Last name is required");
        }

        if(typeof(username) !== "string" || username.trim() === "") {
            throw new Error("username name is required");
        }

        if(typeof(identityNumber) !== "string" || identityNumber.trim() === "") {
            throw new Error("Identity number must be an number and exactly 12 characters")
        }

        if(!(email instanceof Email_VO)) {
            throw new Error("Email must be an instance of email_VO")
        }

        if(!(password instanceof Password_VO)) {
            throw new Error("Password must be an instance of password_VO")
        }

        if(typeof(numberPhone) !== "string" || numberPhone.trim() === "") {
            throw new Error("Phone number must be an string");
        }

        if(typeof(emailConfirmed) !== "boolean") {
            throw new Error("Email confirmed must be a boolean")
        }

        this.id = id;
        this.firstName = firstName.trim();
        this.lastName = lastName.trim();
        this.username = username.trim();
        this.normalizedUsername = normalizedUsername ?? `${this.username}`.toLowerCase();
        this.identityNumber = identityNumber.trim();
        this.email = email;
        this.emailConfirmed = emailConfirmed;
        this.password = password;
        this.numberPhone = numberPhone.trim();
        this.role_id = role_id;
    }
}

module.exports = User;