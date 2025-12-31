const Sib = require("sib-api-v3-sdk");
const client = Sib.ApiClient.instance;
// instantiate the client
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

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
    const res = await tranEmailApi.sendTransacEmail({
      sender,
      to: recievers,
      subject: "Password Reset Email",
      textContent: `reset url:{{params.resetUrl}}/{{params.uuid}} `,
      params: {
        uuid,
        resetUrl,
      },
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmail };
