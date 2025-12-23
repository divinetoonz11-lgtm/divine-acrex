import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { phone, role } = req.body || {};
  if (!phone) return res.status(400).json({ ok: false });

  // role decide
  const finalRole = role === "dealer" ? "dealer" : "user";

  // auto OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  const existing = await users.findOne({ phone });

  if (!existing) {
    // FIRST TIME
    await users.insertOne({
      phone,
      role: finalRole,
      phoneOtp: otp,
      otpExpiresAt,
      phoneVerified: false,      // 🔒 reset here
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    // UPDATE EXISTING (IMPORTANT FIX)
    await users.updateOne(
      { phone },
      {
        $set: {
          role: finalRole,       // 🔥 ROLE UPDATE (dealer/user)
          phoneOtp: otp,
          otpExpiresAt,
          phoneVerified: false,  // 🔒 always false before verify
          updatedAt: new Date(),
        },
      }
    );
  }

  console.log("OTP:", phone, otp);

  return res.json({
    ok: true,
    otp, // local testing
  });
}
