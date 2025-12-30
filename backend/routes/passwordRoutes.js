const passwordController = require("../controllers/passwordController");
const authentication = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post(
  "/forgotpassword",
  // authentication.authenticateUser,
  passwordController.generateResetUrl
);
router.get("/forgotpassword/:uuid", passwordController.validateResetUrl);
router.post("/resetpassword", passwordController.resetPassword);

module.exports = router;
