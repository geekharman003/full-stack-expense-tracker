const premiumController = require("../controllers/premiumController");
const authentication = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get(
  "/leaderBoard",
  authentication.authenticateUser,
  premiumController.loadLeaderBorad
);

module.exports = router;
