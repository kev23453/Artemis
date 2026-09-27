const CreateUserRequestDto = require("../Dtos/CreateUserRequestDto");
const UserMapper = require("../Mappers/User.mapper");
const UserResponseDto = require("../Dtos/UserResponseDto");

class CreateUserUseCase {
    constructor(UserRepository) {
        this.UserRepository = UserRepository;
    }

    async execute(dto) {
        if(!(dto instanceof CreateUserRequestDto)) {
            throw new Error("Invalid CreateUserRequestDto");
        }   
        const user = UserMapper.toEntity(dto);
        await this.UserRepository.save(user);
        return user;
    }
}

module.exports = CreateUserUseCase;