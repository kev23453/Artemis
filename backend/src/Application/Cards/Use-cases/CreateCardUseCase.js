const createCardRequestDto = require("../Dtos/CreateCardRequestDto");
const createCardMapper = require("../Mappers/CreateCardMapper");

class CreateCardUseCase {
    constructor(CardRepository) {
        this.CardRepository = CardRepository;
    }
    async execute(dto) {
        if(!(dto instanceof createCardRequestDto)) {
            throw new Error("invalid data, must be an instance of cardRequestDto");
        }
        const card = createCardMapper.toEntity(dto);
        await this.CardRepository.save(card);
        return card;
    }
}
module.exports = CreateCardUseCase;