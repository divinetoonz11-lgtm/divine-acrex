import clientPromise from "../../../../lib/mongodb";

/*
  SUB-ADMIN MASTER API
  GET  : list sub-admins
  POST : create sub-admin
*/

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();

    if (req.method === "GET") {
      const subs = await db
        .collection("users")
        .find({ role: "sub-admin" })
        .sort({ createdAt: -1 })
        .toArray();

      return res.json({ ok: true, subAdmins: subs });
    }

    if (req.method === "POST") {
      const { name, email, permissions = [] } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          error: "Name and email required",
        });
      }

      const exists = await db.collection("users").findOne({ email });
      if (exists) {
        return res.status(409).json({
          error: "User already exists",
        });
      }

      const user = {
        name,
        email,
        role: "sub-admin",
        permissions,
        createdAt: new Date(),
      };

      await db.collection("users").insertOne(user);

      return res.status(201).json({
        ok: true,
        message: "Sub-admin created",
        user,
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("SUB-ADMIN API ERROR:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
