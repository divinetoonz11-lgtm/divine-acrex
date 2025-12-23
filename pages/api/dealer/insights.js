import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import Property from "../../../models/Property";
import Lead from "../../../models/Lead";
import mongoose from "mongoose";

/*
DEALER INSIGHTS API – FINAL
✔ Matches insights.jsx
✔ Dealer-only
✔ Dashboard ready
✔ Safe defaults
*/

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== "dealer") {
    return res.status(401).json({ ok: false });
  }

  try {
    await dbConnect();

    const email = session.user.email;

    /* ================= PROPERTIES ================= */
    const totalProperties = await Property.countDocuments({
      dealerEmail: email,
    });

    const activeProperties = await Property.countDocuments({
      dealerEmail: email,
      status: "active",
    });

    /* ================= LEADS ================= */
    const totalLeads = await Lead.countDocuments({
      dealerEmail: email,
    });

    const closedDeals = await Lead.countDocuments({
      dealerEmail: email,
      status: "CLOSED",
    });

    /* ================= EARNINGS (SAFE PLACEHOLDER) ================= */
    // Future: calculate from subscriptions + referral payouts
    const totalEarnings = 0;

    /* ================= REFERRAL TEAM ================= */
    // Future: calculate from referral collection
    const referralTeam = 0;

    return res.status(200).json({
      ok: true,
      totalLeads,
      closedDeals,
      totalEarnings,
      referralTeam,

      // extra (future dashboard use)
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
