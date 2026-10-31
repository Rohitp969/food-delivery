const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const APP_NAME = process.env.BREVO_SENDER_NAME || "GoFood";
const FRONTEND_URL = (
  process.env.FRONTEND_URL || "https://food-delivery-rho-rosy.vercel.app"
).replace(/\/$/, "");

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Sends a transactional email through Brevo's HTTP API
const sendEmail = async ({ to, name, subject, html, text }) => {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_VERIFIED_SENDER) {
    throw new Error("BREVO_API_KEY or BREVO_VERIFIED_SENDER is missing in .env");
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: APP_NAME, email: process.env.BREVO_VERIFIED_SENDER },
      to: [name ? { email: to, name } : { email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo email failed (${response.status}): ${details}`);
  }

  return response.json();
};

const layout = (content) => `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#fce7f3;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fce7f3;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#db2777;padding:20px 24px;color:#ffffff;font-size:22px;font-weight:bold;">
                &#127828; ${APP_NAME}
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px;color:#111827;font-size:15px;line-height:1.6;">
                ${content}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:#f9fafb;color:#6b7280;font-size:12px;text-align:center;line-height:1.5;">
                You received this email because of activity on your ${APP_NAME} account.<br />
                <a href="${FRONTEND_URL}" style="color:#db2777;text-decoration:none;">${FRONTEND_URL.replace(/^https?:\/\//, "")}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const button = (href, label) =>
  `<a href="${href}" style="display:inline-block;background:#db2777;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:12px;">${label}</a>`;

const OTP_COPY = {
  verify: {
    subject: (otp) => `${otp} is your ${APP_NAME} verification code`,
    heading: "Verify your email",
    intro: `Thanks for signing up with ${APP_NAME}! Use the code below to verify your email address.`,
  },
  reset: {
    subject: (otp) => `${otp} is your ${APP_NAME} password reset code`,
    heading: "Reset your password",
    intro: "We received a request to reset your password. Use the code below to set a new one.",
  },
};

const sendOtpEmail = ({ to, name, otp, purpose, expiresInMinutes }) => {
  const copy = OTP_COPY[purpose];
  const safeName = escapeHtml(name || "there");

  const html = layout(`
    <h2 style="margin:0 0 12px;font-size:20px;">${copy.heading}</h2>
    <p style="margin:0 0 16px;">Hi ${safeName},</p>
    <p style="margin:0 0 20px;">${copy.intro}</p>
    <div style="margin:0 0 20px;padding:16px;background:#fdf2f8;border:1px dashed #db2777;border-radius:12px;text-align:center;font-size:32px;font-weight:bold;letter-spacing:8px;color:#be185d;">
      ${otp}
    </div>
    <p style="margin:0 0 8px;">This code expires in <strong>${expiresInMinutes} minutes</strong>.</p>
    <p style="margin:0;color:#6b7280;font-size:13px;">Never share this code with anyone. If you didn't request it, you can safely ignore this email.</p>
  `);

  const text = `Hi ${name || "there"},\n\n${copy.intro}\n\nYour code: ${otp}\n\nThis code expires in ${expiresInMinutes} minutes. If you didn't request it, ignore this email.\n\n- ${APP_NAME}`;

  return sendEmail({ to, name, subject: copy.subject(otp), html, text });
};

const sendWelcomeEmail = ({ to, name }) => {
  const safeName = escapeHtml(name || "there");

  const html = layout(`
    <h2 style="margin:0 0 12px;font-size:20px;">Welcome to ${APP_NAME}, ${safeName}! &#127881;</h2>
    <p style="margin:0 0 20px;">Your email is verified and your account is ready. Hungry? Your favourite food is just a few taps away.</p>
    <p style="margin:0;">${button(FRONTEND_URL, "Order now")}</p>
  `);

  const text = `Welcome to ${APP_NAME}, ${name || "there"}!\n\nYour email is verified and your account is ready.\nOrder now: ${FRONTEND_URL}\n\n- ${APP_NAME}`;

  return sendEmail({ to, name, subject: `Welcome to ${APP_NAME}! 🎉`, html, text });
};

const sendPasswordChangedEmail = ({ to, name }) => {
  const safeName = escapeHtml(name || "there");

  const html = layout(`
    <h2 style="margin:0 0 12px;font-size:20px;">Your password was changed</h2>
    <p style="margin:0 0 16px;">Hi ${safeName},</p>
    <p style="margin:0 0 20px;">The password for your ${APP_NAME} account was just reset. You can now log in with your new password.</p>
    <p style="margin:0 0 20px;">${button(FRONTEND_URL + "/login", "Log in")}</p>
    <p style="margin:0;color:#6b7280;font-size:13px;">If you didn't do this, reset your password immediately using "Forgot Password?" on the login page.</p>
  `);

  const text = `Hi ${name || "there"},\n\nThe password for your ${APP_NAME} account was just reset. If you didn't do this, use "Forgot Password?" on the login page right away: ${FRONTEND_URL}/login\n\n- ${APP_NAME}`;

  return sendEmail({ to, name, subject: `Your ${APP_NAME} password was changed`, html, text });
};

module.exports = {
  sendEmail,
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
};
