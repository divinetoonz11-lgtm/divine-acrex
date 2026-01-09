import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  /* ================= AUTH ================= */
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const email = session.user.email;
  const client = await clientPromise;
  const db = client.db();

  /* ================= PAGINATION ================= */
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(parseInt(req.query.limit || "8", 10), 50);
  const skip = (page - 1) * limit;

  /* ================= BASE FILTER =================
     ✔ USER ki sab properties
     ✔ Pending / Approved / Live
  =============================================== */
  const filter = {
    ownerEmail: email,
    isDeleted: { $ne: true },
  };

  /* ================= GET → USER PROPERTIES ================= */
  if (req.method === "GET") {
    const total = await db.collection("properties").countDocuments(filter);

    const rows = await db
      .collection("properties")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .project({
        title: 1,
        category: 1,
        propertyType: 1,
        city: 1,
        price: 1,
        photosCount: 1,
        videoName: 1,
        status: 1,               // pending / approved
        isLive: 1,
        verificationStatus: 1,   // VERIFIED_LIVE
        createdAt: 1,
      })
      .toArray();

    return res.json({
      ok: true,
      data: rows,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    });
  }

  /* ================= DELETE → USER PROPERTY ================= */
  if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ ok: false, message: "Property id required" });
    }

    const result = await db.collection("properties").updateOne(
      { _id: new ObjectId(id), ownerEmail: email },
      { $set: { isDeleted: true, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ ok: false, message: "Property not found" });
    }

    return res.json({ ok: true });
  }

  return res.status(405).json({ ok: false });
}
