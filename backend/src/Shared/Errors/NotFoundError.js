const AppError = require("./AppError");
const ErrorCodes = require("./ErrorCodes");

class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404, ErrorCodes.NOT_FOUND_ERROR);
    }
}

module.exports = NotFoundError;