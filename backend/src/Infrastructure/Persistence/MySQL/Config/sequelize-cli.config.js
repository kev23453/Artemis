const config = require("../../../Config/config");

const shared = {
    username: config.database.user,
    password: config.database.password,
    database: config.database.database,
    host: config.database.host,
    port: config.database.port,
    dialect: "mysql"
};

module.exports = {
    development: shared,
    test: shared,
    production: shared
}