const { Router } = require("express");
const router = Router();
const { loanController } = require("../../../container");
const asyncHandler = require("../Middlewares/asyncHandler");

router.post("/", asyncHandler((req,res) => loanController.save(req, res)));

module.exports = router;