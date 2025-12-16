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

  const { propertyId, action, reason } = req.body;
  if (!propertyId || !action) {
    return res.status(400).json({ ok: false, message: "Invalid request" });
  }

  const client = await clientPromise;
  const db = client.db("divine_db");

  /* ================= FIND PROPERTY ================= */
  const prop = await db.collection("properties").findOne({ _id: propertyId });
  if (!prop) {
    return res.status(404).json({ ok: false, message: "Property not found" });
  }

  const before = { ...prop };

  let update = {};

  if (action === "APPROVE") {
    update = { status: "APPROVED", active: true, rejectReason: null };
  } else if (action === "REJECT") {
    update = {
      status: "REJECTED",
      active: false,
      rejectReason: reason || "Rejected by admin",
    };
  } else if (action === "ACTIVATE") {
    update = { active: true };
  } else if (action === "DEACTIVATE") {
    update = { active: false };
  } else {
    return res.status(400).json({ ok: false, message: "Invalid action" });
  }

  /* ================= UPDATE ================= */
  await db.collection("properties").updateOne(
    { _id: propertyId },
    { $set: update }
  );

  const after = await db
    .collection("properties")
    .findOne({ _id: propertyId });

  /* ================= AUDIT LOG ================= */
  await db.collection("audit_logs").insertOne({
    adminEmail: session.user.email,
    action: `PROPERTY_${action}`,
    entity: "property",
    entityId: propertyId,
    before,
    after,
    reason: reason || "",
    createdAt: new Date(),
  });

  return res.status(200).json({
    ok: true,
    message: "Property action applied",
    property: after,
  });
}
