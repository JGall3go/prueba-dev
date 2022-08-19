const express = require("express");
var router = express.Router();

const controller = require("../controllers/sessionController");

router.post("/", controller.post);

module.exports = router;