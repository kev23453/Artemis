const logger = require("../../../Infrastructure/Logger/logger");

const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    const response = {
        success: false,
        error: {
            code: err.code || "INTERNAL SERVER ERROR",
            message: statusCode !== 500 ? err.message : 'unexpected error ocurred'
        }
    }

    if(err.details) {
        response.error.details = err.details;
    }

    logger.error(err.stack || err.message, {
        method: req.method,
        url: req.originalUrl,
        statusCode,
        code: response.error.code
    });

    res.status(statusCode).json(response);

}

module.exports = errorHandler;