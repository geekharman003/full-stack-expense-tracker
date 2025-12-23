const cashfreeService = require("../services/cashfreeService");
const Payments = require("../models/paymentModel");

const processPayment = async (req, res) => {
  const orderId = "order_" + Date.now();
  const orderAmount = 2000;
  const orderCurrency = "INR";
  const customerId = "1";
  const customerPhone = "9999999999";

  try {
    // try tp create order in cashfree
    const paymentSessionId = await cashfreeService.createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerId,
      customerPhone
    );

    console.log(paymentSessionId);

    // save the payment info in the database
    await Payments.create({
      orderId,
      paymentSessionId,
      orderAmount,
      orderCurrency,
      paymentStatus: "Pending",
    });

    res.status(200).json({ paymentSessionId, orderId });
  } catch (error) {
    console.error("Error creating order:", error.message);
  }
};

const fetchPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderStatus = await cashfreeService.getPaymentStatus(orderId);

    Payments.update(
      {
        paymentStatus: orderStatus,
      },
      {
        where: {
          orderId,
        },
      }
    );

    res.status(200).json({ orderStatus });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { processPayment, fetchPaymentStatus };
