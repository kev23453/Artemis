const userModel = require("./User.model");
const roleModel = require("./Role.model");

userModel.belongsTo(roleModel, { foreignKey: "roleId", as: "role" })
roleModel.hasMany(userModel, { foreignKey: "roleId", as: "user" })

module.exports = {
    userModel,
    roleModel
}