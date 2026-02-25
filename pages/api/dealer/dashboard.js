// pages/api/dealer/dashboard.js
import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ ok: false });
    }

    const email = session.user.email.toLowerCase();
    const client = await clientPromise;
    const db = client.db("divine99acres");

    /* ===== DEALER USER ===== */
    const user = await db.collection("users").findOne({ email });
    if (!user || user.role !== "dealer") {
      return res.status(403).json({ ok: false });
    }

    /* ===== PROFILE STATUS (FLEXIBLE & FINAL) ===== */
    const profileCompleted = Boolean(
      (user.name || user.fullName) &&
      (user.mobile || user.phone) &&
      (user.companyName || user.businessName)
    );

    /* ===== DEALER PROPERTIES (ALL POSSIBLE LINKS) ===== */
    const properties = await db
      .collection("properties")
      .find({
        isDeleted: { $ne: true },
        $or: [
          { dealerEmail: email },
          { userEmail: email },
          { dealerId: user._id },
          { postedBy: email },
        ],
      })
      .toArray();

    const totalListings = properties.length;
    const activeListings = properties.filter(
      p => p.status === "LIVE" || p.status === "ACTIVE"
    ).length;
    const pendingListings = totalListings - activeListings;

    /* ===== LEADS ===== */
    const leads = await db
      .collection("leads")
      .find({
        $or: [
          { dealerEmail: email },
          { dealerId: user._id },
        ],
      })
      .toArray();

    const totalLeads = leads.length;
    const activeLeads = leads.filter(l => l.status !== "CLOSED").length;

    /* ===== PERFORMANCE GRAPH (LAST 6 MONTHS) ===== */
    const performance = Array(6).fill(0);
    properties.forEach(p => {
      if (!p.createdAt) return;
      const diff =
        (new Date().getFullYear() - new Date(p.createdAt).getFullYear()) * 12 +
        (new Date().getMonth() - new Date(p.createdAt).getMonth());
      if (diff >= 0 && diff < 6) {
        performance[5 - diff]++;
      }
    });

    return res.json({
      ok: true,
      profileCompleted,
      totalListings,
      activeListings,
      pendingListings,
      totalLeads,
      activeLeads,
      subscription: { plan: user.subscriptionPlan || "Free" },
      referralCode: user.referralCode || null,
      performance,
    });
  } catch (err) {
    console.error("Dealer dashboard error:", err);
    return res.status(500).json({ ok: false });
  }
}
