const CreateSavingsAccountResponseDto = require("../../../../src/Application/Savings_account/Dtos/CreateSavingsAccountResponseDto");
const { buildSavingsAccountEntity } = require("../../../helpers/factories");

describe("CreateSavingsAccountResponseDto", () => {
    it("mapea todos los campos de la entidad SavingsAccount", () => {
        const entity = buildSavingsAccountEntity();

        const dto = new CreateSavingsAccountResponseDto(entity);

        expect(dto.id).toBe("4444-0008-8888-0059");
        expect(dto.accountNumber).toBe("259984125");
        expect(dto.balance).toBe(6000);
        expect(dto.userId).toBe("8888-1111-0000-8889");
        expect(dto.isPrincipal).toBe(true);
        expect(dto.isActive).toBe(true);
        expect(dto.adminId).toBe("8898-5555-1118-5555");
    });

    it("expone la fecha de creacion de la entidad", () => {
        const createdAt = new Date("2026-01-01T00:00:00.000Z");
        const entity = buildSavingsAccountEntity({ createdAt });

        const dto = new CreateSavingsAccountResponseDto(entity);

        expect(dto.createdAt).toBeInstanceOf(Date);
        expect(dto.createdAt.getTime()).toBe(createdAt.getTime());
    });

    it("respeta los estados inactivo y no principal", () => {
        const entity = buildSavingsAccountEntity({ isActive: false, isPrincipal: false });

        const dto = new CreateSavingsAccountResponseDto(entity);

        expect(dto.isActive).toBe(false);
        expect(dto.isPrincipal).toBe(false);
    });

    it("congela la instancia para que no se pueda modificar", () => {
        const dto = new CreateSavingsAccountResponseDto(buildSavingsAccountEntity());

        expect(Object.isFrozen(dto)).toBe(true);
    });

    it("lanza error cuando no recibe una entidad SavingsAccount", () => {
        expect(() => new CreateSavingsAccountResponseDto({ id: "123" }))
            .toThrow("CreateSavingsAccountResponseDto expects a Savings account entity");
    });
});
