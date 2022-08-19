const express = require("express");
var router = express.Router();

const controller = require("../controllers/signupController");

router.get("/", controller.get);
router.post("/", controller.post);

module.exports = router;