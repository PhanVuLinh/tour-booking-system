const router = require("express").Router();

const authController = require("./auth.controller");
const authValidate = require("./auth.validate");
const { requireAuth } = require("../../middlewares/auth.middleware");

router.post(
  "/register",
  authValidate.validateRegister,
  authController.register,
);

router.post("/login", authValidate.validateLogin, authController.login);

router.post("/login/google", authController.loginGoogle);

router.post("/login/facebook", authController.loginFacebook);

router.post("/logout", authController.logout);

router.get("/me", requireAuth, authController.getMe);

module.exports = router;
