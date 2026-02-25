import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import clientPromise from "../../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    /* ================= AUTH ================= */
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== "admin") {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("properties");

    /* ================= QUERY PARAMS (TABLE) ================= */
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "20");
    const q = req.query.q || "";
    const status = req.query.status || "all"; // live | pending | blocked | spam
    const role = req.query.role || "all";     // user | dealer

    const skip = (page - 1) * limit;

    /* ================= TABLE FILTER ================= */
    const filter = {};

    // search
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
        { ownerEmail: { $regex: q, $options: "i" } },
        { dealerEmail: { $regex: q, $options: "i" } },
      ];
    }

    // status
    if (status !== "all") {
      if (status === "spam") filter.spam = true;
      else filter.status = status;
    }

    // role
    if (role === "dealer") filter.dealerEmail = { $exists: true };
    if (role === "user") filter.dealerEmail = { $exists: false };

    /* ================= TABLE DATA ================= */
    const totalFiltered = await col.countDocuments(filter);

    const items = await col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    /* ================= KPI (GLOBAL – NO FILTER) ================= */
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      total,
      live,
      pending,
      blocked,
      verified,
      spam,
      dealerProps,
      userProps,
      addedToday,
      byType,
      byCity,
    ] = await Promise.all([
      col.countDocuments({}),
      col.countDocuments({ status: "live" }),
      col.countDocuments({ status: "pending" }),
      col.countDocuments({ status: "blocked" }),
      col.countDocuments({ verified: true }),
      col.countDocuments({ spam: true }),
      col.countDocuments({ dealerEmail: { $exists: true } }),
      col.countDocuments({ dealerEmail: { $exists: false } }),
      col.countDocuments({ createdAt: { $gte: startOfDay } }),

      // report: by property type
      col.aggregate([
        { $match: { propertyType: { $exists: true } } },
        { $group: { _id: "$propertyType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),

      // report: top cities
      col.aggregate([
        { $match: { city: { $exists: true } } },
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).toArray(),
    ]);

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      ok: true,

      kpi: {
        total,
        live,
        pending,
        blocked,
        verified,
        spam,
        dealers: dealerProps,
        users: userProps,
        addedToday,
      },

      reports: {
        byType,
        byCity,
      },

      items,
      pages: Math.ceil(totalFiltered / limit),
    });
  } catch (err) {
    console.error("INSIGHTS API ERROR:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
