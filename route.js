const express = require("express");
const router = express.Router();
const controller = require("./contractController");

router.post("/contract", controller.deployContract);

module.exports = router;
