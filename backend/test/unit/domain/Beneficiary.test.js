const Beneficiary = require("../../../src/Domain/Beneficiary/entities/beneficiary");
const AccountNumber = require("../../../src/Domain/Shared/AccountNumber");
const BeneficiaryFullName = require("../../../src/Domain/Beneficiary/value-objects/BeneficiaryFullName");
const { BuildBeneficiaryData } = require("../../helpers/factories");

describe("Beneficiary", () => {
    it("se crea con datos validos", () => {
        const beneficiary = new Beneficiary(BuildBeneficiaryData());

        expect(beneficiary.id).toBe("3233-1118-1111-0005");
        expect(beneficiary.fullname.getFullName()).toBe("Edgar Santana");
        expect(beneficiary.accountNumber.value).toBe("009444816");
        expect(beneficiary.userId).toBe("d68c-5f65-2320-a83b");
        expect(beneficiary.active).toBe(true);
    });

    it("activa por defecto cuando no se envia el campo active", () => {
        const { active, ...data } = BuildBeneficiaryData();

        const beneficiary = new Beneficiary(data);

        expect(beneficiary.active).toBe(true);
    });

    it("respeta el estado inactivo cuando se envia active en false", () => {
        const beneficiary = new Beneficiary(BuildBeneficiaryData({ active: false }));

        expect(beneficiary.active).toBe(false);
    });

    it("asigna createdAt y updatedAt por defecto a la fecha actual", () => {
        const before = new Date();
        const beneficiary = new Beneficiary(BuildBeneficiaryData());
        const after = new Date();

        expect(beneficiary.createdAt).toBeInstanceOf(Date);
        expect(beneficiary.updatedAt).toBeInstanceOf(Date);
        expect(beneficiary.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(beneficiary.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("convierte createdAt y updatedAt recibidos a Date", () => {
        const beneficiary = new Beneficiary(
            BuildBeneficiaryData({
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-02T00:00:00.000Z"
            })
        );

        expect(beneficiary.createdAt).toBeInstanceOf(Date);
        expect(beneficiary.createdAt.toISOString()).toBe("2026-01-01T00:00:00.000Z");
        expect(beneficiary.updatedAt.toISOString()).toBe("2026-01-02T00:00:00.000Z");
    });

    it("lanza error si accountNumber no es un AccountNumber", () => {
        expect(() => new Beneficiary(BuildBeneficiaryData({ accountNumber: "009444816" })))
            .toThrow("Account Number is invalid");
    });

    it("lanza error si fullname no es un BeneficiaryFullName", () => {
        expect(() => new Beneficiary(BuildBeneficiaryData({ fullname: "Edgar Santana" })))
            .toThrow("Name is invalid");
    });

    it("lanza error si userId no es un string", () => {
        expect(() => new Beneficiary(BuildBeneficiaryData({ userId: 12345 })))
            .toThrow("Id is invalid");
    });

    it("lanza error si userId esta vacio o solo contiene espacios", () => {
        expect(() => new Beneficiary(BuildBeneficiaryData({ userId: "" })))
            .toThrow("Id is invalid");
        expect(() => new Beneficiary(BuildBeneficiaryData({ userId: "   " })))
            .toThrow("Id is invalid");
    });

    it("expone los value objects de nombre y cuenta", () => {
        const beneficiary = new Beneficiary(BuildBeneficiaryData());

        expect(beneficiary.fullname).toBeInstanceOf(BeneficiaryFullName);
        expect(beneficiary.accountNumber).toBeInstanceOf(AccountNumber);
    });
});
