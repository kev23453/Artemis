const ExpirationDate = require("../../../../src/Domain/Cards/Value-objects/ExpirationDate");

describe("ExpirationDate", () => {
    it("se crea con mes y año validos", () => {
        const expiration = new ExpirationDate(3, 2026);

        expect(expiration.month).toBe(3);
        expect(expiration.year).toBe(2026);
    });

    it("convierte un año de 2 digitos a 2000+", () => {
        const expiration = new ExpirationDate("03", "26");

        expect(expiration.year).toBe(2026);
    });

    it("expone monthString, yearString y toString", () => {
        const expiration = new ExpirationDate(3, 2026);

        expect(expiration.monthString).toBe("03");
        expect(expiration.yearString).toBe("26");
        expect(expiration.toString()).toBe("03/26");
    });

    it("crea una expiracion a partir de una fecha", () => {
        const expiration = ExpirationDate.fromDate(new Date("2028-07-15T00:00:00.000Z"));

        expect(expiration.toString()).toBe("07/28");
    });

    it("crea una expiracion a partir de un string MM/AA", () => {
        expect(ExpirationDate.fromString("11/29").toString()).toBe("11/29");
        expect(ExpirationDate.fromString("7/2029").toString()).toBe("07/29");
    });

    it.each([
        ["cero", 0],
        ["trece", 13],
        ["texto", "abc"]
    ])("lanza error cuando el mes es %s", (_label, month) => {
        expect(() => new ExpirationDate(month, 2026))
            .toThrow("Expiration month must be between 1 and 12");
    });

    it.each([
        ["negativo", -1],
        ["decimal", 1.5],
        ["texto", "abc"]
    ])("lanza error cuando el año es %s", (_label, year) => {
        expect(() => new ExpirationDate(1, year))
            .toThrow("Expiration year is invalid");
    });

    it.each([
        ["formato invalido", "2026-01"],
        ["mes invalido", "13/26"],
        ["vacio", ""]
    ])("lanza error al crear desde un string (%s)", (_label, value) => {
        expect(() => ExpirationDate.fromString(value)).toThrow();
    });

    it("lanza error al crear desde una fecha invalida", () => {
        expect(() => ExpirationDate.fromDate("no-date"))
            .toThrow("Expiration date is invalid");
    });

    it("lanza error cuando la fecha es null o undefined", () => {
        expect(() => ExpirationDate.fromDate(null))
            .toThrow("Expiration date is invalid");
        expect(() => ExpirationDate.fromDate(undefined))
            .toThrow("Expiration date is invalid");
    });

    describe("isExpired", () => {
        it("no ha expirado durante el mes de expiracion", () => {
            const expiration = new ExpirationDate(3, 2026);

            expect(expiration.isExpired(new Date("2026-03-01T00:00:00.000Z"))).toBe(false);
            expect(expiration.isExpired(new Date("2026-03-31T23:59:59.000Z"))).toBe(false);
        });

        it("expira al comenzar el mes siguiente", () => {
            const expiration = new ExpirationDate(3, 2026);

            expect(expiration.isExpired(new Date("2026-04-01T00:00:00.000Z"))).toBe(true);
        });

        it("acepta un string como fecha de referencia", () => {
            const expiration = new ExpirationDate(3, 2026);

            expect(expiration.isExpired("2026-04-01T00:00:00.000Z")).toBe(true);
        });

        it("lanza error con una fecha de referencia invalida", () => {
            const expiration = new ExpirationDate(3, 2026);

            expect(() => expiration.isExpired("no-date"))
                .toThrow("Reference date is invalid");
        });
    });

    it("es igual a otra expiracion con el mismo mes y año", () => {
        const a = new ExpirationDate(3, 2026);
        const b = new ExpirationDate("03", "26");

        expect(a.equals(b)).toBe(true);
    });

    it("no es igual a otra expiracion con distinto mes o año", () => {
        const a = new ExpirationDate(3, 2026);

        expect(a.equals(new ExpirationDate(4, 2026))).toBe(false);
        expect(a.equals(new ExpirationDate(3, 2027))).toBe(false);
    });

    it("no es igual cuando el otro valor no es un ExpirationDate", () => {
        const expiration = new ExpirationDate(3, 2026);

        expect(expiration.equals("03/26")).toBe(false);
    });
});
