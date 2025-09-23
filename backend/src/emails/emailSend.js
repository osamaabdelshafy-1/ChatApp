const nodemailer = require("nodemailer");
const  createWelcomeEmailTemplate = require("./emailTemplates");

async function sendMail(name , email , clientURL) {
  try {
    // 1. Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // SSL
      secure: true,
      auth: {
        user: "osamaabdelshafy7@gmail.com",
        pass:process.env.APP_PASSKEY, // <-- App Password, not Gmail password
      },
    });

    // 2. Send mail
    let info = await transporter.sendMail({
      from: "osamaabdelshafy7@gmail.com",
      to: email, // sending to yourself for test
      subject: "welcome to electron ChatApp",
      text: "Hello from SMTP!",
      html:createWelcomeEmailTemplate(name , clientURL), // use your HTML template
    });

    console.log("✅ Message sent: %s", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

module.exports = sendMail
