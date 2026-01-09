import clientPromise from "../../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  try {
    /* ================= METHOD ================= */
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false });
    }

    /* ================= ADMIN AUTH ================= */
    const session = await getServerSession(req, res, authOptions);
    if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
      return res.status(401).json({ ok: false });
    }

    const client = await clientPromise;
    const db = client.db();

    /* ================= PAGINATION ================= */
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 100);
    const skip = (page - 1) * limit;

    /* ================= FILTER INPUT ================= */
    const status = (req.query.status || "all").toLowerCase();
    const role = (req.query.role || "all").toLowerCase(); // user | dealer
    const q = (req.query.q || "").trim();
    const from = req.query.from; // yyyy-mm-dd
    const to = req.query.to;     // yyyy-mm-dd

    const query = {};

    /* ================= STATUS FILTER ================= */
    if (status !== "all") {
      if (status === "spam") query.spam = true;
      else query.status = status; // pending | live | blocked
    }

    /* ================= ROLE FILTER ================= */
    if (role === "user") {
      query.ownerEmail = { $ne: null };
    } else if (role === "dealer") {
      query.dealerEmail = { $ne: null };
    }

    /* ================= SEARCH FILTER ================= */
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
        { ownerName: { $regex: q, $options: "i" } },
        { ownerEmail: { $regex: q, $options: "i" } },
        { dealerName: { $regex: q, $options: "i" } },
        { dealerEmail: { $regex: q, $options: "i" } },
      ];
    }

    /* ================= DATE FILTER ================= */
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to + "T23:59:59.999Z");
    }

    /* ================= QUERY ================= */
    const [items, total] = await Promise.all([
      db
        .collection("properties")
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .project({
          title: 1,
          city: 1,
          price: 1,
          status: 1,
          spam: 1,
          featured: 1,

          ownerName: 1,
          ownerEmail: 1,
          dealerName: 1,
          dealerEmail: 1,

          createdAt: 1,
        })
        .toArray(),

      db.collection("properties").countDocuments(query),
    ]);

    return res.json({
      ok: true,
      page,
      limit,
      total,
      properties: items,
    });
  } catch (e) {
    console.error("ADMIN PROPERTIES API ERROR:", e);
    return res.status(500).json({ ok: false });
  }
}
