import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Only POST allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== "dealer") {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  try {
    await dbConnect();
    const db = mongoose.connection.db;

    const dealerEmail = session.user.email;
    const { propertyId, creditsToUse } = req.body;

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid property ID",
      });
    }

    const boostCost = Number(creditsToUse || 0);

    if (!Number.isFinite(boostCost) || boostCost <= 0) {
      return res.status(400).json({
        ok: false,
        message: "Invalid boost credits",
      });
    }

    const propertyObjectId = new mongoose.Types.ObjectId(propertyId);

    const property = await db.collection("properties").findOne({
      _id: propertyObjectId,
      dealerEmail,
    });

    if (!property) {
      return res.status(404).json({
        ok: false,
        message: "Property not found or not yours",
      });
    }

    const dealer = await db.collection("users").findOne({
      email: dealerEmail,
    });

    if (!dealer) {
      return res.status(404).json({
        ok: false,
        message: "Dealer user not found",
      });
    }

    const currentCredits = Number(dealer.credits || dealer.walletCredits || 0);

    if (currentCredits < boostCost) {
      return res.status(400).json({
        ok: false,
        message: "Not enough credits",
        credits: currentCredits,
        requiredCredits: boostCost,
      });
    }

    const boostListings = Number((boostCost / 365).toFixed(2));
    const boostExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const oldVisibility = Number(property.visibilityScore || 0);
    const visibilityAdd = Math.min(25, Math.round(boostListings * 5));
    const newVisibilityScore = Math.min(100, oldVisibility + visibilityAdd);

    await db.collection("users").updateOne(
      { email: dealerEmail },
      {
        $inc: { credits: -boostCost },
        $set: {
          walletCredits: Math.max(0, currentCredits - boostCost),
          updatedAt: new Date(),
        },
      }
    );

    await db.collection("properties").updateOne(
      { _id: propertyObjectId, dealerEmail },
      {
        $set: {
          boosted: true,
          isBoosted: true,
          boostExpiry,
          lastBoostedAt: new Date(),
          visibilityScore: newVisibilityScore,
          updatedAt: new Date(),
        },
        $inc: {
          boostCount: boostListings,
          boostCreditsUsed: boostCost,
        },
      }
    );

    await db.collection("boost_transactions").insertOne({
      dealerEmail,
      propertyId: propertyObjectId,
      propertyTitle: property.title || property.propertyTitle || property.name || "",
      propertyCode: property.propertyCode || property.code || "",
      creditsUsed: boostCost,
      creditsBefore: currentCredits,
      creditsAfter: currentCredits - boostCost,
      boostListings,
      boostExpiry,
      type: "listing_boost",
      status: "success",
      createdAt: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: "Boost activated successfully",
      creditsUsed: boostCost,
      creditsLeft: currentCredits - boostCost,
      boostListings,
      boostExpiry,
      visibilityScore: newVisibilityScore,
    });
  } catch (err) {
    console.error("BOOST API ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: "Boost failed",
      error: err.message,
    });
  }
}