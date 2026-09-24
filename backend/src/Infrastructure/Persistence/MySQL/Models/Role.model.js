const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db.config");

const RoleModel = sequelize.define('Role', {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    normalizedName: { type: DataTypes.STRING(80), allowNull: false }
})

module.exports = RoleModel;