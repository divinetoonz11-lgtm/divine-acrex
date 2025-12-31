// pages/api/auth/send-verify-email.js
import nodemailer from "nodemailer";
import crypto from "crypto";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { email, type = "reset" } = req.body || {};
    if (!email) return res.status(400).json({ ok: false });

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      // silent success (security)
      return res.json({ ok: true });
    }

    // create token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    // save token in DB (used by set-username-password.js)
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          setupToken: tokenHash,
          setupTokenExpires: expires,
        },
      }
    );

    if (!process.env.EMAIL_SERVER || !process.env.EMAIL_FROM) {
      return res.json({ ok: true });
    }

    const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

    const link =
      type === "create"
        ? `${process.env.NEXTAUTH_URL}/create-password?token=${rawToken}`
        : `${process.env.NEXTAUTH_URL}/reset-password?token=${rawToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject:
        type === "create"
          ? "Create Username & Password – Divine Acres"
          : "Reset Your Password – Divine Acres",
      html: `
        <p>Click the link below:</p>
        <p><a href="${link}">${link}</a></p>
        <p>This link is valid for 10 minutes.</p>
      `,
    });

    return res.json({ ok: true });
  } catch (e) {
    console.error("SEND VERIFY EMAIL ERROR", e);
    return res.status(500).json({ ok: false });
  }
}
