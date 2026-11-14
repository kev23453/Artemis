class ExpirationDate {
    #month;
    #year;

    constructor(month, year) {
        const parsedMonth = Number(month);
        const parsedYear = Number(year);

        if(!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
            throw new Error("Expiration month must be between 1 and 12");
        }

        if(!Number.isInteger(parsedYear) || parsedYear < 0) {
            throw new Error("Expiration year is invalid");
        }

        this.#month = parsedMonth;
        this.#year = parsedYear < 100 ? 2000 + parsedYear : parsedYear;

        Object.freeze(this);
    }

    static fromDate(date) {
        if(date === null || date === undefined) {
            throw new Error("Expiration date is invalid");
        }

        const parsedDate = date instanceof Date ? date : new Date(date);
        if(Number.isNaN(parsedDate.getTime())) {
            throw new Error("Expiration date is invalid");
        }

        return new ExpirationDate(parsedDate.getUTCMonth() + 1, parsedDate.getUTCFullYear());
    }

    static fromString(value) {
        if(typeof value !== "string" || !/^\d{1,2}\/\d{2,4}$/.test(value)) {
            throw new Error("Expiration date must have the format MM/AA");
        }

        const [month, year] = value.split("/");
        return new ExpirationDate(month, year);
    }

    get month() { return this.#month; }
    get year() { return this.#year; }
    get monthString() { return String(this.#month).padStart(2, "0"); }
    get yearString() { return String(this.#year).slice(-2); }

    isExpired(referenceDate = new Date()) {
        const reference = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
        if(Number.isNaN(reference.getTime())) {
            throw new Error("Reference date is invalid");
        }

        const firstDayOfNextMonth = Date.UTC(this.#year, this.#month, 1);
        return reference.getTime() >= firstDayOfNextMonth;
    }

    toString() {
        return `${this.monthString}/${this.yearString}`;
    }

    equals(otherExpirationDate) {
        return otherExpirationDate instanceof ExpirationDate &&
            this.#month === otherExpirationDate.month &&
            this.#year === otherExpirationDate.year;
    }
}

module.exports = ExpirationDate;
