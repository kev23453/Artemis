const PaymentStatus = require("../../../../src/Domain/Loan/Value-objects/PaymentStatus");

describe("PaymentStatus", () => {
    it("por defecto esta al dia", () => {
        const status = new PaymentStatus();

        expect(status.value).toBe(PaymentStatus.AL_DIA);
        expect(status.isOverdue()).toBe(false);
        expect(status.toString()).toBe("al día");
    });

    it("puede estar retrasado", () => {
        const status = PaymentStatus.retrasado();

        expect(status.isOverdue()).toBe(true);
        expect(status.toString()).toBe("en mora");
    });

    it("normaliza valores desde string", () => {
        expect(PaymentStatus.from("al día").isOverdue()).toBe(false);
        expect(PaymentStatus.from("AL_DIA").isOverdue()).toBe(false);
        expect(PaymentStatus.from("en mora").isOverdue()).toBe(true);
        expect(PaymentStatus.from("Retrasado").isOverdue()).toBe(true);
    });

    it("cambia de estado sin mutar la instancia original", () => {
        const current = PaymentStatus.alDia();
        const overdue = current.markOverdue();

        expect(current.isOverdue()).toBe(false);
        expect(overdue.isOverdue()).toBe(true);
        expect(overdue.markCurrent().isOverdue()).toBe(false);
    });

    it("rechaza estados invalidos", () => {
        expect(() => PaymentStatus.from("desconocido")).toThrow();
        expect(() => new PaymentStatus("otro")).toThrow();
    });

    it("compara igualdad por valor", () => {
        expect(PaymentStatus.alDia().equals(PaymentStatus.alDia())).toBe(true);
        expect(PaymentStatus.alDia().equals(PaymentStatus.retrasado())).toBe(false);
        expect(PaymentStatus.alDia().equals("al Dia")).toBe(false);
    });
});
