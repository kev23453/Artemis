const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db.config");

const UserModel = sequelize.define('User', {
    id: { type: DataTypes.STRING, primaryKey: true },
    firstName: { type: DataTypes.STRING(60), allowNull: false },
    lastName: { type: DataTypes.STRING(80), allowNull: false },
    username: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    normalizedUsername: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    identityNumber: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    emailConfirmed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    password: { type: DataTypes.STRING(200), allowNull: false },
    numberPhone: { type: DataTypes.STRING(20) },
    roleId: { type: DataTypes.STRING }
}, {
    tableName: "user", 
    timestamps: true
})

module.exports = UserModel;