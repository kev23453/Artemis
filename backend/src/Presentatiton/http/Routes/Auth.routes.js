const { Router } = require("express");
const { authController } = require("../../../container");
const asyncHandler = require("../Middlewares/asyncHandler");
const authorization = require("../Middlewares/Authorization");
const { PERMISSIONS } = require("../../../Application/Auth/Authorization/roles_permissions");


const router = Router();

router.post("/login", 
    asyncHandler((req, res, next) => authController.login(req, res, next))    
);
router.post("/refresh", 
    asyncHandler((req, res, next) => authController.refresh(req, res, next))
);
router.post("/logout", 
    asyncHandler((req, res, next) => authController.logout(req, res, next))
);

module.exports = router;