const User = require("../../../Domain/Users/Entities/User");
const CreateUserRequestDto = require("../Dtos/CreateUserRequestDto")
const generateUserId = require("../../../Shared/Utils/User_id_generator");
const Email_VO = require("../../../Domain/Users/Value-objects/Email");
const Password_VO = require("../../../Domain/Users/Value-objects/Password");

class UserMapper {
    static toEntity(dto) {
        if(!(dto instanceof CreateUserRequestDto)) {
            throw new Error("UserMapper.toEntity expects a CreateUserRequestDto");
        }

        return new User({
            id: generateUserId(),
            firstName: dto.firstName,
            lastName: dto.lastName,
            username: dto.username,
            identityNumber: dto.identityNumber,
            email: new Email_VO(dto.email),
            password: new Password_VO(dto.password),
            phoneNumber: dto.phoneNumber
        })
    }
}

module.exports = UserMapper;