import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import adminGuard from "../../../../lib/adminGuard";

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  const db = (await clientPromise).db();

  /* ===== GET (LIST + FILTER + PAGINATION) ===== */
  if (req.method === "GET") {
    const {
      q, role, month, kycStatus, status,
      page = 1, limit = 20,
    } = req.query;

    const query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { mobile: { $regex: q, $options: "i" } },
      ];
    }

    if (role) query.role = role;
    if (kycStatus) query.kycStatus = kycStatus;
    if (status) query.status = status;

    if (month) {
      const [y, m] = month.split("-");
      query.createdAt = {
        $gte: new Date(y, m - 1, 1),
        $lt: new Date(y, m, 1),
      };
    }

    const p = Math.max(parseInt(page), 1);
    const l = Math.min(parseInt(limit), 50);
    const skip = (p - 1) * l;

    const users = await db.collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .toArray();

    const total = await db.collection("users").countDocuments(query);

    return res.json({
      users,
      page: p,
      limit: l,
      total,
      totalPages: Math.ceil(total / l),
    });
  }

  /* ===== PATCH (EDIT) ===== */
  if (req.method === "PATCH") {
    const { id, name, mobile, role } = req.body;
    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, mobile, role } }
    );
    return res.json({ ok: true });
  }

  /* ===== DELETE ===== */
  if (req.method === "DELETE") {
    const { id } = req.body;
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    return res.json({ ok: true });
  }

  res.status(405).end();
}
