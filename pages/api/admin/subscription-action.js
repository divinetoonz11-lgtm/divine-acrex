import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

/* 🔐 ADMIN EMAIL WHITELIST */
const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Only POST allowed" });
  }

  /* ================= ADMIN GUARD ================= */
  const session = await getServerSession(req, res, authOptions);
  if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
    return res.status(403).json({ ok: false, message: "Forbidden" });
  }

  const { subscriptionId, action } = req.body;
  if (!subscriptionId || !action) {
    return res.status(400).json({ ok: false, message: "Invalid request" });
  }

  const client = await clientPromise;
  const db = client.db("divine_db");

  const sub = await db
    .collection("subscriptions")
    .findOne({ _id: subscriptionId });

  if (!sub) {
    return res.status(404).json({ ok: false, message: "Subscription not found" });
  }

  let update = {};

  if (action === "APPROVE") {
    update = {
      status: "APPROVED",
      approved: true,
      approvedAt: new Date(),
    };
  } else if (action === "REJECT") {
    update = {
      status: "REJECTED",
      approved: false,
    };
  } else {
    return res.status(400).json({ ok: false, message: "Invalid action" });
  }

  await db.collection("subscriptions").updateOne(
    { _id: subscriptionId },
    { $set: update }
  );

  const after = await db
    .collection("subscriptions")
    .findOne({ _id: subscriptionId });

  /* ================= AUDIT LOG ================= */
  await db.collection("audit_logs").insertOne({
    adminEmail: session.user.email,
    action: `SUBSCRIPTION_${action}`,
    entity: "subscription",
    entityId: subscriptionId,
    before: sub,
    after,
    createdAt: new Date(),
  });

  return res.status(200).json({
    ok: true,
    message: "Subscription action applied",
    subscription: after,
  });
}
