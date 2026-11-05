const AccountNumber = require("../../../../src/Domain/Shared/AccountNumber");

describe("AccountNumber", () => {
    it("se crea con un string de exactamente 9 digitos", () => {
        const accountNumber = new AccountNumber("009444816");

        expect(accountNumber.value).toBe("009444816");
    });

    it("acepta valores que empiezan con ceros", () => {
        const accountNumber = new AccountNumber("000000001");

        expect(accountNumber.value).toBe("000000001");
    });

    it.each([
        ["numero", 9444816],
        ["null", null],
        ["undefined", undefined],
        ["objeto", {}],
        ["array", ["0", "0", "9"]],
    ])("lanza error cuando el valor es un %s", (_label, value) => {
        expect(() => new AccountNumber(value))
            .toThrow("El número de cuenta debe ser un formato de texto.");
    });

    it.each([
        ["vacio", ""],
        ["8 digitos", "12345678"],
        ["10 digitos", "0123456789"],
    ])("lanza error cuando el valor tiene longitud invalida (%s)", (_label, value) => {
        expect(() => new AccountNumber(value))
            .toThrow("El numero de cuenta debe tener exactamente 9 caracteres.");
    });

    it.each([
        ["letras", "12345678a"],
        ["espacios", "1234 5678"],
        ["simbolos", "123-45678"],
        ["decimal", "12345.678"],
    ])("lanza error cuando el valor contiene %s", (_label, value) => {
        expect(() => new AccountNumber(value))
            .toThrow("El número de cuenta solo puede contener números.");
    });

    it("es igual a otro AccountNumber con el mismo valor", () => {
        const a = new AccountNumber("009444816");
        const b = new AccountNumber("009444816");

        expect(a.equals(b)).toBe(true);
    });

    it("no es igual a otro AccountNumber con distinto valor", () => {
        const a = new AccountNumber("009444816");
        const b = new AccountNumber("009444817");

        expect(a.equals(b)).toBe(false);
    });

    it("no es igual cuando el otro valor no es un AccountNumber", () => {
        const a = new AccountNumber("009444816");

        expect(a.equals("009444816")).toBe(false);
    });
});
