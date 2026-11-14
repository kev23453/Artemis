const Cvc = require("../../../../src/Domain/Cards/Value-objects/Cvc");

describe("Cvc", () => {
    it("se crea con exactamente 3 digitos", () => {
        const cvc = new Cvc("123");

        expect(cvc.value).toBe("123");
    });

    it("genera un cvc aleatorio de 3 digitos", () => {
        const cvc = Cvc.generate();

        expect(cvc.value).toMatch(/^\d{3}$/);
    });

    it("genera un hash SHA-256 deterministico", () => {
        expect(Cvc.hash("123"))
            .toBe("a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3");
        expect(new Cvc("123").hash).toBe(Cvc.hash("123"));
    });

    it("verifica el hash del cvc", () => {
        const cvc = new Cvc("123");

        expect(cvc.matchesHash(cvc.hash)).toBe(true);
        expect(cvc.matchesHash(Cvc.hash("321"))).toBe(false);
    });

    it("compara un valor contra un hash", () => {
        const hash = Cvc.hash("123");

        expect(Cvc.matches("123", hash)).toBe(true);
        expect(Cvc.matches("321", hash)).toBe(false);
    });

    it("retorna false cuando el hash no es un string", () => {
        expect(Cvc.matches("123", null)).toBe(false);
    });

    it.each([
        ["numero", 123],
        ["dos digitos", "12"],
        ["cuatro digitos", "1234"],
        ["letras", "12a"],
        ["null", null],
        ["undefined", undefined]
    ])("lanza error cuando el valor es %s", (_label, value) => {
        expect(() => new Cvc(value))
            .toThrow("Cvc must be a string of exactly 3 digits");
    });

    it("lanza error al hashear un valor invalido", () => {
        expect(() => Cvc.hash("12"))
            .toThrow("Cvc must be a string of exactly 3 digits");
    });

    it("es igual a otro Cvc con el mismo valor", () => {
        const a = new Cvc("123");
        const b = new Cvc("123");

        expect(a.equals(b)).toBe(true);
    });

    it("no es igual a otro Cvc con distinto valor", () => {
        const a = new Cvc("123");
        const b = new Cvc("321");

        expect(a.equals(b)).toBe(false);
    });

    it("no es igual cuando el otro valor no es un Cvc", () => {
        const cvc = new Cvc("123");

        expect(cvc.equals("123")).toBe(false);
    });
});
