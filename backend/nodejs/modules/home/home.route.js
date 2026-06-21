const router = require("express").Router();

const homeController = require("./home.controller");

router.get("/flash-sales", homeController.getTourFlashSales);

router.get("/domestic-tours", homeController.getTourDomestic);

router.get("/foreign-tours", homeController.getTourForeign);

router.get("/blogs", homeController.getBlog);

module.exports = router;
