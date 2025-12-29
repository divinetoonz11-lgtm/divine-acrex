// pages/api/admin/sub-admins/permissions.js
import clientPromise from "../../../../lib/mongodb";

/*
SUB ADMIN – PERMISSION UPDATE API
✔ Real DB
✔ Role locked
✔ Fine-grained control
✔ Enterprise safe
*/

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { userId, permissions } = req.body;

    /*
      permissions example:
      {
        users: ["read","write","block"],
        properties: ["read","approve"],
        revenue: ["read"],
        reports: ["read","export"]
      }
    */

    if (!userId || !permissions) {
      return res.status(400).json({ ok: false, message: "Missing data" });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("users").updateOne(
      { _id: userId, role: "sub-admin" },
      {
        $set: {
          permissions,
          updatedAt: new Date(),
        },
      }
    );

    if (!result.matchedCount) {
      return res.status(404).json({ ok: false, message: "Sub-admin not found" });
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error("SUB ADMIN PERMISSION ERROR:", e);
    return res.status(500).json({ ok: false });
  }
}
