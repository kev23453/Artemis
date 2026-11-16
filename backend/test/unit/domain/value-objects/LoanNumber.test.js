const LoanNumber = require("../../../../src/Domain/Loan/Value-objects/LoanNumber");

describe("LoanNumber", () => {
    it("acepta 9 digitos y conserva ceros a la izquierda", () => {
        const loanNumber = new LoanNumber("012345678");

        expect(loanNumber.value).toBe("012345678");
        expect(loanNumber.toString()).toBe("012345678");
    });

    it("genera un numero de 9 digitos", () => {
        const loanNumber = LoanNumber.generate();

        expect(loanNumber.value).toMatch(/^\d{9}$/);
    });

    it.each([
        ["numero", 123456789],
        ["8 digitos", "12345678"],
        ["10 digitos", "1234567890"],
        ["letras", "12345678a"],
        ["vacio", ""],
        ["null", null]
    ])("lanza error con %s", (_label, value) => {
        expect(() => new LoanNumber(value)).toThrow();
    });

    it("compara igualdad por valor", () => {
        expect(new LoanNumber("123456789").equals(new LoanNumber("123456789"))).toBe(true);
        expect(new LoanNumber("123456789").equals(new LoanNumber("987654321"))).toBe(false);
        expect(new LoanNumber("123456789").equals("123456789")).toBe(false);
    });
});
