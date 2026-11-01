const userModel = require("./User.model");
const roleModel = require("./Role.model");
const refreshTokenModel = require("./RefreshToken.model");
const BeneficiariesModel = require("./Beneficiaries.model");

roleModel.hasMany(userModel, { foreignKey: "roleId", as: "user" })
userModel.belongsTo(roleModel, { foreignKey: "roleId", as: "role" })

userModel.hasMany(refreshTokenModel, { foreignKey: "userId", as: "refreshTokens", onDelete: "CASCADE" });
refreshTokenModel.belongsTo(userModel, { foreignKey: "userId", as: "user" });

userModel.belongsTo(BeneficiariesModel, { foreignKey: "userId", as: "beneficiaries" } );
BeneficiariesModel.hasMany(userModel, { foreignKey: "userId", as: "user" });

module.exports = {
    userModel,
    roleModel,
    refreshTokenModel,
    BeneficiariesModel
}