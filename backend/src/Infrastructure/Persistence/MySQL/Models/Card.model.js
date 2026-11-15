const config = require("../Config/db.config");
const { DataTypes } = require("sequelize");

const Card = config.define("card", {
    id: { type: DataTypes.STRING, primaryKey: true },
    identifierNumber: { type: DataTypes.CHAR(16), allowNull: false, unique: true },
    creditLimit: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    expireDate: { type: DataTypes.STRING, allowNull: false },
    amountDebt: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    cvcCode: { type: DataTypes.STRING, allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    userId: { type: DataTypes.STRING, allowNull: false },
    adminId: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
    updatedAt: { type: DataTypes.DATE, allowNull: true }
}, {
    tableName: "card",
    timestamps: true,   
})

module.exports = Card;