const CreateSavingsAccountRequestDto = require("../../../../src/Application/Savings_account/Dtos/CreateSavingsAccountRequestDto");
const ValidationError = require("../../../../src/Shared/Errors/ValidationError");
const { buildCreateSavingsAccountData } = require("../../../helpers/factories");

describe("CreateSavingsAccountRequestDto", () => {
    it("se crea con datos validos y expone cada campo", () => {
        const dto = new CreateSavingsAccountRequestDto(buildCreateSavingsAccountData());

        expect(dto.accountNumber).toBe("259984125");
        expect(dto.balance).toBe(6000);
        expect(dto.userId).toBe("8888-1111-0000-8889");
        expect(dto.isPrincipal).toBe(true);
        expect(dto.isActive).toBe(true);
        expect(dto.adminId).toBe("8898-5555-1118-5555");
    });

    it("aplica isPrincipal=false por defecto cuando no se envia", () => {
        const { isPrincipal, ...data } = buildCreateSavingsAccountData();

        const dto = new CreateSavingsAccountRequestDto(data);

        expect(dto.isPrincipal).toBe(false);
    });

    it("aplica isActive=true por defecto cuando no se envia", () => {
        const { isActive, ...data } = buildCreateSavingsAccountData();

        const dto = new CreateSavingsAccountRequestDto(data);

        expect(dto.isActive).toBe(true);
    });

    it("respeta isPrincipal e isActive cuando se envian explicitamente", () => {
        const dto = new CreateSavingsAccountRequestDto(
            buildCreateSavingsAccountData({ isPrincipal: false, isActive: false })
        );

        expect(dto.isPrincipal).toBe(false);
        expect(dto.isActive).toBe(false);
    });

    it("recorta los espacios del accountNumber", () => {
        const dto = new CreateSavingsAccountRequestDto(
            buildCreateSavingsAccountData({ accountNumber: "  259984125  " })
        );

        expect(dto.accountNumber).toBe("259984125");
    });

    it("congela la instancia para que no se pueda modificar", () => {
        const dto = new CreateSavingsAccountRequestDto(buildCreateSavingsAccountData());

        expect(Object.isFrozen(dto)).toBe(true);
    });

    it.each(
        [
            ["8 digitos", "25998412"],
            ["10 digitos", "2599841250"],
            ["con letras", "25998412a"],
            ["vacio", ""],
        ]
        )("lanza ValidationError cuando accountNumber es invalido (%s)", (_label, accountNumber) => {
        expect(() => new CreateSavingsAccountRequestDto(
            buildCreateSavingsAccountData({ accountNumber })
        )).toThrow(ValidationError);
    });

    it("lanza ValidationError cuando el balance es negativo", () => {
        expect(() => new CreateSavingsAccountRequestDto(
            buildCreateSavingsAccountData({ balance: -1 })
        )).toThrow(ValidationError);
    });

    it("lanza ValidationError cuando el balance no es numerico", () => {
        expect(() => new CreateSavingsAccountRequestDto(
            buildCreateSavingsAccountData({ balance: "6000" })
        )).toThrow(ValidationError);
    });

    it("lanza ValidationError cuando falta userId", () => {
        const { userId, ...data } = buildCreateSavingsAccountData();

        expect(() => new CreateSavingsAccountRequestDto(data)).toThrow(ValidationError);
    });

    it("lanza ValidationError cuando falta adminId", () => {
        const { adminId, ...data } = buildCreateSavingsAccountData();

        expect(() => new CreateSavingsAccountRequestDto(data)).toThrow(ValidationError);
    });

    it("incluye mensaje y detalles cuando los datos son invalidos", () => {
        try {
            new CreateSavingsAccountRequestDto(
                buildCreateSavingsAccountData({ accountNumber: "abc" })
            );
            throw new Error("Se esperaba un ValidationError");
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toBe("Invalid Savings account data");
            expect(error.statusCode).toBe(400);
            expect(error.details.length).toBeGreaterThan(0);
        }
    });
});
