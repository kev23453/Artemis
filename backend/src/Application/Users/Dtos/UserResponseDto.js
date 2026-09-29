const User = require("../../../Domain/Users/Entities/User");

class UserResponseDto {
    constructor(entity) {
        if(!(entity instanceof User)) {
            throw new Error("UserResponseDto expects a User entity")
        }
        
        this.id = entity.id;
        this.firstName = entity.firstName;
        this.lastName = entity.lastName;
        this.username = entity.username;
        this.email = entity.email.getValue();
        this.emailConfirmed = entity.emailConfirmed;
        this.phoneNumber = entity.phoneNumber;

        Object.freeze(this);
    }
}

module.exports = UserResponseDto;