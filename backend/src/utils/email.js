// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// module.exports = transporter;

const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

client.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (email,message) =>{
    await tranEmailApi.sendTransacEmail({
    subject: "Your OTP Code",
    sender: {
      name: "WEB RESTO",
      email: "anjad076@gmail.com"
    },
    to: [{ email }],
    htmlContent: message
  });
}

module.exports = sendEmail ;

