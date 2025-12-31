// pages/api/auth/send-login-otp.js
// FINAL – FULL UPDATED CODE (PRISMA REMOVED, MONGODB ONLY)

import crypto from "crypto";
import nodemailer from "nodemailer";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ ok: false });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      // silent success
      return res.json({ ok: true });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          loginOtp: otpHash,
          loginOtpExpiry: expiry,
        },
      }
    );

    if (!process.env.EMAIL_SERVER || !process.env.EMAIL_FROM) {
      return res.json({ ok: true });
    }

    const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your Divine Acres Login OTP",
      text: `Your OTP is ${otp}. Valid for 10 minutes.`,
      html: `<h2>${otp}</h2><p>OTP valid for 10 minutes</p>`,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({ ok: false });
  }
}
