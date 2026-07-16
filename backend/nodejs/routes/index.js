const router = require("express").Router();

const authRoutes = require("../modules/auth/auth.route");
const homeRoutes = require("../modules/home/home.route");
const tourRoutes = require("../modules/tours/tour.route");
const categoryRoutes = require("../modules/categories/category.route");
const contactRoutes = require("../modules/contacts/contact.route");
const bookingRoutes = require("../modules/bookings/booking.route");
const couponRoutes = require("../modules/coupons/coupon.route");
const blogRoutes = require("../modules/blogs/blog.route");
const userRoutes = require("../modules/users/user.route");

router.use("/auth", authRoutes);

router.use("/", authRoutes);

router.use("/home", homeRoutes);

router.use("/tours", tourRoutes);

router.use("/categories", categoryRoutes);

router.use("/contacts", contactRoutes);

router.use("/booking", bookingRoutes);

router.use("/coupons", couponRoutes);

router.use("/blog", blogRoutes);

router.use("/user", userRoutes);

module.exports = router;
