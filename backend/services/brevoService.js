const Sib = require("sib-api-v3-sdk");
const client = Sib.ApiClient.instance;

// instantiate the client
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

// creates a transactional api instance
const tranEmailApi = new Sib.TransactionalEmailsApi();

// specify the sender
const sender = {
  email: "harman163003@gmail.com",
};

// send the mail
const sendEmail = async (email, uuid, resetUrl) => {
  const recievers = [
    {
      email: email,
    },
  ];
  try {
    await tranEmailApi.sendTransacEmail({
      sender,
      to: recievers,
      subject: "Password Reset Email",
      textContent: `reset password url:{{params.resetUrl}}/{{params.uuid}} `,
      params: {
        uuid,
        resetUrl,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = { sendEmail };
