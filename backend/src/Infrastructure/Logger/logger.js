const winston = require("winston");
const Winston_dayli_rotate_file = require("winston-daily-rotate-file");
const config = require("../Config/config");

// 1. Definimos que niveles queremos ver dependiendo del entorno
const level = config.environment === "production" ? "info" : "debug";

// 2. Formato personalizado para la consola (desarrollo)
const consoleFormat = winston.format.combine(
    winston.format.colorize(), // agregar color segun nivel
    winston.format.timestamp( {format: "YYYY-MM-DD HH:mm:ss"}), // formato de la fecha
    winston.format.printf( ({ timestamp, level, message, ...meta }) => { // formato del mensaje
        return `[${timestamp}] ${level}: ${message} ${
            Object.keys(meta).length ? JSON.stringify(message, null, 2) : ''
        }`;
    })
)

const fileTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE.log%', // Guarda en la carpeta logs
    datePattern: "YYYY-MM-DD",
    zippedArchive: true, // comprime los logs viejos en formato .zip
    maxSize: '20m', // tamaño maximo por archivo antes de rotar
    maxFiles: '2d', // conserva los logs de los ultimos 15 dias
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // obligatorio para archivos profesionales en produccion
    )
})



// instancia de logger

const logger = winston.createLogger({
    level: level,
    transports: [
        // siempre imprimir por consola
        new winston.transports.Console({
            format: consoleFormat
        }),
        fileTransport
    ]
})

module.exports = logger;
