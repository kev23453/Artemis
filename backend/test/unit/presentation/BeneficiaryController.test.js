const BeneficiaryController = require("../../../src/Presentatiton/http/Controllers/BeneficiaryController");
const BeneficiaryResponseDto = require("../../../src/Application/Beneficiary/Dtos/BeneficiaryResponseDto");
const ValidationError = require("../../../src/Shared/Errors/ValidationError");
const { BuildBeneficiaryEntity, BuildCreateBeneficiaryData } = require("../../helpers/factories");

const buildResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const buildUseCase = (overrides = {}) => ({
    execute: jest.fn().mockResolvedValue(BuildBeneficiaryEntity()),
    ...overrides
});

describe("BeneficiaryController", () => {
    it("responde 201 y un BeneficiaryResponseDto cuando la creacion es exitosa", async () => {
        const useCase = buildUseCase();
        const controller = new BeneficiaryController(useCase);
        const req = { body: BuildCreateBeneficiaryData() };
        const res = buildResponse();

        await controller.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledTimes(1);

        const payload = res.json.mock.calls[0][0];
        expect(payload).toBeInstanceOf(BeneficiaryResponseDto);
        expect(payload.id).toBe("3233-1118-1111-0005");
        expect(payload.fullName).toBe("Edgar Santana");
        expect(payload.accountNumber).toBe("009444816");
    });

    it("construye el DTO de entrada y se lo pasa al caso de uso", async () => {
        const useCase = buildUseCase();
        const controller = new BeneficiaryController(useCase);
        const res = buildResponse();

        await controller.create({ body: BuildCreateBeneficiaryData() }, res);

        expect(useCase.execute).toHaveBeenCalledTimes(1);
        const dto = useCase.execute.mock.calls[0][0];
        expect(dto.constructor.name).toBe("CreateBeneficiaryRequestDto");
        expect(dto.firstName).toBe("Edgar");
    });

    it("responde 201 con active false cuando la entidad resultante es inactiva", async () => {
        const useCase = buildUseCase({
            execute: jest.fn().mockResolvedValue(BuildBeneficiaryEntity({ active: false }))
        });
        const controller = new BeneficiaryController(useCase);
        const res = buildResponse();

        await controller.create({ body: BuildCreateBeneficiaryData() }, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json.mock.calls[0][0].active).toBe(false);
    });

    it("rechaza con ValidationError cuando el body es invalido y no llama al caso de uso", async () => {
        const useCase = buildUseCase();
        const controller = new BeneficiaryController(useCase);
        const res = buildResponse();

        await expect(controller.create({ body: { firstName: "E" } }, res))
            .rejects.toBeInstanceOf(ValidationError);

        expect(useCase.execute).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("propaga el error del caso de uso sin responder", async () => {
        const error = new Error("DB down");
        const useCase = buildUseCase({
            execute: jest.fn().mockRejectedValue(error)
        });
        const controller = new BeneficiaryController(useCase);
        const res = buildResponse();

        await expect(controller.create({ body: BuildCreateBeneficiaryData() }, res))
            .rejects.toBe(error);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("retorna la respuesta de express para permitir encadenamiento", async () => {
        const controller = new BeneficiaryController(buildUseCase());
        const res = buildResponse();

        const returned = await controller.create({ body: BuildCreateBeneficiaryData() }, res);

        expect(returned).toBe(res);
    });
});
