const { Router } = require("express");
const asyncHandler = require("../Middlewares/asyncHandler");
const { beneficiaryController } = require("../../../container");

const router = Router();

router.post("/", asyncHandler((req, res) => beneficiaryController.create(req, res)));

module.exports = router;