const passwordController = require("../controllers/passwordController");
const express = require("express");
const router = express.Router();

router.post("/forgotpassword", passwordController.resetPassword);

module.exports = router;
