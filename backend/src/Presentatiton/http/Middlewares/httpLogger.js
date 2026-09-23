const morgan = require("morgan");
const logger = require("../../../Infrastructure/Logger/logger"); // la ruta donde creaste tu logger
const config = require("../../../Infrastructure/Config/config");

// Sobreescrimos el metodo de escritura por defecto de morgan
const stream = {
    // Morgan envia los mensajes como un string que termina con un salto de linea (/n)
    write: (message) => {
        // usamos .trim para limpiar el salto de linea extra
        // y lo enviamos al nivel 'http' de Wiston
        logger.http(message.trim())
    }
};

const morganFormat = config.environment === "production"
? 'combined'
: ':method :url :status + :response-time ms'; 


const morganMiddleware = morgan(
    morganFormat,
    { stream }
);

module.exports = morganMiddleware;