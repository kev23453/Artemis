const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../../../.env")});

const config = {
    environment: process.env.ENVIRONMENT,
    server: { port: Number(process.env.PORT) || 7500 },
    persistence: { type: process.env.PERSISTENCE || "in-memory" },
    database: {
        host:  process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    },
    cache: {
        host: process.env.CACHE_HOST || "localhost",
        port: Number(process.env.CACHE_PORT) || 6379
    },
    email: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        from: process.env.SMTP_FROM,
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASS
    },
    auth: {
        jwt: {
            secret: "",
            expiresIn: process.env.JWT_EXPIRES
        }
    }
}

module.exports = config;