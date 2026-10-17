const userModel = require("./User.model");
const roleModel = require("./Role.model");
const refreshTokenModel = require("./RefreshToken.model");

userModel.belongsTo(roleModel, { foreignKey: "roleId", as: "role" })
roleModel.hasMany(userModel, { foreignKey: "roleId", as: "user" })

userModel.hasMany(refreshTokenModel, { foreignKey: "userId", as: "refreshTokens", onDelete: "CASCADE" });
refreshTokenModel.belongsTo(userModel, { foreignKey: "userId", as: "user" });

module.exports = {
    userModel,
    roleModel,
    refreshTokenModel
}