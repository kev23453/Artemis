const sequelize = require("../Config/db.config");
const { DataTypes } = require("sequelize");

const Savings_account = sequelize.define("savings_account", {
    id: { type: DataTypes.STRING, primaryKey: true },
    accountNumber: { type: DataTypes.STRING, allowNull: false},
    balance: { type: DataTypes.DECIMAL(18, 2), allowNull: null },
    userId: { type: DataTypes.STRING },
    isPrincipal: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
    adminId: { type: DataTypes.STRING }
}, {
    tableName: "savings_account",
    timestamps: false
})

module.exports = Savings_account;
