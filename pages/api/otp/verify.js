import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { phone, otp } = req.body;

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  const user = await users.findOne({ phone });

  if (!user || user.phoneOtp !== otp)
    return res.status(401).json({ ok: false });

  await users.updateOne(
    { phone },
    {
      $set: {
        phoneVerified: true,
        phoneOtp: null,
        updatedAt: new Date(),
      },
    }
  );

  res.json({
    ok: true,
    role: user.role, // 🔒 SAME ROLE ALWAYS
  });
}
