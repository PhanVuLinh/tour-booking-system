const express = require("express");
const router = express.Router();
const blogController = require("./blog.controller");

router.get("/list", blogController.getBlogList);

router.get("/detail/:slug", blogController.blogDetail);

module.exports = router;
