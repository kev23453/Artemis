const BeneficiaryFullName = require("../../../../src/Domain/Beneficiary/value-objects/BeneficiaryFullName");

describe("BeneficiaryFullName", () => {
    it("se crea con nombre y apellido validos", () => {
        const fullName = new BeneficiaryFullName("Edgar", "Santana");

        expect(fullName.firstName).toBe("Edgar");
        expect(fullName.lastName).toBe("Santana");
    });

    it("construye el nombre completo con nombre y apellido", () => {
        const fullName = new BeneficiaryFullName("Edgar", "Santana");

        expect(fullName.getFullName()).toBe("Edgar Santana");
    });

    it("recorta espacios al inicio y al final de nombre y apellido", () => {
        const fullName = new BeneficiaryFullName("  Edgar  ", "  Santana  ");

        expect(fullName.firstName).toBe("Edgar");
        expect(fullName.lastName).toBe("Santana");
        expect(fullName.getFullName()).toBe("Edgar Santana");
    });

    it.each([
        ["vacio", ""],
        ["undefined", undefined],
        ["null", null],
        ["un caracter", "E"],
    ])("lanza error cuando el nombre es %s", (_label, name) => {
        expect(() => new BeneficiaryFullName(name, "Santana"))
            .toThrow("First name is too short");
    });

    it.each([
        ["vacio", ""],
        ["undefined", undefined],
        ["null", null],
        ["un caracter", "S"],
    ])("lanza error cuando el apellido es %s", (_label, lastName) => {
        expect(() => new BeneficiaryFullName("Edgar", lastName))
            .toThrow("Last name is too short");
    });
});
