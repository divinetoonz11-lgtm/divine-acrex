import nodemailer from "nodemailer";

/*
=====================================
 GLOBAL MAILER – DIVINE ACRES
 FROM: divinetoonz11@gmail.com
=====================================
*/

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ================================
 SEND MAIL HELPER
================================ */

export async function sendMail({
  to,
  subject,
  html,
}) {
  try {
    const info = await transporter.sendMail({
      from: `"Divine Acres" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Mail sent:", info.messageId);
    return { ok: true };
  } catch (err) {
    console.error("❌ Mail error:", err);
    return { ok: false, error: err.message };
  }
}

/* ================================
 DEALER APPROVAL MAIL
================================ */

export async function sendDealerApprovalMail({
  to,
  name,
}) {
  return sendMail({
    to,
    subject: "Dealer Application Approved – Divine Acres",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Congratulations ${name || ""} 🎉</h2>

        <p>Your <b>Dealer Application</b> has been <b>approved</b>.</p>

        <p>You can now login from the <b>Dealer</b> tab using:</p>
        <ul>
          <li>Google Login</li>
          <li>OR your Username & Password</li>
        </ul>

        <p>
          👉 <a href="https://divineacres.com" target="_blank">
          Open Divine Acres
          </a>
        </p>

        <br />
        <p>Regards,<br/><b>Divine Acres Team</b></p>
      </div>
    `,
  });
}

/* ================================
 DEALER REJECT MAIL (OPTIONAL)
================================ */

export async function sendDealerRejectMail({
  to,
  name,
}) {
  return sendMail({
    to,
    subject: "Dealer Application Update – Divine Acres",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Hello ${name || ""}</h2>

        <p>
          Your dealer application could not be approved at this time.
        </p>

        <p>
          You may re-apply after updating your details.
        </p>

        <br />
        <p>Regards,<br/><b>Divine Acres Team</b></p>
      </div>
    `,
  });
}
