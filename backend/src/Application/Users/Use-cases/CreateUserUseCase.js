const CreateUserRequestDto = require("../Dtos/CreateUserRequestDto");
const UserMapper = require("../Mappers/User.mapper");
const UserResponseDto = require("../Dtos/UserResponseDto");

class CreateUserUseCase {
    constructor(UserRepository, passwordHasher) {
        this.UserRepository = UserRepository;
        this.passwordHasher = passwordHasher;
    }

    async execute(dto) {
        if(!(dto instanceof CreateUserRequestDto)) {
            throw new Error("Invalid CreateUserRequestDto");
        }   
        const user = UserMapper.toEntity(dto);

        const hashedPassword = await this.passwordHasher.hash(user.password.getValue());

        await this.UserRepository.save(user, hashedPassword);
    
        return user;
    }
}

module.exports = CreateUserUseCase;