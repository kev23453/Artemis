const appError = require("../../../Shared/Errors/AppError");
const errorCodes = require("../../../Shared/Errors/ErrorCodes");

class UnauthorizedError extends appError {
    constructor(message = "Unauthorized") {
        super(message, 401, errorCodes.UNAUTHORIZED_ERORR);
    }
}

module.exports = UnauthorizedError;