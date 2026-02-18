const premiumController = require("../controllers/premiumController");
const authentication = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get(
  "/checkPremium",
  authentication.authenticateUser,
  premiumController.checkPremium,
);

router.get(
  "/leaderBoard",
  authentication.authenticateUser,
  premiumController.loadLeaderBorad,
);

router.get(
  "/downloadExpense",
  authentication.authenticateUser,
  premiumController.downloadExpenses,
);

router.get(
  "/downloadedExpenses",
  authentication.authenticateUser,
  premiumController.getDownloadedExpenses,
);

module.exports = router;
