import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import adminGuard from "../../../../lib/adminGuard";

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  const db = (await clientPromise).db("divineacres");

  /* =========================================================
     GET – UNIVERSAL USER LIST (ALL ROLES SUPPORTED)
  ========================================================= */
  if (req.method === "GET") {
    const {
      q,
      role,
      kycStatus,
      status,
      from,
      to,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    /* ROLE FILTER */
    if (role) {
      query.role = role;
    }

    /* STATUS FILTER */
    if (status) {
      query.status = status;
    }

    /* KYC STATUS */
    if (kycStatus) {
      query.kycStatus = kycStatus;
    }

    /* DATE FILTER */
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    /* SEARCH */
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { mobile: { $regex: q, $options: "i" } },
      ];
    }

    const p = Math.max(parseInt(page), 1);
    const l = Math.min(parseInt(limit), 50);
    const skip = (p - 1) * l;

    const users = await db
      .collection("users")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .toArray();

    const total = await db.collection("users").countDocuments(query);

    return res.json({
      ok: true,
      users,
      page: p,
      limit: l,
      total,
      totalPages: Math.ceil(total / l),
    });
  }

  /* =========================================================
     PATCH – UPDATE USER
  ========================================================= */
  if (req.method === "PATCH") {
    const { id, name, mobile, role, status, kycStatus } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, message: "Invalid ID" });
    }

    const updateFields = {};

    if (name !== undefined) updateFields.name = name;
    if (mobile !== undefined) updateFields.mobile = mobile;
    if (role !== undefined) updateFields.role = role;
    if (status !== undefined) updateFields.status = status;
    if (kycStatus !== undefined) updateFields.kycStatus = kycStatus;

    updateFields.updatedAt = new Date();

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return res.json({ ok: true });
  }

  /* =========================================================
     DELETE – REMOVE USER
  ========================================================= */
  if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, message: "Invalid ID" });
    }

    await db.collection("users").deleteOne({
      _id: new ObjectId(id),
    });

    return res.json({ ok: true });
  }

  return res.status(405).json({
    ok: false,
    message: "Method not allowed",
  });
}