import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";

/*
DEALER INSIGHTS API – PROPERTY LINKED VERSION
✔ Works with current lead structure
✔ No dealerEmail needed in leads
✔ Enterprise safe
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

    /* ================= GET DEALER PROPERTIES ================= */

    const dealerProperties = await db
      .collection("properties")
      .find({ dealerEmail: dealerEmail })
      .toArray();

    const propertyIds = dealerProperties.map(p =>
      p._id.toString()
    );

    const totalProperties = dealerProperties.length;

    const activeProperties = dealerProperties.filter(
      p => p.status === "active"
    ).length;

    const soldProperties = dealerProperties.filter(
      p => p.status === "sold"
    );

    const totalEarnings = soldProperties.reduce(
      (sum, p) => sum + (p.price || 0),
      0
    );

    /* ================= LEADS (PROPERTY BASED) ================= */

    let totalLeads = 0;
    let closedDeals = 0;

    if (propertyIds.length > 0) {
      const leads = await db
        .collection("leads")
        .find({
          propertyId: { $in: propertyIds }
        })
        .toArray();

      totalLeads = leads.length;

      closedDeals = leads.filter(
        l => l.status === "closed"
      ).length;
    }

    return res.status(200).json({
      ok: true,
      totalLeads,
      closedDeals,
      totalEarnings,
      referralTeam: 0,
      meta: {
        totalProperties,
        activeProperties,
      },
    });

  } catch (err) {
    console.error("INSIGHTS API ERROR:", err);
    return res.status(500).json({
      ok: false,
      totalLeads: 0,
      closedDeals: 0,
      totalEarnings: 0,
      referralTeam: 0,
    });
  }
}