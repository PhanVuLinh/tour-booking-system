const express = require("express");
const router = express.Router();
const contactController = require("./contact.controller");
const contactValidate = require("./contact.validate");

router.post(
  "/create",
  contactValidate.contactPost,
  contactController.createContact,
);

module.exports = router;
