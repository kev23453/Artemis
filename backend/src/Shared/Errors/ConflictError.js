const AppError = require("./AppError");
const errorCodes = require("./ErrorCodes");

class ConflictError extends AppError {
    constructor(message = "Conflict Error") {
        super(message, 409, errorCodes.CONFLICT_ERROR);
    }
}

module.exports = ConflictError;