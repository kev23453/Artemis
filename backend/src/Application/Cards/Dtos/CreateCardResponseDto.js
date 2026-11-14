const Card = require("../../../Domain/Cards/Entities/Card");

class CreateCardResponseDto {
    constructor(entity = new Card()) {
        if(!(entity instanceof Card)) {
            throw new Error("Entity must be an instance of Card");
        }

        this.id = entity.id;
        this.identifierNumber = entity.identifierNumber.masked;
        this.creditLimit = entity.creditLimit;
        this.expireDate = entity.expireDate.toString();
        this.isActive = entity.isActive;
        this.userId = entity.userId;
        this.adminId = entity.adminId;
        this.createdAt = entity.createdAt;
    }
}