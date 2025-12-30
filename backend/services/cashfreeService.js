const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

const createOrder = async (
  orderId,
  orderAmount,
  orderCurrency = "IND",
  customerId,
  customerPhone
) => {
  try {
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
    const formattedExpiryDate = expiryDate.toISOString();

    const request = {
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: orderCurrency,
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
      },
      order_meta: {
        // return_url: `http://localhost:3000/payment-status/${orderId}`,
        payment_methods: "cc,dc,upi",
      },
      order_expiry_time: formattedExpiryDate,
    };

    const response = await cashfree.PGCreateOrder(request);
    return response.data.payment_session_id;
  } catch (error) {
    console.error(error.message);
  }
};

const getPaymentStatus = async (orderId) => {
  try {
    const response = await cashfree.PGOrderFetchPayments(orderId);
    const getOrderResponse = response.data;
    let orderStatus;
    if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "SUCCESS"
      ).length > 0
    ) {
      orderStatus = "Success";
    } else if (
      getOrderResponse.filter(
        (transaction) => transaction.payment_status === "PENDING"
      ).length > 0
    ) {
      orderStatus = "Pending";
    } else {
      orderStatus = "Failure";
    }

    return orderStatus;
  } catch (error) {
    console.error("error while fetching the order status", error.message);
  }
};

module.exports = { createOrder, getPaymentStatus };
