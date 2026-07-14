const router = require("express").Router();

const authController = require("./auth.controller");
const authValidate = require("./auth.validate");

router.post(
  "/register",
  authValidate.validateRegister,
  authController.register,
);

router.post("/login", authValidate.validateLogin, authController.login);

router.post("/login/google", authController.loginGoogle);

module.exports = router;
