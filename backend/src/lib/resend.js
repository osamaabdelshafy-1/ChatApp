const Resend = require("resend").Resend;
require("dotenv/config"); // to use the fields in the .env

//create an instance form Resend class that call the API to get the services of resend platform
const resendClient = new Resend(process.env.RESEND_API_KEY);

//data about how sending the email.
const sender = {
  email: process.env.EMAIL_FROM,
  name: process.env.EMAIL_FROM_NAME,
};

module.exports = {
  resendClient,
  sender,
};
