const AppError = require("./AppError");
const errorCodes = require("./ErrorCodes");

class ValidationError extends AppError {
    constructor(message = "Validation failed", details = {}) {
        super(message, 400, errorCodes.VALIDATION_ERROR);
        this.details = details;
    }
}

module.exports = ValidationError;