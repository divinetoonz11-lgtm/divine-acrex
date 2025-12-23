// pages/api/otp.js
// ORIGINAL SIMPLE OTP – LOGIN RESTORE

let otpStore = {};

export default function handler(req, res) {
  const { phone, otp } = req.body || {};

  // SEND OTP
  if (req.method === "POST" && phone && !otp) {
    const newOtp = String(Math.floor(100000 + Math.random() * 900000));
    otpStore[phone] = newOtp;

    console.log("OTP:", phone, newOtp);

    return res.json({
      ok: true,
      otp: newOtp, // local only
    });
  }

  // VERIFY OTP
  if (req.method === "POST" && phone && otp) {
    if (otpStore[phone] !== String(otp)) {
      return res.status(401).json({ ok: false });
    }

    delete otpStore[phone];

    return res.json({
      ok: true,
    });
  }

  return res.status(400).json({ ok: false });
}
