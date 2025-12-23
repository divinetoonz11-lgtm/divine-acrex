import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

/*
DEALER LEADS API – FINAL
✔ Dealer only
✔ Empty-safe
✔ UI preview compatible
✔ Future filters ready (month/year/date)
*/

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== "dealer") {
    return res.status(401).json({ ok: false });
  }

  try {
    await dbConnect();
    const db = mongoose.connection.db;

    /* ================= FILTERS (future-ready) ================= */
    const { from, to, month, year } = req.query;

    const query = {
      dealerEmail: session.user.email,
    };

    if (from && to) {
      query.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    if (month && year) {
      const m = parseInt(month) - 1; // 0 based
      const y = parseInt(year);
      query.createdAt = {
        $gte: new Date(y, m, 1),
        $lte: new Date(y, m + 1, 0, 23, 59, 59),
      };
    }

    /* ================= FETCH LEADS ================= */
    const leads = await db
      .collection("leads")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    /* ================= NORMALIZE FOR UI ================= */
    const safeLeads = leads.map((l) => ({
      _id: l._id,
      buyerName: l.buyerName || "Unknown Buyer",
      buyerPhone: l.buyerPhone || "-",
      buyerEmail: l.buyerEmail || "-",
      propertyTitle: l.propertyTitle || "Property Enquiry",
      status: l.status || "NEW",
      createdAt: l.createdAt || new Date(),
    }));

    return res.status(200).json({
      ok: true,
      leads: safeLeads,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      leads: [],
    });
  }
}
