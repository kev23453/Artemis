const InterestRate = require("../../../../src/Domain/Loan/Value-objects/InterestRate");

describe("InterestRate", () => {
    it("convierte la tasa anual a mensual", () => {
        const rate = new InterestRate(12);

        expect(rate.annualPercentage).toBe(12);
        expect(rate.annualDecimal).toBe(0.12);
        expect(rate.monthlyRate()).toBe(0.01);
        expect(rate.toString()).toBe("12.00");
    });

    it("acepta tasas con 2 decimales", () => {
        expect(new InterestRate(14.5).annualPercentage).toBe(14.5);
    });

    it.each([
        ["cero", 0],
        ["negativa", -1],
        ["mayor a 100", 100.01],
        ["mas de 2 decimales", 12.345],
        ["string", "12"],
        ["NaN", NaN]
    ])("lanza error con %s", (_label, value) => {
        expect(() => new InterestRate(value)).toThrow();
    });

    it("compara igualdad por valor", () => {
        expect(new InterestRate(12).equals(new InterestRate(12))).toBe(true);
        expect(new InterestRate(12).equals(new InterestRate(14))).toBe(false);
        expect(new InterestRate(12).equals(12)).toBe(false);
    });
});
