// pages/api/admin/property-overview-graph.js
// ENTERPRISE LIVE AGGREGATION (TREND + COMPARE + KPI WISE)
// SAFE FOR 20 LAKH+ RECORDS

import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const { range = "monthly" } = req.query;

    const client = await clientPromise;
    const db = client.db();

    // -------- DATE FORMAT BY RANGE --------
    let fmt = "%Y-%m";
    if (range === "daily") fmt = "%Y-%m-%d";
    if (range === "yearly") fmt = "%Y";

    // -------- BASE MATCH --------
    const match = { createdAt: { $exists: true } };

    // -------- TREND (TOTAL) --------
    const trend = await db.collection("properties").aggregate([
      { $match: match },
      {
        $project: {
          label: { $dateToString: { format: fmt, date: "$createdAt" } },
        },
      },
      { $group: { _id: "$label", total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ], { allowDiskUse: true }).toArray();

    // -------- KPI WISE (MULTI) --------
    const kpis = await db.collection("properties").aggregate([
      { $match: match },
      {
        $project: {
          label: { $dateToString: { format: fmt, date: "$createdAt" } },
          status: 1,
          spam: 1,
          featured: 1,
          verified: 1,
          postedBy: 1,
        },
      },
      {
        $group: {
          _id: "$label",
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          live: { $sum: { $cond: [{ $eq: ["$status", "live"] }, 1, 0] } },
          blocked: { $sum: { $cond: [{ $eq: ["$status", "blocked"] }, 1, 0] } },
          spam: { $sum: { $cond: ["$spam", 1, 0] } },
          featured: { $sum: { $cond: ["$featured", 1, 0] } },
          verified: { $sum: { $cond: [{ $eq: ["$verified", true] }, 1, 0] } },
          unverified: { $sum: { $cond: [{ $ne: ["$verified", true] }, 1, 0] } },
          users: { $sum: { $cond: [{ $eq: ["$postedBy", "Owner"] }, 1, 0] } },
          dealers: { $sum: { $cond: [{ $eq: ["$postedBy", "Dealer"] }, 1, 0] } },
          builders: { $sum: { $cond: [{ $eq: ["$postedBy", "Builder"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ], { allowDiskUse: true }).toArray();

    // -------- COMPARE (CURRENT vs PREVIOUS) --------
    const compare = trend.map((t, i) => ({
      label: t._id,
      current: t.total,
      previous: i > 0 ? trend[i - 1].total : 0,
    }));

    res.json({
      trend: trend.map(t => ({ label: t._id, total: t.total })),
      compare,
      kpis: kpis.map(k => ({
        label: k._id,
        pending: k.pending,
        live: k.live,
        blocked: k.blocked,
        spam: k.spam,
        featured: k.featured,
        verified: k.verified,
        unverified: k.unverified,
        users: k.users,
        dealers: k.dealers,
        builders: k.builders,
      })),
    });
  } catch (e) {
    res.status(500).json({ trend: [], compare: [], kpis: [] });
  }
}
