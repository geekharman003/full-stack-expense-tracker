const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;
// instantiate the client
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
  email: "harmansadhra2003@gmail.com",
};

// send the mail
const sendEmail = async (email) => {
  const recievers = [
    {
      email,
    },
  ];
  try {
    const res = await tranEmailApi.sendTransacEmail({
      sender,
      to: recievers,
      subject: "this is a password reset email",
      textContent: "you have try to reset the password",
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmail };
