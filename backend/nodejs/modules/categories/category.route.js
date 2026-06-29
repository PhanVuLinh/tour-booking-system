const router = require("express").Router();

const categoryController = require("./category.controller");

router.get("/", categoryController.getCategories);

router.get("/departure-locations", categoryController.getDepartureLocations);

router.get("/:slug", categoryController.getCategoryBySlug);

module.exports = router;
