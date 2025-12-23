const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentContoller");

router.post("/pay", paymentController.processPayment);
router.get("/payment-status/:orderId", paymentController.fetchPaymentStatus);
module.exports = router;
