const CreateSavingsAccountUseCase = require("../../../../src/Application/Savings_account/Use-cases/CreateSavingsAccountUseCase");
const CreateSavingsAccountRequestDto = require("../../../../src/Application/Savings_account/Dtos/CreateSavingsAccountRequestDto");
const CreateSavingsAccountResponseDto = require("../../../../src/Application/Savings_account/Dtos/CreateSavingsAccountResponseDto");
const SavingsAccount = require("../../../../src/Domain/Savings_account/Entities/Savings_account");
const { buildCreateSavingsAccountData } = require("../../../helpers/factories");

const ID = "9999-0000-1111-2222";

const buildRepository = (overrides = {}) => ({
    save: jest.fn().mockResolvedValue(undefined),
    ...overrides
});

const buildDto = (overrides = {}) =>
    new CreateSavingsAccountRequestDto(buildCreateSavingsAccountData(overrides));

describe("CreateSavingsAccountUseCase", () => {
    it("crea y persiste una cuenta a partir de un DTO valido", async () => {
        const repository = buildRepository();
        const useCase = new CreateSavingsAccountUseCase(repository);
        const dto = buildDto();

        const result = await useCase.execute(dto, ID);

        expect(repository.save).toHaveBeenCalledTimes(1);
        expect(repository.save.mock.calls[0][0]).toBeInstanceOf(SavingsAccount);
    });

    it("devuelve un CreateSavingsAccountResponseDto", async () => {
        const useCase = new CreateSavingsAccountUseCase(buildRepository());

        const result = await useCase.execute(buildDto(), ID);

        expect(result).toBeInstanceOf(CreateSavingsAccountResponseDto);
    });

    it("devuelve los datos del DTO en la respuesta", async () => {
        const useCase = new CreateSavingsAccountUseCase(buildRepository());

        const result = await useCase.execute(buildDto());

        expect(result.accountNumber).toBe("259984125");
        expect(result.balance).toBe(6000);
        expect(result.userId).toBe("8888-1111-0000-8889");
        expect(result.adminId).toBe("8898-5555-1118-5555");
    });

    it("persiste exactamente la entidad que devuelve en la respuesta", async () => {
        const repository = buildRepository();
        const useCase = new CreateSavingsAccountUseCase(repository);

        const result = await useCase.execute(buildDto());

        const persisted = repository.save.mock.calls[0][0];
        expect(result.id).toBe(persisted.id);
        expect(result.accountNumber).toBe(persisted.accountNumber.value);
        expect(result.balance).toBe(persisted.balance);
    });

    it("rechaza un objeto que no es CreateSavingsAccountRequestDto", async () => {
        const repository = buildRepository();
        const useCase = new CreateSavingsAccountUseCase(repository);

        await expect(useCase.execute(buildCreateSavingsAccountData()))
            .rejects.toThrow("Invalid CreateSavingsAccountRequestDto");
        expect(repository.save).not.toHaveBeenCalled();
    });

    it("no persiste nada cuando el DTO es null", async () => {
        const repository = buildRepository();
        const useCase = new CreateSavingsAccountUseCase(repository);

        await expect(useCase.execute(null))
            .rejects.toThrow("Invalid CreateSavingsAccountRequestDto");
        expect(repository.save).not.toHaveBeenCalled();
    });

    it("propaga el error del repositorio", async () => {
        const repository = buildRepository({
            create: jest.fn().mockRejectedValue(new Error("DB down"))
        });
        const useCase = new CreateSavingsAccountUseCase(repository);

        await expect(useCase.execute(buildDto())).rejects.toThrow("DB down");
    });

    it("espera a que el repositorio termine antes de devolver la respuesta", async () => {
        let resolved = false;
        const repository = buildRepository({
            create: jest.fn().mockImplementation(async () => {
                await new Promise((resolve) => setTimeout(resolve, 5));
                resolved = true;
            })
        });
        const useCase = new CreateSavingsAccountUseCase(repository);

        await useCase.execute(buildDto());

        expect(resolved).toBe(true);
    });
});
