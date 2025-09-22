const { resendClient, sender } = require("../lib/resend");
const createWelcomeEmailTemplate = require("./emailTemplates");
module.exports = async function sendWelcomeEmail(email, name, clientURL) {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "welcome to electron!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });
  if (error) {
    console.error("error sending welcome email:", error);
    throw new Error("failed to send welcome email");
  }

  console.log("welcome email sent successfully", data);
};
