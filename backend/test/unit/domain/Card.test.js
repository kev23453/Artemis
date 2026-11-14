const Card = require("../../../src/Domain/Cards/Entities/Card");
const { buildCardData } = require("../../helpers/factories");

describe("Card Entity", () => {
    const validProps = buildCardData();

    describe("Constructor and validations", () => {
        test("creates a valid instance with all its params", () => {
            const card = new Card(validProps);

            expect(card.id).toBe(validProps.id);
            expect(card.identifierNumber).toBe(validProps.identifierNumber);
            expect(card.creditLimit).toBe(validProps.creditLimit);
            expect(card.expireDate).toEqual(new Date(validProps.expireDate));
            expect(card.cvcCode).toBe(validProps.cvcCode);
            expect(card.isActive).toBe(true);
            expect(card.userId).toBe(validProps.userId);
            expect(card.adminId).toBe(validProps.adminId);
            expect(card.createdAt).toBeInstanceOf(Date);
            expect(card.updatedAt).toBeInstanceOf(Date);
        });

        test("defaults isActive to true when it is not provided", () => {
            const { isActive, ...data } = validProps;

            const card = new Card(data);

            expect(card.isActive).toBe(true);
        });

        test("respects isActive false", () => {
            const card = new Card({ ...validProps, isActive: false });

            expect(card.isActive).toBe(false);
        });

        test("keeps a Date instance for expireDate", () => {
            const expireDate = new Date("2029-05-31T00:00:00.000Z");

            const card = new Card({ ...validProps, expireDate });

            expect(card.expireDate).toBe(expireDate);
        });

        test("converts a string expireDate to Date", () => {
            const card = new Card({ ...validProps, expireDate: "2029-05-31T00:00:00.000Z" });

            expect(card.expireDate).toBeInstanceOf(Date);
            expect(card.expireDate.toISOString()).toBe("2029-05-31T00:00:00.000Z");
        });

        test("assigns createdAt and updatedAt by default", () => {
            const before = Date.now();
            const card = new Card(validProps);
            const after = Date.now();

            expect(card.createdAt.getTime()).toBeGreaterThanOrEqual(before);
            expect(card.createdAt.getTime()).toBeLessThanOrEqual(after);
            expect(card.updatedAt.getTime()).toBeGreaterThanOrEqual(before);
            expect(card.updatedAt.getTime()).toBeLessThanOrEqual(after);
        });

        test("converts received createdAt and updatedAt to Date", () => {
            const card = new Card({
                ...validProps,
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-02T00:00:00.000Z"
            });

            expect(card.createdAt.toISOString()).toBe("2026-01-01T00:00:00.000Z");
            expect(card.updatedAt.toISOString()).toBe("2026-01-02T00:00:00.000Z");
        });

        it.each([
            ["a number", 123],
            ["empty", ""],
            ["spaces", "   "]
        ])("throws when id is %s", (_label, id) => {
            expect(() => new Card({ ...validProps, id })).toThrow("Id must be a non empty string");
        });

        it.each([
            ["a string", "4111111111111111"],
            ["a decimal", 1.5],
            ["negative", -1],
            ["zero", 0]
        ])("throws when identifierNumber is %s", (_label, identifierNumber) => {
            expect(() => new Card({ ...validProps, identifierNumber }))
                .toThrow("Card identifier number must be a positive integer");
        });

        it.each([
            ["a string", "5000"],
            ["negative", -1],
            ["NaN", NaN],
            ["Infinity", Infinity]
        ])("throws when creditLimit is %s", (_label, creditLimit) => {
            expect(() => new Card({ ...validProps, creditLimit }))
                .toThrow("Credit limit must be a positive number");
        });

        it.each([
            ["undefined", undefined],
            ["null", null],
            ["an invalid string", "not-a-date"],
            ["a plain object", {}]
        ])("throws when expireDate is %s", (_label, expireDate) => {
            expect(() => new Card({ ...validProps, expireDate }))
                .toThrow("Expire date must be a valid date");
        });

        it.each([
            ["a number", 123],
            ["two digits", "12"],
            ["four digits", "1234"],
            ["letters", "12a"]
        ])("throws when cvcCode is %s", (_label, cvcCode) => {
            expect(() => new Card({ ...validProps, cvcCode }))
                .toThrow("Cvc code must be a string of exactly 3 digits");
        });

        it.each([
            ["a string", "true"],
            ["a number", 1]
        ])("throws when isActive is %s", (_label, isActive) => {
            expect(() => new Card({ ...validProps, isActive }))
                .toThrow("Is active must be a boolean");
        });

        it.each([
            ["a number", 123],
            ["empty", ""],
            ["spaces", "   "]
        ])("throws when userId is %s", (_label, userId) => {
            expect(() => new Card({ ...validProps, userId }))
                .toThrow("User id must be a non empty string");
        });

        it.each([
            ["a number", 123],
            ["empty", ""],
            ["spaces", "   "]
        ])("throws when adminId is %s", (_label, adminId) => {
            expect(() => new Card({ ...validProps, adminId }))
                .toThrow("Admin id must be a non empty string");
        });
    });

    describe("Behavior: activate, deactivate and cancel", () => {
        test("activate sets isActive to true", () => {
            const card = new Card({ ...validProps, isActive: false });

            card.activate();

            expect(card.isActive).toBe(true);
        });

        test("deactivate sets isActive to false", () => {
            const card = new Card(validProps);

            card.deactivate();

            expect(card.isActive).toBe(false);
        });

        test("cancel sets isActive to false", () => {
            const card = new Card(validProps);

            card.cancel();

            expect(card.isActive).toBe(false);
        });

        test("activation updates updatedAt", () => {
            const card = new Card({ ...validProps, updatedAt: "2020-01-01T00:00:00.000Z" });

            card.activate();

            expect(card.updatedAt.getTime()).toBeGreaterThan(new Date("2020-01-01T00:00:00.000Z").getTime());
        });
    });

    describe("Behavior: updateCreditLimit", () => {
        test("updates the credit limit with a valid amount", () => {
            const card = new Card(validProps);

            card.updateCreditLimit(75000);

            expect(card.creditLimit).toBe(75000);
        });

        test("accepts zero as a credit limit", () => {
            const card = new Card(validProps);

            card.updateCreditLimit(0);

            expect(card.creditLimit).toBe(0);
        });

        test("updates updatedAt", () => {
            const card = new Card({ ...validProps, updatedAt: "2020-01-01T00:00:00.000Z" });

            card.updateCreditLimit(1000);

            expect(card.updatedAt.getTime()).toBeGreaterThan(new Date("2020-01-01T00:00:00.000Z").getTime());
        });

        it.each([
            ["a string", "5000"],
            ["negative", -1],
            ["NaN", NaN],
            ["Infinity", Infinity]
        ])("throws when the new limit is %s", (_label, newCreditLimit) => {
            const card = new Card(validProps);

            expect(() => card.updateCreditLimit(newCreditLimit))
                .toThrow("Credit limit must be a positive number");
        });
    });

    describe("Behavior: isExpired", () => {
        test("returns false when the card has not expired", () => {
            const card = new Card({ ...validProps, expireDate: "2028-03-31T23:59:59.000Z" });

            expect(card.isExpired(new Date("2028-03-31T23:59:58.000Z"))).toBe(false);
        });

        test("returns true after the expiration date", () => {
            const card = new Card({ ...validProps, expireDate: "2028-03-31T23:59:59.000Z" });

            expect(card.isExpired(new Date("2028-04-01T00:00:00.000Z"))).toBe(true);
        });

        test("returns true for a card expired in the past", () => {
            const card = new Card({ ...validProps, expireDate: "2020-01-01T00:00:00.000Z" });

            expect(card.isExpired()).toBe(true);
        });

        test("accepts a string as reference date", () => {
            const card = new Card({ ...validProps, expireDate: "2028-03-31T23:59:59.000Z" });

            expect(card.isExpired("2028-04-01T00:00:00.000Z")).toBe(true);
        });
    });
});
