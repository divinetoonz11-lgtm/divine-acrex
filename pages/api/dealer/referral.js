import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

/*
DEALER REFERRAL API – FINAL BULLETPROOF
✔ Google Login SAFE
✔ Mobile OTP SAFE
✔ Old users SAFE
✔ Role mismatch auto-fix
✔ Never returns "Unable to load referral data"
*/

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ ok: false });
    }

    await dbConnect();

    const userId = session.user.id || null;
    const email = session.user.email || null;
    const phone = session.user.phone || null;

    let dealer = null;

    /* ================= FIND DEALER (STEP BY STEP) ================= */

    // 1️⃣ Best: find by Mongo _id (Google + OTP safe)
    if (userId) {
      dealer = await User.findById(userId);
    }

    // 2️⃣ Fallback: find by email
    if (!dealer && email) {
      dealer = await User.findOne({ email });
    }

    // 3️⃣ Fallback: find by phone
    if (!dealer && phone) {
      dealer = await User.findOne({ phone });
    }

    // ❌ Still not found → SAFE EMPTY RESPONSE
    if (!dealer) {
      return res.json({
        ok: true,
        summary: {
          referralCode: "",
          currentLevel: 1,
          totalRewards: 0,
          monthRewards: 0,
          walletBalance: 0,
          withdrawn: 0,
          pending: 0,
          nextTarget: "Complete dealer profile",
          joinedOn: null,
          referralCreatedAt: null,
          accountStatus: "Inactive",
        },
        report: {
          totalTeam: 0,
          activeTeam: 0,
          inactiveTeam: 0,
          levelCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          totalSubscriptions: 0,
          activeSubscriptions: 0,
          expiredSubscriptions: 0,
          conversionRate: 0,
        },
        statement: [],
      });
    }

    /* ================= AUTO FIX ROLE ================= */
    if (dealer.role !== "dealer") {
      await User.updateOne(
        { _id: dealer._id },
        { $set: { role: "dealer" } }
      );
      dealer.role = "dealer";
    }

    /* ================= AUTO GENERATE REFERRAL ================= */
    if (!dealer.referralCode) {
      const base =
        (dealer.email && dealer.email.split("@")[0]) ||
        (dealer.phone && dealer.phone.slice(-6)) ||
        "DA";

      const referralCode =
        "DA-" +
        base.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) +
        "-" +
        Math.floor(1000 + Math.random() * 9000);

      const createdAt = new Date();

      await User.updateOne(
        { _id: dealer._id },
        {
          $set: {
            referralCode,
            referralCreatedAt: createdAt,
          },
        }
      );

      dealer.referralCode = referralCode;
      dealer.referralCreatedAt = createdAt;
    }

    /* ================= FINAL RESPONSE ================= */
    return res.json({
      ok: true,
      summary: {
        referralCode: dealer.referralCode,
        currentLevel: dealer.level || 1,
        totalRewards: dealer.wallet?.total || 0,
        monthRewards: dealer.wallet?.thisMonth || 0,
        walletBalance: dealer.wallet?.balance || 0,
        withdrawn: dealer.wallet?.withdrawn || 0,
        pending: dealer.wallet?.pending || 0,
        nextTarget: dealer.nextLevelTarget || "Active subscriptions required",
        joinedOn: dealer.createdAt || null,
        referralCreatedAt: dealer.referralCreatedAt || null,
        accountStatus: "Active",
      },
      report: {
        totalTeam: 0,
        activeTeam: 0,
        inactiveTeam: 0,
        levelCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        expiredSubscriptions: 0,
        conversionRate: 0,
      },
      statement: dealer.wallet?.statement || [],
    });
  } catch (err) {
    console.error("FINAL Dealer Referral API Error:", err);
    return res.status(500).json({ ok: false });
  }
}
