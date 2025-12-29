// pages/api/admin/sub-admins/create.js
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";

/*
CREATE SUB ADMIN – MASTER API
✔ Real DB
✔ Secure password hash
✔ Role locked
✔ Enterprise safe
*/

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, message: "Missing fields" });
    }

    const client = await clientPromise;
    const db = client.db();

    // duplicate check
    const exists = await db.collection("users").findOne({ email });
    if (exists) {
      return res.status(409).json({ ok: false, message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const doc = {
      name,
      email,
      password: hash,
      role: "sub-admin",
      status: "active",
      permissions: [],
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(doc);

    return res.json({ ok: true });
  } catch (e) {
    console.error("CREATE SUB ADMIN ERROR", e);
    return res.status(500).json({ ok: false });
  }
}
