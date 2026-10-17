const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../../../.env")});

const required = (name) => {
    if(!process.env[name]) {
        throw new Error(`Enviromment variable ${name} is missing`);
    }
    return process.env[name];
}

const config = {
    api_version: process.env.API_VERSION,
    environment: process.env.ENVIRONMENT || "development",
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
            secret: required('JWT_SECRET'),
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES
        },
        refreshToken: {
            ttlMs: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7) * 24 * 60 * 60 * 1000,
        },
    },
    adminDefault: {
        username: "admin",
        email: process.env.DEFAULT_ADMIN_EMIAL,
        password: process.env.DEFAULT_ADMIN_PASSWORD
    }
}

module.exports = config;