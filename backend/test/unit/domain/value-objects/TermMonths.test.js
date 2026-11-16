const TermMonths = require("../../../../src/Domain/Loan/Value-objects/TermMonths");

describe("TermMonths", () => {
    it.each([6, 12, 24, 60])("acepta %i meses", (months) => {
        expect(new TermMonths(months).value).toBe(months);
    });

    it.each([
        ["menor a 6", 5],
        ["mayor a 60", 66],
        ["no multiplo de 6", 7],
        ["decimal", 12.5],
        ["string", "12"],
        ["null", null]
    ])("lanza error con %s", (_label, value) => {
        expect(() => new TermMonths(value)).toThrow();
    });

    it("compara igualdad por valor", () => {
        expect(new TermMonths(12).equals(new TermMonths(12))).toBe(true);
        expect(new TermMonths(12).equals(new TermMonths(18))).toBe(false);
        expect(new TermMonths(12).equals(12)).toBe(false);
    });
});
