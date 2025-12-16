// pages/api/admin/audit-log.js
import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  // 🔐 ADMIN GUARD
  const session = await getServerSession(req, res, authOptions);
  if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
    return res.status(403).json({ ok: false, message: "Forbidden" });
  }

  const client = await clientPromise;
  const db = client.db("divine_db");

  // GET → fetch audit logs
  if (req.method === "GET") {
    const logs = await db
      .collection("audit_logs")
      .find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    return res.status(200).json({ ok: true, logs });
  }

  // POST → add audit log (used internally)
  if (req.method === "POST") {
    const { action, entity, entityId, meta } = req.body || {};
    if (!action || !entity) {
      return res.status(400).json({ ok: false, message: "Invalid request" });
    }

    await db.collection("audit_logs").insertOne({
      adminEmail: session.user.email,
      action,          // e.g. APPROVE_PROPERTY
      entity,          // users | dealers | properties | subscriptions | referrals
      entityId: entityId || null,
      meta: meta || {},
      createdAt: new Date(),
    });

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, message: "Method not allowed" });
}
