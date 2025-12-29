// pages/api/dealer/dashboard.js
import { PrismaClient } from "@prisma/client";
import clientPromise from "../../../lib/mongodb";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    /* ================= AUTH ================= */
    const session = await getSession({ req });
    if (!session?.user?.email) {
      return res.status(401).json({ ok: false });
    }

    const dealerEmail = session.user.email;
    const dealerId = req.query.dealerId; // Prisma User.id (already used in your dashboard)

    /* ================= PRISMA : PROFILE ================= */
    const profile = dealerId
      ? await prisma.profile.findUnique({
          where: { userId: dealerId },
          select: { profileCompleted: true },
        })
      : null;

    /* ================= PRISMA : LISTINGS ================= */
    const listings = dealerId
      ? await prisma.listing.findMany({
          where: { ownerId: dealerId, isDeleted: false },
          select: { id: true, status: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        })
      : [];

    const totalListings = listings.length;
    const pending = listings.filter(l => l.status === "PENDING").length;
    const approved = listings.filter(l => l.status === "APPROVED").length;
    const rejected = listings.filter(l => l.status === "REJECTED").length;

    /* ================= MONGO : USER + REFERRAL CODE ================= */
    const client = await clientPromise;
    const db = client.db();

    // 🔥 CORRECT SOURCE (as per your DB)
    const userDoc = await db.collection("users").findOne(
      { email: dealerEmail },
      { projection: { referralCode: 1 } }
    );

    const referralCode = userDoc?.referralCode || null;

    /* ================= MONGO : REFERRAL EARNINGS ================= */
    const earnings = await db
      .collection("referral_earnings")
      .find({ referrerEmail: dealerEmail })
      .toArray();

    let referralTotalIncome = 0;
    const referralMonthMap = {};

    earnings.forEach(e => {
      const amt = Number(e.amount || 0);
      referralTotalIncome += amt;
      const m = new Date(e.createdAt).getMonth();
      referralMonthMap[m] = (referralMonthMap[m] || 0) + amt;
    });

    const referralMonthly = Array.from({ length: 6 }).map((_, i) => {
      const monthIndex = new Date().getMonth() - (5 - i);
      return referralMonthMap[monthIndex] || 0;
    });

    /* ================= PRISMA : PERFORMANCE ================= */
    const performanceMap = {};
    listings.forEach(l => {
      const m = new Date(l.createdAt).getMonth();
      performanceMap[m] = (performanceMap[m] || 0) + 1;
    });

    const performance = Array.from({ length: 6 }).map((_, i) => {
      const monthIndex = new Date().getMonth() - (5 - i);
      return performanceMap[monthIndex] || 0;
    });

    /* ================= FINAL RESPONSE ================= */
    return res.status(200).json({
      ok: true,

      profileCompleted: profile?.profileCompleted || false,

      totalListings,
      pending,
      approved,
      rejected,

      referral: {
        code: referralCode,            // ✅ UA-ORBERI-4177 etc.
        totalIncome: referralTotalIncome,
        monthly: referralMonthly,
      },

      performance,
    });
  } catch (err) {
    console.error("Dealer dashboard API error:", err);
    return res.status(500).json({ ok: false });
  }
}
