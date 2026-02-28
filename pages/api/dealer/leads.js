import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

/*
DEALER LEADS API – FIXED (PROPERTY LINKED)
✔ No dealerEmail dependency
✔ Matches property owner
✔ Works with current lead structure
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

    const dealerEmail = session.user.email;

    /* ================= GET DEALER PROPERTIES ================= */

    const dealerProperties = await db
      .collection("properties")
      .find({ dealerEmail: dealerEmail })
      .project({ _id: 1 })
      .toArray();

    const propertyIds = dealerProperties.map(p => p._id.toString());

    if (propertyIds.length === 0) {
      return res.status(200).json({
        ok: true,
        leads: [],
      });
    }

    /* ================= FETCH LEADS BY PROPERTY ================= */

    const leads = await db
      .collection("leads")
      .find({
        propertyId: { $in: propertyIds }
      })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    /* ================= NORMALIZE FOR UI ================= */

    const safeLeads = leads.map((l) => ({
      _id: l._id,
      buyerName: l.name || "Unknown Buyer",
      buyerPhone: l.phone || "-",
      buyerEmail: l.email || "-",
      propertyTitle: l.propertyTitle || "Property Enquiry",
      status: l.status || "new",
      createdAt: l.createdAt || new Date(),
    }));

    return res.status(200).json({
      ok: true,
      leads: safeLeads,
    });

  } catch (err) {
    console.error("LEADS API ERROR:", err);
    return res.status(500).json({
      ok: false,
      leads: [],
    });
  }
}