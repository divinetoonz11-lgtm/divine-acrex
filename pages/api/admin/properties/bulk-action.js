import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    // ✅ admin check
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== "admin") {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const { ids, action } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ ok: false, message: "No property ids" });
    }

    const _ids = ids.map((id) => new ObjectId(id));

    const client = await clientPromise;
    const db = client.db();

    let update = {};
    let auditAction = "";

    switch (action) {
      case "approve":
        update = { status: "live", blocked: false, spam: false };
        auditAction = "BULK_APPROVE";
        break;

      case "block":
        update = { status: "blocked", blocked: true };
        auditAction = "BULK_BLOCK";
        break;

      case "spam":
        update = { spam: true, status: "blocked" };
        auditAction = "BULK_SPAM";
        break;

      case "feature":
        update = { featured: true };
        auditAction = "BULK_FEATURE";
        break;

      default:
        return res.status(400).json({ ok: false, message: "Invalid action" });
    }

    // ✅ bulk update
    const result = await db.collection("properties").updateMany(
      { _id: { $in: _ids } },
      {
        $set: {
          ...update,
          updatedAt: new Date(),
        },
      }
    );

    // ✅ audit log (bulk)
    await db.collection("audit_logs").insertOne({
      action: auditAction,
      by: session.user.email,
      count: ids.length,
      propertyIds: ids,
      createdAt: new Date(),
    });

    return res.status(200).json({
      ok: true,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error("BULK ACTION ERROR", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
