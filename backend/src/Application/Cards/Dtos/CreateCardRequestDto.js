const CreateCardSchema = require("../Validators/CreateCardSchema");
const ValidationError = require("../../../Shared/Errors/ValidationError");

class CreateCardRequestDto {
    constructor(data) {
        const result = CreateCardSchema.safeParse(data);
        if(!result.success) {
            throw new ValidationError("Invalid CreatedCardRequestDto data", result.error.issues);
        }

        this.creditLimit = data.creditLimit
        this.isActive = data.isActive
        this.userId = data.userId
        this.adminId = data.adminId

        Object.freeze(this);
    }
}

module.exports = CreateCardRequestDto;