import nodemailer from "nodemailer";
import crypto from "crypto";

const store = global._emailVerifyStore || new Map();
global._emailVerifyStore = store;

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const token = crypto.randomBytes(24).toString("hex");
  store.set(token, email);

  const verifyLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  try {
    const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your email – DivineAcrex",
      html: `
        <p>Click the link below to verify your email:</p>
        <p><a href="${verifyLink}">Verify Email</a></p>
        <p>This link is valid for 10 minutes.</p>
      `,
    });

    res.json({ ok: true });
  } catch (e) {
    console.error("MAIL ERROR", e);
    res.status(500).json({ error: "Failed to send email" });
  }
}
