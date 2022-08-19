const express = require("express");
var router = express.Router();

const controller = require("../controllers/productController");

router.get("/", controller.get);

router.post("/create", controller.create);

module.exports = router;