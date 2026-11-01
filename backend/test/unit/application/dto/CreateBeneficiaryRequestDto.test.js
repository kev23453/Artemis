const CreateBeneficiaryRequestDto = require("../../../../src/Application/Beneficiary/Dtos/CreateBeneficiaryRequestDto");
const ValidationError = require("../../../../src/Shared/Errors/ValidationError");
const { BuildCreateBeneficiaryData } = require("../../../helpers/factories");

describe("CreateBeneficiaryRequestDto", () => {
    it("se crea con datos validos y expone cada campo", () => {
        const dto = new CreateBeneficiaryRequestDto(BuildCreateBeneficiaryData());

        expect(dto.firstName).toBe("Edgar");
        expect(dto.lastName).toBe("Santana");
        expect(dto.accountNumber).toBe("009444816");
        expect(dto.userId).toBe("d68c-5f65-2320-a83b");
        expect(dto.active).toBe(true);
    });

    it("activa el beneficiario por defecto cuando no se envia active", () => {
        const dto = new CreateBeneficiaryRequestDto(BuildCreateBeneficiaryData());

        expect(dto.active).toBe(true);
    });

    it("respeta active en false cuando se envia explicitamente", () => {
        const dto = new CreateBeneficiaryRequestDto(
            BuildCreateBeneficiaryData({ active: false })
        );

        expect(dto.active).toBe(false);
    });

    it("recorta espacios en nombre, apellido, cuenta y userId", () => {
        const dto = new CreateBeneficiaryRequestDto(
            BuildCreateBeneficiaryData({
                firstName: "  Edgar  ",
                lastName: "  Santana  ",
                userId: "  d68c-5f65-2320-a83b  "
            })
        );

        expect(dto.firstName).toBe("Edgar");
        expect(dto.lastName).toBe("Santana");
        expect(dto.userId).toBe("d68c-5f65-2320-a83b");
    });

    it("congela la instancia para que no se pueda modificar", () => {
        const dto = new CreateBeneficiaryRequestDto(BuildCreateBeneficiaryData());

        expect(Object.isFrozen(dto)).toBe(true);
    });

    it("lanza ValidationError cuando la cuenta no tiene 9 digitos", () => {
        expect(() => new CreateBeneficiaryRequestDto(
            BuildCreateBeneficiaryData({ accountNumber: "12345678" })
        )).toThrow(ValidationError);
    });

    it("lanza ValidationError cuando la cuenta contiene letras", () => {
        expect(() => new CreateBeneficiaryRequestDto(
            BuildCreateBeneficiaryData({ accountNumber: "12345678a" })
        )).toThrow(ValidationError);
    });

    it("lanza ValidationError cuando el nombre es demasiado corto", () => {
        expect(() => new CreateBeneficiaryRequestDto(
            BuildCreateBeneficiaryData({ firstName: "E" })
        )).toThrow(ValidationError);
    });

    it("lanza ValidationError cuando el apellido es demasiado corto", () => {
        expect(() => new CreateBeneficiaryRequestDto(
            BuildCreateBeneficiaryData({ lastName: "S" })
        )).toThrow(ValidationError);
    });

    it("lanza ValidationError cuando falta userId", () => {
        const { userId, ...data } = BuildCreateBeneficiaryData();

        expect(() => new CreateBeneficiaryRequestDto(data)).toThrow(ValidationError);
    });

    it("lanza ValidationError cuando userId esta vacio", () => {
        expect(() => new CreateBeneficiaryRequestDto(
            BuildCreateBeneficiaryData({ userId: "   " })
        )).toThrow(ValidationError);
    });

    it("incluye el mensaje y los detalles del error de validacion", () => {
        try {
            new CreateBeneficiaryRequestDto(
                BuildCreateBeneficiaryData({ accountNumber: "abc" })
            );
            throw new Error("Se esperaba un ValidationError");
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toBe("Invalid beneficiary data");
            expect(error.statusCode).toBe(400);
            expect(error.details.length).toBeGreaterThan(0);
        }
    });
});
