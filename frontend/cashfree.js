const cashfree = Cashfree({
  mode: "sandbox",
});

document
  .getElementById("buy-premium-btn")
  .addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("http://localhost:3000/", {
        headers: { authorization: token },
      });

      const { isPremium } = res.data.decoded;

      if (!isPremium) {
        const response = await axios.post(
          "http://localhost:3000/pay",
          {},
          {
            headers: { Authorization: token },
          },
        );
        const { paymentSessionId, orderId } = response.data;

        let checkoutOptions = {
          paymentSessionId,
          redirectTarget: "_modal",
        };

        const result = await cashfree.checkout(checkoutOptions);
        if (result.error) {
          console.log(
            "User has closed the popup or there is some payment error, Check for Payment Status",
          );

          console.log(result.error);
        }

        if (result.redirect) {
          console.log("Payment will be redirected");
        }

        if (result.paymentDetails) {
          console.log("Payment has been completed, Check for Payment Status");
          console.log(result.paymentDetails.paymentMessage);

          const token = localStorage.getItem("token");
          const response = await axios.get(
            `http://localhost:3000/payment-status/${orderId}`,
            { headers: { Authorization: token } },
          );
          const { orderStatus } = response.data;

          if (orderStatus === "Success") {
            alert("Transaction is successful");
          } else if (orderStatus === "Pending") {
            alert("Transaction is Pending");
          } else {
            alert("Transaction is Failed");
          }
        }
      }
      else{
        console.log("you already a premium user")
      }
    } catch (error) {
      console.error(error);
    }
  });
