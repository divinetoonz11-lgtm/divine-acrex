import clientPromise from "../../../../lib/mongodb";
import adminGuard from "../../../../lib/adminGuard";
import { ObjectId } from "mongodb";

/*
USERS BULK ACTIONS – FINAL
✔ Admin only
✔ Bulk delete
✔ Bulk role update
✔ Safe ObjectId handling
*/

export default async function handler(req, res) {
  // 🔒 Admin check
  if (!(await adminGuard(req, res))) return;

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "POST only" });
  }

  try {
    const db = (await clientPromise).db();
    const { ids, action, role } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ ok: false, message: "No user IDs provided" });
    }

    const _ids = ids.map(id => new ObjectId(id));

    // 🧨 BULK DELETE
    if (action === "delete") {
      const r = await db
        .collection("users")
        .deleteMany({ _id: { $in: _ids } });

      // (Optional) soft-delete alternative:
      // await db.collection("users").updateMany(
      //   { _id: { $in: _ids } },
      //   { $set: { status: "deleted", deletedAt: new Date() } }
      // );

      return res.json({
        ok: true,
        action: "delete",
        affected: r.deletedCount,
      });
    }

    // 🎭 BULK ROLE CHANGE
    if (action === "role") {
      if (!role) {
        return res.status(400).json({ ok: false, message: "Role required" });
      }

      const r = await db
        .collection("users")
        .updateMany(
          { _id: { $in: _ids } },
          { $set: { role, updatedAt: new Date() } }
        );

      return res.json({
        ok: true,
        action: "role",
        role,
        affected: r.modifiedCount,
      });
    }

    return res.status(400).json({ ok: false, message: "Invalid action" });
  } catch (err) {
    console.error("BULK ACTION ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Bulk action failed",
    });
  }
}
