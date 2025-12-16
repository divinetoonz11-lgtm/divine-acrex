// pages/api/admin/subscriptions.js
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

  // GET → all subscriptions (pending/approved)
  if (req.method === "GET") {
    const subs = await db
      .collection("subscriptions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({ ok: true, subscriptions: subs });
  }

  // POST → approve / reject subscription
  if (req.method === "POST") {
    const { id, action } = req.body;
    if (!id || !action) {
      return res.status(400).json({ ok: false, message: "Invalid request" });
    }

    const status =
      action === "APPROVE"
        ? "APPROVED"
        : action === "REJECT"
        ? "REJECTED"
        : null;

    if (!status) {
      return res.status(400).json({ ok: false, message: "Invalid action" });
    }

    await db.collection("subscriptions").updateOne(
      { _id: id },
      { $set: { status, approvedAt: new Date() } }
    );

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, message: "Method not allowed" });
}
