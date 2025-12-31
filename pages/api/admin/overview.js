/*
ADMIN OVERVIEW – FINAL (DEALER KPIs FIXED)
✔ Executive snapshot API
✔ Dummy fallback
✔ MongoDB auto override
✔ Dealer Management KPIs added
✔ UI SAFE (no change required)
*/

import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  try {
    /* =====================================================
       🔹 DUMMY FALLBACK (EXECUTIVE SNAPSHOT)
       ===================================================== */
    const DUMMY = {
      stats: {
        users: 0,
        dealers: 0,
        dealerRequests: 0,
        activeDealers: 0,
        blockedDealers: 0,
        kycPending: 0,
        properties: 0,
        revenue: 0,
        subscriptions: 0,
        activeListings: 0,
        pendingListings: 0,
        enquiries: 0,
      },
      graphs: {
        revenueTrend: [],
        userGrowth: [],
        subscriptions: [],
        listings: [],
      },
    };

    let LIVE = null;

    try {
      const client = await clientPromise;
      const db = client.db();

      /* =====================================================
         🔹 LIVE COUNTS (CRITICAL FIX)
         ===================================================== */
      const [
        users,
        totalDealers,
        dealerRequests,
        activeDealers,
        blockedDealers,
        kycPending,
        properties,
        subscriptions,
        activeListings,
        pendingListings,
        enquiries,
        revenueAgg,
      ] = await Promise.all([
        db.collection("users").countDocuments(),
        db.collection("users").countDocuments({ role: "dealer" }),
        db.collection("users").countDocuments({ status: "pending" }), // 🔑 REQUESTS
        db.collection("users").countDocuments({
          role: "dealer",
          status: "active",
        }),
        db.collection("users").countDocuments({
          role: "dealer",
          status: "blocked",
        }),
        db.collection("users").countDocuments({
          kycStatus: "pending",
        }),
        db.collection("properties").countDocuments(),
        db.collection("subscriptions").countDocuments({ status: "active" }),
        db.collection("properties").countDocuments({ status: "live" }),
        db.collection("properties").countDocuments({ status: "pending" }),
        db.collection("enquiries").countDocuments(),
        db.collection("payments")
          .aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])
          .toArray(),
      ]);

      LIVE = {
        stats: {
          users,
          dealers: totalDealers,
          dealerRequests,     // 🔑 FIXED
          activeDealers,      // 🔑 FIXED
          blockedDealers,     // 🔑 FIXED
          kycPending,         // 🔑 FIXED
          properties,
          revenue: revenueAgg[0]?.total || 0,
          subscriptions,
          activeListings,
          pendingListings,
          enquiries,
        },
        graphs: DUMMY.graphs, // graphs unchanged
      };
    } catch (dbErr) {
      console.warn("Admin overview DB fallback used");
    }

    return res.json({
      ok: true,
      source: LIVE ? "live" : "dummy",
      data: LIVE || DUMMY,
    });
  } catch (e) {
    console.error("ADMIN OVERVIEW API ERROR:", e);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
