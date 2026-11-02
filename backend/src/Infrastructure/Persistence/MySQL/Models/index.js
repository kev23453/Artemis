const userModel = require("./User.model");
const roleModel = require("./Role.model");
const refreshTokenModel = require("./RefreshToken.model");
const BeneficiariesModel = require("./Beneficiaries.model");
const SavingsAccount = require("./Savings_account.model");

roleModel.hasMany(userModel, { foreignKey: "roleId", as: "user" })
userModel.belongsTo(roleModel, { foreignKey: "roleId", as: "role" })

userModel.hasMany(refreshTokenModel, { foreignKey: "userId", as: "refreshTokens", onDelete: "CASCADE" });
refreshTokenModel.belongsTo(userModel, { foreignKey: "userId", as: "user" });

userModel.belongsTo(BeneficiariesModel, { foreignKey: "userId", as: "beneficiaries" } );
BeneficiariesModel.hasMany(userModel, { foreignKey: "userId", as: "user" });

userModel.hasMany(SavingsAccount, { foreignKey: "userId", as: "savingsAccounts" });
SavingsAccount.belongsTo(userModel, { foreignKey: "userId", as: "user" });

userModel.hasMany(SavingsAccount, { foreignKey: "adminId", as: "adminSavingsAccounts" });
SavingsAccount.belongsTo(userModel, { foreignKey: "adminId", as: "admin" });

module.exports = {
    userModel,
    roleModel,
    refreshTokenModel,
    BeneficiariesModel,
    SavingsAccount
}