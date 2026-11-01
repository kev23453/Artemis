const CreateBeneficiaryUseCase = require("../../../../src/Application/Beneficiary/Use-cases/CreateBeneficiaryUseCase");
const CreateBeneficiaryRequestDto = require("../../../../src/Application/Beneficiary/Dtos/CreateBeneficiaryRequestDto");
const Beneficiary = require("../../../../src/Domain/Beneficiary/entities/beneficiary");
const { BuildCreateBeneficiaryData } = require("../../../helpers/factories");

const buildRepository = (overrides = {}) => ({
    create: jest.fn().mockResolvedValue(undefined),
    ...overrides
});

describe("CreateBeneficiaryUseCase", () => {
    it("crea y persiste un beneficiario a partir de un DTO valido", async () => {
        const repository = buildRepository();
        const useCase = new CreateBeneficiaryUseCase(repository);
        const dto = new CreateBeneficiaryRequestDto(BuildCreateBeneficiaryData());

        const result = await useCase.execute(dto);

        expect(result).toBeInstanceOf(Beneficiary);
        expect(repository.create).toHaveBeenCalledTimes(1);
        expect(repository.create).toHaveBeenCalledWith(result);
    });

    it("devuelve una entidad con los datos del DTO", async () => {
        const useCase = new CreateBeneficiaryUseCase(buildRepository());
        const dto = new CreateBeneficiaryRequestDto(BuildCreateBeneficiaryData());

        const beneficiary = await useCase.execute(dto);

        expect(beneficiary.fullname.getFullName()).toBe("Edgar Santana");
        expect(beneficiary.accountNumber.value).toBe("009444816");
        expect(beneficiary.userId).toBe("d68c-5f65-2320-a83b");
        expect(beneficiary.active).toBe(true);
    });

    it("genera un id nuevo con el formato esperado", async () => {
        const useCase = new CreateBeneficiaryUseCase(buildRepository());
        const dto = new CreateBeneficiaryRequestDto(BuildCreateBeneficiaryData());

        const beneficiary = await useCase.execute(dto);

        expect(beneficiary.id).toMatch(/^[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}$/);
    });

    it("rechaza un objeto que no es CreateBeneficiaryRequestDto", async () => {
        const repository = buildRepository();
        const useCase = new CreateBeneficiaryUseCase(repository);

        await expect(useCase.execute(BuildCreateBeneficiaryData()))
            .rejects.toThrow("Invalid CreateBeneficiaryRequestDto");
        expect(repository.create).not.toHaveBeenCalled();
    });

    it("no persiste nada cuando el DTO es invalido", async () => {
        const repository = buildRepository();
        const useCase = new CreateBeneficiaryUseCase(repository);

        await expect(useCase.execute(null))
            .rejects.toThrow("Invalid CreateBeneficiaryRequestDto");
        expect(repository.create).not.toHaveBeenCalled();
    });

    it("propaga el error del repositorio", async () => {
        const repository = buildRepository({
            create: jest.fn().mockRejectedValue(new Error("DB down"))
        });
        const useCase = new CreateBeneficiaryUseCase(repository);
        const dto = new CreateBeneficiaryRequestDto(BuildCreateBeneficiaryData());

        await expect(useCase.execute(dto)).rejects.toThrow("DB down");
    });

    it("espera a que el repositorio termine antes de devolver la entidad", async () => {
        let resolved = false;
        const repository = buildRepository({
            create: jest.fn().mockImplementation(async () => {
                await new Promise((resolve) => setTimeout(resolve, 5));
                resolved = true;
            })
        });
        const useCase = new CreateBeneficiaryUseCase(repository);
        const dto = new CreateBeneficiaryRequestDto(BuildCreateBeneficiaryData());

        await useCase.execute(dto);

        expect(resolved).toBe(true);
    });
});
