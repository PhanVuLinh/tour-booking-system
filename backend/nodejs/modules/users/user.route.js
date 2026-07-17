const router = require("express").Router();

const userController = require("./user.controller");

const userValidate = require("./user.validate");

const { requireAuth } = require("../../middlewares/auth.middleware");

router.use(requireAuth);

router.get("/profile/info", userController.getProfile);

router.put(
  "/profile/info",
  userValidate.updateProfile,
  userController.updateProfile,
);

router.put(
  "/profile/change-password",
  userValidate.changePassword,
  userController.changePassword,
);

module.exports = router;
