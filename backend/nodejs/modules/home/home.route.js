const router = require("express").Router();

const homeController = require("./home.controller");

router.get("/flash-sales", homeController.getTourFlashSales);

router.get("/domestic-tours", homeController.getTourDomesticTours);

router.get("/foreign-tours", homeController.getTourForeignTours);

module.exports = router;
