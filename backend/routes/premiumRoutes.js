const premiumController = require("../controllers/premiumController");
const express = require("express");
const router = express.Router();

router.get("/leaderBoard", premiumController.loadLeaderBorad);

module.exports = router;
