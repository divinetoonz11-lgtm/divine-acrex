import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";

/*
DEALER ANALYTICS API – PROPERTY LINKED ENTERPRISE VERSION
✔ No dealerEmail dependency in leads
✔ Works with current DB structure
✔ Graph safe
✔ 50L+ user scalable logic
*/

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== "dealer") {
    return res.status(401).json({ ok: false });
  }

  try {
    await dbConnect();
    const db = mongoose.connection.db;

    const dealerEmail = session.user.email;

    /* ================= DEALER PROPERTIES ================= */

    const properties = await db
      .collection("properties")
      .find({ dealerEmail: dealerEmail })
      .toArray();

    const propertyIds = properties.map(p =>
      p._id.toString()
    );

    const totalProperties = properties.length;

    const activeListings = properties.filter(
      p => p.status === "active"
    ).length;

    const closedDeals = properties.filter(
      p => p.status === "sold"
    ).length;

    const totalRevenue = properties
      .filter(p => p.status === "sold")
      .reduce((sum, p) => sum + (p.price || 0), 0);

    /* ================= LEADS (PROPERTY BASED) ================= */

    let leads = [];

    if (propertyIds.length > 0) {
      leads = await db
        .collection("leads")
        .find({
          propertyId: { $in: propertyIds }
        })
        .toArray();
    }

    const totalLeads = leads.length;

    const conversionRate =
      totalLeads > 0
        ? Number(((closedDeals / totalLeads) * 100).toFixed(1))
        : 0;

    /* ================= LEAD SOURCES ================= */

    const sourceMap = {};
    leads.forEach(l => {
      const s = l.source || "Direct";
      sourceMap[s] = (sourceMap[s] || 0) + 1;
    });

    const leadSources = Object.keys(sourceMap).map(k => ({
      name: k,
      value: sourceMap[k]
    }));

    /* ================= CITY PERFORMANCE ================= */

    const cityMap = {};
    properties.forEach(p => {
      const c = p.city || "Unknown";
      cityMap[c] = (cityMap[c] || 0) + 1;
    });

    const cityPerformance = Object.keys(cityMap).map(c => ({
      city: c,
      listings: cityMap[c]
    }));

    /* ================= MONTHLY DATA ================= */

    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return d.toLocaleString("default", { month: "short" });
    });

    function countByMonth(arr) {
      const map = {};
      arr.forEach(x => {
        if (!x.createdAt) return;
        const m = new Date(x.createdAt).toLocaleString("default", {
          month: "short"
        });
        map[m] = (map[m] || 0) + 1;
      });
      return months.map(m => map[m] || 0);
    }

    return res.json({
      ok: true,
      kpis: {
        totalProperties,
        activeListings,
        totalLeads,
        closedDeals,
        conversionRate,
        totalRevenue
      },
      months,
      monthly: {
        properties: countByMonth(properties),
        leads: countByMonth(leads)
      },
      leadSources,
      cityPerformance
    });

  } catch (err) {
    console.error("ANALYTICS API ERROR:", err);
    return res.status(500).json({ ok: false });
  }
}