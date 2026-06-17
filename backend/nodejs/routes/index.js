const router = require("express").Router();

const authRoutes = require("../modules/auth/auth.route");
const tourRoutes = require("../modules/tours/auth.route");

// router.use("/auth", authRoutes);
router.use("/", authRoutes);

router.use("/tours", tourRoutes);

module.exports = router;
