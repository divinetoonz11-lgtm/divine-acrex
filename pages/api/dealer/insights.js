import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== "dealer") {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  try {
    await dbConnect();
    const db = mongoose.connection.db;

    const dealerEmail = session.user.email;

    const dealerProperties = await db
      .collection("properties")
      .find({ dealerEmail })
      .toArray();

    const propertyIds = dealerProperties.map((p) => p._id.toString());

    const totalListings = dealerProperties.length;

    const activeListings = dealerProperties.filter((p) =>
      ["active", "Active", "ACTIVE", "live", "Live", "LIVE"].includes(p.status)
    ).length;

    const soldProperties = dealerProperties.filter((p) =>
      ["sold", "Sold", "SOLD"].includes(p.status)
    );

    const totalEarnings = soldProperties.reduce(
      (sum, p) => sum + (Number(p.price) || Number(p.expectedPrice) || 0),
      0
    );

    let leads = [];

    if (propertyIds.length > 0) {
      leads = await db
        .collection("leads")
        .find({ propertyId: { $in: propertyIds } })
        .toArray();
    }

    const totalLeads = leads.length;

    const closedDeals = leads.filter((l) =>
      ["closed", "Closed", "CLOSED", "sold", "Sold", "SOLD"].includes(l.status)
    ).length;

    const totalViews = dealerProperties.reduce(
      (sum, p) => sum + (Number(p.views) || Number(p.viewCount) || 0),
      0
    );

    const totalResponses = leads.length;

    const credits = dealerProperties.reduce(
      (sum, p) => sum + (Number(p.credits) || Number(p.boostCredits) || 0),
      0
    );

    const lowPerforming = dealerProperties.filter((p) => {
      const views = Number(p.views) || Number(p.viewCount) || 0;
      const score = Number(p.visibilityScore) || 0;
      return views < 10 || score < 50;
    }).length;

    const verificationPending = dealerProperties.filter((p) => {
      const status = String(p.verificationStatus || "").toLowerCase();
      return (
        status === "pending" ||
        p.verified === false ||
        p.isVerified === false
      );
    }).length;

    const mediaMissing = dealerProperties.filter((p) => {
      const media =
        p.images ||
        p.photos ||
        p.gallery ||
        p.propertyImages ||
        p.imageUrls ||
        [];

      return !Array.isArray(media) || media.length === 0;
    }).length;

    const now = Date.now();
    const tenDays = 10 * 24 * 60 * 60 * 1000;

    const expiringSoon = dealerProperties.filter((p) => {
      const date = p.expiryDate || p.expiresAt || p.expiry;
      if (!date) return false;

      const time = new Date(date).getTime();
      return time >= now && time <= now + tenDays;
    }).length;

    const recentlyExpired = dealerProperties.filter((p) => {
      const date = p.expiryDate || p.expiresAt || p.expiry;
      if (!date) return false;

      return new Date(date).getTime() < now;
    }).length;

    const verifiedListings = dealerProperties.filter((p) => {
      const status = String(p.verificationStatus || "").toLowerCase();
      return (
        p.verified === true ||
        p.isVerified === true ||
        status === "verified"
      );
    }).length;

    const boostedListings = dealerProperties.filter((p) => {
      const boostExpiry = p.boostExpiry ? new Date(p.boostExpiry).getTime() : 0;

      return (
        p.boosted === true ||
        p.isBoosted === true ||
        boostExpiry > now
      );
    }).length;

    const avgVisibilityScore =
      totalListings > 0
        ? Math.round(
            dealerProperties.reduce((sum, p) => {
              return sum + (Number(p.visibilityScore) || 0);
            }, 0) / totalListings
          )
        : 0;

    const boostTarget =
      dealerProperties.find((p) =>
        ["active", "Active", "ACTIVE", "live", "Live", "LIVE"].includes(p.status)
      ) || dealerProperties[0];

    return res.status(200).json({
      ok: true,

      totalLeads,
      closedDeals,
      totalEarnings,
      referralTeam: 0,

      totalListings,
      activeListings,
      totalViews,
      totalResponses,
      credits,

      lowPerforming,
      verificationPending,
      mediaMissing,
      expiringSoon,
      recentlyExpired,

      verifiedListings,
      boostedListings,
      avgVisibilityScore,

      boostTargetPropertyId: boostTarget?._id?.toString() || "",

      meta: {
        dealerEmail,
        totalProperties: totalListings,
        activeProperties: activeListings,
      },
    });
  } catch (err) {
    console.error("INSIGHTS API ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: err.message,
    });
  }
}