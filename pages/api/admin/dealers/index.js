import clientPromise from "../../../../lib/mongodb";
import adminGuard from "../../../../lib/adminGuard";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  const db = (await clientPromise).db();

  /* ========= GET : TAB WISE DATA ========= */
  if (req.method === "GET") {
    const { tab = "requests" } = req.query;

    // REQUESTS → dealer_requests
    if (tab === "requests") {
      const rows = await db
        .collection("dealer_requests")
        .find({ status: "pending" })
        .sort({ createdAt: -1 })
        .toArray();

      return res.json({ ok: true, rows });
    }

    // OTHER TABS → users (only dealers)
    const query = { role: "dealer" };

    if (tab === "active") query.status = "active";
    if (tab === "blocked") query.status = "blocked";
    if (tab === "kyc") query.kycStatus = { $ne: "approved" };
    if (tab === "subscriptions") query.subscription = { $exists: true };
    if (tab === "promotions") query.promotion = { $exists: true };
    if (tab === "referrals") query.referralCode = { $exists: true };

    const rows = await db
      .collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({ ok: true, rows });
  }

  /* ========= PATCH : EDIT / SAVE ========= */
  if (req.method === "PATCH") {
    const { id, update } = req.body;

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } }
    );

    return res.json({ ok: true });
  }

  /* ========= DELETE : REMOVE ========= */
  if (req.method === "DELETE") {
    const { id } = req.body;

    await db.collection("users").deleteOne({
      _id: new ObjectId(id),
    });

    return res.json({ ok: true });
  }

  res.status(405).json({ ok: false });
}
