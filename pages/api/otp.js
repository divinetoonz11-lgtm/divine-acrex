// pages/api/otp.js

// DEMO MODE or REAL SMS SWITCH
const useDemo = process.env.USE_DEMO !== "0";

// Temporary in-memory OTP store
let otpStore = {};

export default async function handler(req, res) {
  const { method } = req;

  // ================
  // SEND OTP  (POST)
  // ================
  if (method === "POST") {
    const { phone } = req.body || {};

    if (!phone) {
      return res.status(400).json({ ok: false, message: "Phone is required" });
    }

    // -------------------------
    // DEMO MODE → OTP = 123456
    // -------------------------
    if (useDemo) {
      otpStore[phone] = "123456";
      return res.json({ ok: true, message: "OTP sent (demo): 123456" });
    }

    // -------------------------
    // REAL SMS MODE (future)
    // -------------------------
    // Example for MSG91 / Twilio (implementation ready hook)
    // const otp = String(Math.floor(100000 + Math.random() * 900000));
    // otpStore[phone] = otp;
    // await sendRealOtp(phone, otp);
    return res.json({
      ok: true,
      message: "Real SMS sending not set yet — connect msg91/twilio",
    });
  }

  // ==================
  // VERIFY OTP  (PUT)
  // ==================
  if (method === "PUT") {
    const { phone, otp } = req.body || {};

    if (!phone || !otp) {
      return res.status(400).json({ ok: false, message: "Phone & OTP required" });
    }

    const realOtp = otpStore[phone];

    if (!realOtp) {
      return res.status(404).json({ ok: false, message: "OTP not sent" });
    }

    if (realOtp !== otp) {
      return res.status(400).json({ ok: false, message: "Invalid OTP" });
    }

    // Success
    delete otpStore[phone];

    return res.json({
      ok: true,
      message: "OTP verified — login success (demo)"
    });
  }

  // INVALID METHOD
  res.status(405).json({ ok: false, message: "Method not allowed" });
}
