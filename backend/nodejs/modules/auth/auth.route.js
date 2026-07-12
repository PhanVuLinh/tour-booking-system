const router = require("express").Router();

const authController = require("./auth.controller");
const authValidate = require("./auth.validate");

router.post(
  "/register",
  authValidate.validateRegister,
  authController.register,
);

module.exports = router;
