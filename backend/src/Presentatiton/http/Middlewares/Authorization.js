const { ROLE_PERMISSIONS } = require("../../../Application/Auth/Authorization/roles_permissions");

const authorize = (requiredPermission) => {
    return (req, res, next) => {
        if(!req.user) {
            return res.status(401).json({
                message: "Authentication is required"
            })
        }

        const userRole = req.user.role;
        const permission = ROLE_PERMISSIONS[userRole];

        if(!permission) {
            return res.status(403).json({
                message: "Role not authorized"
            })
        }

        const hasPermission = permission.includes(requiredPermission);
        if(!hasPermission) {
            return res.status(403).json({
                message: "Insuficient permissions"
            })
        }

        next();
    }
}

module.exports = authorize;