const router = require("express").Router();

const authRoutes = require("../modules/auth/auth.route");
const homeRoutes = require("../modules/home/home.route");
const tourRoutes = require("../modules/tours/tour.route");
const categoryRoutes = require("../modules/categories/category.route");
const contactRoutes = require("../modules/contacts/contact.route");

// router.use("/auth", authRoutes);
router.use("/", authRoutes);

router.use("/home", homeRoutes);

router.use("/tours", tourRoutes);

router.use("/categories", categoryRoutes);

router.use("/contacts", contactRoutes);

module.exports = router;
