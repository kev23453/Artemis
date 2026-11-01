const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db.config");

const Beneficiaries = sequelize.define('Beneficiaries', {
    id: { type: DataTypes.STRING, primaryKey: true },
    firstName: { type: DataTypes.STRING(80), allowNull: false },
    lastName: { type: DataTypes.STRING(100), allowNull: false },
    accountNumber: { type: DataTypes.STRING(9), allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
    updatedAt: { type: DataTypes.DATE },
    userId: { type: DataTypes.STRING, allowNull: false }
})

module.exports = Beneficiaries;