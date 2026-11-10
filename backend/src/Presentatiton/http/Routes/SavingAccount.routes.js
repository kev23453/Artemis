const { Router } = require("express");
const asyncHandler = require("../Middlewares/asyncHandler");
const { savingAccountController } = require("../../../container");
const router = Router();

router.post("/", asyncHandler((req, res) => savingAccountController.create(req, res)));

module.exports = router;