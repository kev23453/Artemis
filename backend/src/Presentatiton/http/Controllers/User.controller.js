const UserResponseDto = require("../../../Application/Users/Dtos/UserResponseDto");
const CreateUserRequestDto = require("../../../Application/Users/Dtos/CreateUserRequestDto");

class UserController {
    constructor(CreateUserUseCase) {
        this.CreateUserUseCase = CreateUserUseCase
    }

    async create(req, res) {
        const data = new CreateUserRequestDto(req.body);

        const exec = await this.CreateUserUseCase.execute(data);

        const response = new UserResponseDto(exec);

        return res.status(201).json(response)
    }

}

module.exports = UserController;