const router = require("express").Router();

const categoryController = require("./category.controller");

router.get("/", categoryController.getCategories);

router.get("/:slug", categoryController.getCategoryBySlug);

module.exports = router;
