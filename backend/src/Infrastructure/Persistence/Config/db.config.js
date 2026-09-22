const config = require("../../Config/config");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    config.database.database,
    config.database.user,
    config.database.password,
    {
        host: config.database.host,
        dialect: "mysql",
        logging: false,

        pool: {
            max: 10,        // Número máximo de conexiones simultáneas en el pool
            min: 0,         // Número mínimo de conexiones activas en el pool
            acquire: 30000, // Tiempo máximo (en ms) que el pool intentará conectar antes de lanzar un error
            idle: 10000 
        }
    }
)

module.exports = sequelize;