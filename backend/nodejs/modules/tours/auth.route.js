const router = require("express").Router();

const tourController = require("./tour.controller");

router.get("/list", tourController.tourList);

module.exports = router;
