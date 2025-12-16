import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";
import User from "../../../models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

/*
PARTNER REWARDS API – FINAL (UI/UX SAFE)
✔ Dealer auth required
✔ Never hangs (no infinite loading)
✔ Works even if no referral / no subscription
*/

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  /* ================= AUTH ================= */
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== "dealer") {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  try {
    /* ================= DB ================= */
    await dbConnect();
    const db = mongoose.connection.db;

    /* ================= DEALER ================= */
    const dealer = await User.findOne({ email: session.user.email }).lean();
    if (!dealer) {
      return res.status(200).json({
        ok: true,
        summary: {
          referralCode: "",
          currentLevel: 1,
          maxRewardPercent: 0,
          placement: "Not eligible",
          totalEarnings: 0,
          thisMonthEarnings: 0,
        },
        commissionLevels: [],
        referrals: {},
        report: {
          totalTeam: 0,
          freeUsers: 0,
          paidUsers: 0,
          levelCount: {},
          levelEarnings: {},
        },
        note: "Dealer profile not found",
      });
    }

    /* ================= STRUCTURE ================= */
    const commissionLevels = [
      { level: 1, percent: 10 },
      { level: 2, percent: 5 },
      { level: 3, percent: 2 },
      { level: 4, percent: 2 },
      { level: 5, percent: 1 },
    ];

    const cumulativeRewards = { 1: 10, 2: 15, 3: 17, 4: 19, 5: 20 };

    const placement = {
      1: "No placement commitment",
      2: "No placement commitment",
      3: "Top 20 Dealers",
      4: "Top 10 Dealers",
      5: "Top 5 Dealers",
    };

    const currentLevel = dealer.level || 1;

    /* ================= NO REFERRAL CODE (UX SAFE) ================= */
    if (!dealer.referralCode) {
      return res.status(200).json({
        ok: true,
        summary: {
          referralCode: "",
          currentLevel,
          maxRewardPercent: 0,
          placement: "Not eligible",
          totalEarnings: 0,
          thisMonthEarnings: 0,
        },
        commissionLevels,
        referrals: {
          level1: [],
          level2: [],
          level3: [],
          level4: [],
          level5: [],
        },
        report: {
          totalTeam: 0,
          freeUsers: 0,
          paidUsers: 0,
          levelCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          levelEarnings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        },
        note: "Referral code not assigned yet",
      });
    }

    /* ================= FETCH SUBSCRIPTIONS ================= */
    const subs = await db
      .collection("subscriptions")
      .find({
        uplineCode: dealer.referralCode,
        approved: true,
      })
      .toArray();

    /* ================= INIT ================= */
    const referrals = {
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      level5: [],
    };

    const report = {
      totalTeam: 0,
      freeUsers: 0,
      paidUsers: 0,
      levelCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      levelEarnings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };

    let totalEarnings = 0;

    /* ================= PROCESS ================= */
    subs.forEach((s) => {
      if (s.level >= 1 && s.level <= 5) {
        report.totalTeam++;
        report.levelCount[s.level]++;

        const isFree = !s.amount || s.amount === 0;
        if (isFree) report.freeUsers++;
        else report.paidUsers++;

        const earned = s.rewardAmount || 0;
        report.levelEarnings[s.level] += earned;
        totalEarnings += earned;

        referrals[`level${s.level}`].push({
          name: s.buyerName || "Dealer",
          plan: s.plan || (isFree ? "FREE" : "PAID"),
          amount: s.amount || 0,
          earned,
          status: "APPROVED",
        });
      }
    });

    /* ================= SUMMARY ================= */
    const summary = {
      referralCode: dealer.referralCode,
      currentLevel,
      maxRewardPercent: cumulativeRewards[currentLevel],
      placement: placement[currentLevel],
      totalEarnings,
      thisMonthEarnings: totalEarnings,
    };

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      ok: true,
      summary,
      commissionLevels,
      referrals,
      report,
      note: "Rewards credited after admin approval only.",
    });
  } catch (error) {
    console.error("REFERRAL API ERROR:", error);
    return res.status(200).json({
      ok: true, // UI ko hang na kare
      summary: {
        referralCode: "",
        currentLevel: 1,
        maxRewardPercent: 0,
        placement: "Unavailable",
        totalEarnings: 0,
        thisMonthEarnings: 0,
      },
      commissionLevels: [],
      referrals: {},
      report: {
        totalTeam: 0,
        freeUsers: 0,
        paidUsers: 0,
        levelCount: {},
        levelEarnings: {},
      },
      note: "Temporary issue, please refresh",
    });
  }
}
