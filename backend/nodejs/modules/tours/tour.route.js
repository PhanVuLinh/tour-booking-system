const router = require("express").Router();

const tourController = require("./tour.controller");

router.get("/detail/:slug", tourController.getTourDetail);

router.get("/suggestions", tourController.getSuggestions);

router.get("/search", tourController.searchTours);

module.exports = router;
