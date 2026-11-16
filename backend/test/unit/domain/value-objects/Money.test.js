const Money = require("../../../../src/Domain/Shared/Money");

describe("Money", () => {
    it("se crea desde un numero y normaliza a 2 decimales", () => {
        const money = Money.of(100.5);

        expect(money.toString()).toBe("100.50");
        expect(money.toCents()).toBe(10050);
        expect(money.toNumber()).toBe(100.5);
    });

    it("se crea desde un string con hasta 2 decimales", () => {
        expect(Money.of("0.01").toCents()).toBe(1);
        expect(Money.of("1234.5").toString()).toBe("1234.50");
    });

    it("se crea desde centavos", () => {
        expect(Money.fromCents(1234).toString()).toBe("12.34");
    });

    it("tolera el ruido de punto flotante en numeros", () => {
        expect(Money.of(0.1 + 0.2).toString()).toBe("0.30");
    });

    it.each([
        ["negativo", -1],
        ["mas de 2 decimales", 1.234],
        ["string invalido", "abc"],
        ["string negativo", "-5"],
        ["null", null],
        ["objeto", {}]
    ])("lanza error con %s", (_label, value) => {
        expect(() => Money.of(value)).toThrow();
    });

    it("suma y resta", () => {
        const a = Money.of(10.25);
        const b = Money.of(2.5);

        expect(a.plus(b).toString()).toBe("12.75");
        expect(a.minus(b).toString()).toBe("7.75");
    });

    it("no permite que la resta quede negativa", () => {
        expect(() => Money.of(1).minus(Money.of(2))).toThrow("Money cannot be negative");
    });

    it("multiplica redondeando a centavos", () => {
        expect(Money.of(10).times(0.0625).toString()).toBe("0.63");
    });

    it("compara montos", () => {
        const low = Money.of(10);
        const high = Money.of(20);

        expect(high.isGreaterThan(low)).toBe(true);
        expect(high.isGreaterThanOrEqual(high)).toBe(true);
        expect(low.isLessThan(high)).toBe(true);
        expect(Money.zero().isZero()).toBe(true);
    });

    it("compara igualdad por valor", () => {
        expect(Money.of(10).equals(Money.of("10.00"))).toBe(true);
        expect(Money.of(10).equals(Money.of(11))).toBe(false);
        expect(Money.of(10).equals(10)).toBe(false);
    });
});
