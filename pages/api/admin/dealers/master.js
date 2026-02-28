import clientPromise from "../../../../lib/mongodb";
import adminGuard from "../../../../lib/adminGuard";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {

  if (!(await adminGuard(req, res))) return;

  const db = (await clientPromise).db();
  const users = db.collection("users");

  /* ================= GET ================= */
  if (req.method === "GET") {

    const { id, tab = "all", page = 1, limit = 10, q } = req.query;

    // SINGLE DEALER
    if (id && ObjectId.isValid(id)) {
      const dealer = await users.findOne({ _id: new ObjectId(id) });
      return res.json(dealer);
    }

    const p = Math.max(parseInt(page), 1);
    const l = Math.min(parseInt(limit), 50);
    const skip = (p - 1) * l;

    const query = { role: "dealer" };

    if (tab === "requests") query.status = "pending";
    if (tab === "active") query.status = "active";
    if (tab === "blocked") query.status = "blocked";

    if (q) {
      query.$or = [
        { name: new RegExp(q, "i") },
        { email: new RegExp(q, "i") },
      ];
    }

    const rows = await users
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .toArray();

    const total = await users.countDocuments(query);

    const summary = {
      requests: await users.countDocuments({ status: "pending" }),
      active: await users.countDocuments({ status: "active" }),
      blocked: await users.countDocuments({ status: "blocked" }),
    };

    return res.json({
      rows,
      summary,
      totalPages: Math.ceil(total / l),
    });
  }

  /* ================= PUT (SAFE UPDATE) ================= */
  if (req.method === "PUT") {

    const { _id, ...updates } = req.body;

    if (!_id || !ObjectId.isValid(_id)) {
      return res.status(400).json({ ok: false });
    }

    const cleanUpdates = {};

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && updates[key] !== "") {
        cleanUpdates[key] = updates[key];
      }
    });

    await users.updateOne(
      { _id: new ObjectId(_id) },
      { $set: cleanUpdates }
    );

    return res.json({ ok: true });
  }

  /* ================= PATCH ================= */
  if (req.method === "PATCH") {

    const { id, action } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false });
    }

    if (action === "approve") {
      await users.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "active" } }
      );
    }

    if (action === "block") {
      await users.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "blocked" } }
      );
    }

    return res.json({ ok: true });
  }

  res.status(405).end();
}