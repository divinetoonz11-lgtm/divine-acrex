// pages/api/admin/audit-logs/index.js
// SYSTEM – AUDIT LOGS (ENTERPRISE, FINAL)

import clientPromise from "../../../../lib/mongodb";
import { adminApiGuard } from "../../../../lib/adminApiGuard";

export default async function handler(req, res) {
  const session = await adminApiGuard(req, res);
  if (!session) return;

  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      message: "Only GET allowed",
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const limit = Math.min(parseInt(req.query.limit || "20"), 50);
    const skip = (page - 1) * limit;

    const { type, actor } = req.query;

    const query = {};
    if (type) query.type = type;
    if (actor) query.by = actor;

    const logs = await db
      .collection("audit_logs")
      .find(query)
      .project({
        type: 1,
        userId: 1,
        changes: 1,
        status: 1,
        by: 1,
        at: 1,
      })
      .sort({ at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("audit_logs").countDocuments(query);

    return res.json({
      ok: true,
      page,
      limit,
      total,
      logs,
    });
  } catch (e) {
    console.error("AUDIT LOG ERROR:", e);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
