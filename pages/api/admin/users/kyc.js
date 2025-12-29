import clientPromise from "../../../../lib/mongodb";
import { adminApiGuard } from "../../../../lib/adminApiGuard";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const session = await adminApiGuard(req, res);
  if (!session) return;

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, status } = req.body; // status = approved | rejected
  if (!id || !status) {
    return res.status(400).json({ error: "id & status required" });
  }

  const client = await clientPromise;
  const db = client.db();

  await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    { $set: { kycStatus: status } }
  );

  // AUDIT LOG
  await db.collection("audit_logs").insertOne({
    type: "KYC_UPDATE",
    userId: id,
    status,
    by: session.user.email,
    at: new Date(),
  });

  res.json({ ok: true });
}
