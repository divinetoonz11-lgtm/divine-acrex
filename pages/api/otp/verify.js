import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { phone, otp } = req.body || {};
  if (!phone || !otp) return res.status(400).json({ ok: false });

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  // STRICT MATCH (string-safe)
  const user = await users.findOne({
    phone: String(phone),
    phoneOtp: String(otp),
    otpExpiresAt: { $gt: new Date() },
  });

  if (!user) {
    return res.status(401).json({ ok: false });
  }

  // MARK VERIFIED + CLEAR OTP
  await users.updateOne(
    { _id: user._id },
    {
      $set: {
        phoneVerified: true,
        updatedAt: new Date(),
      },
      $unset: {
        phoneOtp: "",
        otpExpiresAt: "",
      },
    }
  );

  return res.json({ ok: true });
}
