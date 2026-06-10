const router = require("express").Router();

const authRoutes = require("../modules/auth/auth.route");

// router.use("/auth", authRoutes);
router.use("/", authRoutes);

module.exports = router;
