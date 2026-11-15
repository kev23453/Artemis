const { Router } = require("express");
const router = Router();
const asyncHandler = require("../Middlewares/asyncHandler");
const { cardController } = require("../../../container");

router.post("/", asyncHandler((req, res) => cardController.save(req, res)));

module.exports = router;