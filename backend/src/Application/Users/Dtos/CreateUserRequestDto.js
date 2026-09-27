const ValidationError = require("../../../Shared/Errors/ValidationError");
const createUserSchema = require("../Validators/createUserSchema");

class CreateUserRequestDto {
    constructor(data) {

        const result = createUserSchema.safeParse(data);

        if(!result.success) {
            throw new ValidationError("Invalid user data", result.error.issues);
        }

        const validatedData = result.data;

        this.firstName = validatedData.firstName;
        this.lastName = validatedData.lastName;
        this.username = validatedData.username;
        this.identityNumber = validatedData.identityNumber;
        this.email = validatedData.email;
        this.password = validatedData.password;
        this.phoneNumber = validatedData.phoneNumber;

        Object.freeze(this);
    }
}

module.exports = CreateUserRequestDto