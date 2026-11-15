const createCardRequestDto = require("../Dtos/CreateCardRequestDto");
const card = require("../../../Domain/Cards/Entities/Card");
const CardNumberVO = require("../../../Domain/Cards/Value-objects/CardNumber");
const CvcVO = require("../../../Domain/Cards/Value-objects/Cvc");
const ExpireDateVO = require("../../../Domain/Cards/Value-objects/ExpirationDate");
const UuidGenerator = require("../../../Shared/Utils/IdGenerator/UuidGenerator");

class CreateCardMapper {
    static toEntity(dto) {
        if(!(dto instanceof createCardRequestDto)) {
            throw new Error("createCardMapper.toEntity must be an instance of createCardRequestDto");
        }

        return new card({
            id: new UuidGenerator().generate(),
            identifierNumber: CardNumberVO.generate(),
            creditLimit: dto.creditLimit,
            expireDate: ExpireDateVO.generate(),
            cvcCode: CvcVO.generate(),
            amountDebt: dto.amountDebt,
            isActive: dto.isActive,
            userId: dto.userId,
            adminId: dto.adminId,
        })
    }
}

module.exports = CreateCardMapper;