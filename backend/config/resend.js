const { Resend } = require("resend");

const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_xxxxxxxxx";
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

const resend = new Resend(RESEND_API_KEY);

const sendEmail = async ({ to, subject, html, text }) => {
  return resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to,
    subject,
    html,
    text,
  });
};

module.exports = {
  sendEmail,
};
