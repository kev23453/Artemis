const CardNumber = require("../../../../src/Domain/Cards/Value-objects/CardNumber");

describe("CardNumber", () => {
    it("se crea con un string de exactamente 16 digitos", () => {
        const cardNumber = new CardNumber("4111111111111111");

        expect(cardNumber.value).toBe("4111111111111111");
    });

    it("normaliza espacios y guiones", () => {
        const cardNumber = new CardNumber("4111-1111 1111-1111");

        expect(cardNumber.value).toBe("4111111111111111");
    });

    it("expone los ultimos 4 digitos", () => {
        const cardNumber = new CardNumber("4111111111111234");

        expect(cardNumber.last4).toBe("1234");
    });

    it("expone el numero enmascarado", () => {
        const cardNumber = new CardNumber("4111111111111234");

        expect(cardNumber.masked).toBe("**** **** **** 1234");
    });

    it.each([
        ["numero", 4111111111111111],
        ["null", null],
        ["undefined", undefined],
        ["objeto", {}],
        ["array", ["4"]]
    ])("lanza error cuando el valor es un %s", (_label, value) => {
        expect(() => new CardNumber(value))
            .toThrow("Card number must be a string");
    });

    it.each([
        ["vacio", ""],
        ["15 digitos", "411111111111111"],
        ["17 digitos", "41111111111111111"],
        ["letras", "411111111111111a"],
        ["simbolos", "4111-1111-1111-111a"]
    ])("lanza error cuando el valor tiene formato invalido (%s)", (_label, value) => {
        expect(() => new CardNumber(value))
            .toThrow("Card number must have exactly 16 digits");
    });

    it("es igual a otro CardNumber con el mismo valor", () => {
        const a = new CardNumber("4111111111111111");
        const b = new CardNumber("4111111111111111");

        expect(a.equals(b)).toBe(true);
    });

    it("no es igual a otro CardNumber con distinto valor", () => {
        const a = new CardNumber("4111111111111111");
        const b = new CardNumber("4111111111111112");

        expect(a.equals(b)).toBe(false);
    });

    it("no es igual cuando el otro valor no es un CardNumber", () => {
        const cardNumber = new CardNumber("4111111111111111");

        expect(cardNumber.equals("4111111111111111")).toBe(false);
    });
});
