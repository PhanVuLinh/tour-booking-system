const router = require("express").Router();

const categoryController = require("./category.controller");

router.get("/", categoryController.getCategories);

module.exports = router;
