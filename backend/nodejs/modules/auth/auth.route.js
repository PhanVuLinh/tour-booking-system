const router = require("express").Router();

const authController = require("./auth.controller");
const authValidate = require("./auth.validate");

router.post(
  "/register",
  authValidate.validateRegister,
  authController.register,
);

router.post("/login", authValidate.validateLogin, authController.login);

module.exports = router;
