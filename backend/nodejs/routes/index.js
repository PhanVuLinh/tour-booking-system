const router = require("express").Router();

const authRoutes = require("../modules/auth/auth.route");
const tourRoutes = require("../modules/tours/auth.route");
const categoryRoutes = require("../modules/categories/category.route");

// router.use("/auth", authRoutes);
router.use("/", authRoutes);

router.use("/tours", tourRoutes);

router.use("/categories", categoryRoutes);

module.exports = router;
