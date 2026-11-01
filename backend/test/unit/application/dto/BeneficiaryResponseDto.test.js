const BeneficiaryResponseDto = require("../../../../src/Application/Beneficiary/Dtos/BeneficiaryResponseDto");
const { BuildBeneficiaryEntity } = require("../../../helpers/factories");

describe("BeneficiaryResponseDto", () => {
    it("mapea todos los campos de la entidad Beneficiary", () => {
        const entity = BuildBeneficiaryEntity();

        const dto = new BeneficiaryResponseDto(entity);

        expect(dto.id).toBe("3233-1118-1111-0005");
        expect(dto.firstName).toBe("Edgar");
        expect(dto.lastName).toBe("Santana");
        expect(dto.fullName).toBe("Edgar Santana");
        expect(dto.accountNumber).toBe("009444816");
        expect(dto.userId).toBe("d68c-5f65-2320-a83b");
        expect(dto.active).toBe(true);
    });

    it("mantiene las fechas de la entidad como Date", () => {
        const createdAt = new Date("2026-01-01T00:00:00.000Z");
        const updatedAt = new Date("2026-01-02T00:00:00.000Z");
        const entity = BuildBeneficiaryEntity({ createdAt, updatedAt });

        const dto = new BeneficiaryResponseDto(entity);

        expect(dto.createdAt).toBeInstanceOf(Date);
        expect(dto.updatedAt).toBeInstanceOf(Date);
        expect(dto.createdAt.getTime()).toBe(createdAt.getTime());
        expect(dto.updatedAt.getTime()).toBe(updatedAt.getTime());
    });

    it("respeta el estado inactivo de la entidad", () => {
        const entity = BuildBeneficiaryEntity({ active: false });

        const dto = new BeneficiaryResponseDto(entity);

        expect(dto.active).toBe(false);
    });

    it("congela la instancia para que no se pueda modificar", () => {
        const dto = new BeneficiaryResponseDto(BuildBeneficiaryEntity());

        expect(Object.isFrozen(dto)).toBe(true);
    });

    it("lanza error cuando no recibe una entidad Beneficiary", () => {
        expect(() => new BeneficiaryResponseDto({ id: "123" }))
            .toThrow("BeneficiaryResponseDto expects a Beneficiary entity");
    });
});
