import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { phone, role } = req.body;

  if (!phone || phone.length !== 10)
    return res.status(400).json({ ok: false });

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  let user = await users.findOne({ phone });

  // 🔒 ROLE LOCK
  if (!user) {
    await users.insertOne({
      phone,
      role,                 // user | dealer (FIRST TIME)
      phoneVerified: false,
      phoneOtp: "123456",
      createdAt: new Date(),
    });
  }

  if (user && user.role !== role) {
    return res.status(403).json({
      ok: false,
      message: "Role already fixed",
    });
  }

  await users.updateOne(
    { phone },
    { $set: { phoneOtp: "123456" } }
  );

  console.log("DUMMY OTP:", phone, "123456");

  res.json({ ok: true });
}
