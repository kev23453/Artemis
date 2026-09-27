const express = require("express");
const router = express.Router();
const asyncHandler = require("../Middlewares/asyncHandler");
const { userController } = require("../../../container");

router.post("/", asyncHandler((req, res) => userController.create(req, res)))

module.exports = router;