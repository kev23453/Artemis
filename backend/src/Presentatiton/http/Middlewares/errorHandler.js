const config = require("../../../Infrastructure/Config/config");

const errorHandler = (req, res, next, err) => {
    
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

    if(config.environment !== "production") {
        response.error.stack = err.stack;
    }

    console.log(err) // cambiar por logger 

    res.status(statusCode).json(response);

}

module.exports = errorHandler;