const router = require("express").Router();

const tourController = require("./tour.controller");

router.get("/detail/:slug", tourController.getTourDetail);

module.exports = router;
