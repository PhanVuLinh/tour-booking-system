const router = require("express").Router();

const homeController = require("./home.controller");

router.get("/flash-sales", homeController.getTourFlashSales);

module.exports = router;
