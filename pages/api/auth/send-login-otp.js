import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.upsert({
      where: { email },
      update: {
        emailOtp: otp,
        emailOtpExpiry: expiry,
      },
      create: {
        email,
        emailOtp: otp,
        emailOtpExpiry: expiry,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your Divine Acrex Login OTP",
      text: `Your OTP is ${otp}. Valid for 10 minutes.`,
      html: `<h2>${otp}</h2><p>OTP valid for 10 minutes</p>`,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return res.status(500).json({ error: "OTP send failed" });
  }
}
