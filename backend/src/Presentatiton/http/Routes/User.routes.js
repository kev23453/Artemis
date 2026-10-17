const express = require("express");
const router = express.Router();
const asyncHandler = require("../Middlewares/asyncHandler");
const authorization = require("../Middlewares/Authorization");
const { PERMISSIONS } = require("../../../Application/Auth/Authorization/roles_permissions");
const { userController } = require("../../../container");

router.post("/", authorization(PERMISSIONS.CREATE_USERS), asyncHandler((req, res) => userController.create(req, res)))

module.exports = router;