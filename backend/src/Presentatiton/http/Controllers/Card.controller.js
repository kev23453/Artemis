const CreateCardRequestDto = require("../../../Application/Cards/Dtos/CreateCardRequestDto");
const CreateCardResponseDto = require("../../../Application/Cards/Dtos/CreateCardResponseDto");

class CardController {
    constructor(createCardUseCase) {
        this.createCardUseCase = createCardUseCase;
    }
    
    async save(req, res) {
        const data = new CreateCardRequestDto(req.body);
        const execute = await this.createCardUseCase.execute(data);
        const response = new CreateCardResponseDto(execute);
        return res.status(201).json({
            success: true,
            message: "Credit card created successfully!",
            data: response
        })
    }
    
}

module.exports = CardController;