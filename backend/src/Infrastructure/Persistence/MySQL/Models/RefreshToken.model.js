const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db.config");

const RefreshToken = sequelize.define('refreshToken', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.STRING, allowNull: false },
    tokenHash: { type: DataTypes.CHAR(64), allowNull: false, unique: true },
    familyId: { type: DataTypes.UUID, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    revokedAt: { type: DataTypes.DATE, allowNull: true },
    replacedByHash: { type: DataTypes.CHAR(64), allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: new Date() }
}, {
    tableName: 'refreshtoken',
    timestamps: true,
    updatedAt: false,
    indexes: [
        { fields: ['familyId'] },
        { fields: ['userId'] },
        { fields: ['expiresAt'] }
    ]
});

module.exports = RefreshToken;