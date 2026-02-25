// pages/api/dealer/subscription.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";

/*
SUBSCRIPTION API – FINAL (REAL DB)
✔ FREE plan = 10 listings / 3 months
✔ 11th listing se payment required
✔ One-time FREE only
✔ MongoDB based
*/

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    await dbConnect();

    const dealer = await User.findOne({ email: session.user.email });
    if (!dealer) {
      return res.status(404).json({ ok: false, message: "Dealer not found" });
    }

    /* ================= GET ================= */
    if (req.method === "GET") {
      return res.json({
        ok: true,
        subscription: dealer.subscription || {
          plan: "NONE",
          status: "NO_PLAN",
        },
      });
    }

    /* ================= POST ================= */
    if (req.method === "POST") {
      const { plan } = req.body;

      if (!plan) {
        return res.status(400).json({ ok: false, message: "Plan missing" });
      }

      // ❌ FREE already used
      if (
        plan === "FREE" &&
        dealer.subscription?.plan === "FREE"
      ) {
        return res.json({
          ok: false,
          message: "Free plan already used",
        });
      }

      const now = new Date();

      // ✅ FREE PLAN
      if (plan === "FREE") {
        dealer.subscription = {
          plan: "FREE",
          status: "ACTIVE",
          listingLimit: 10,
          usedListings: dealer.usedListings || 0,
          startedAt: now,
          expiresAt: new Date(
            now.getTime() + 90 * 24 * 60 * 60 * 1000 // 3 months
          ),
        };

        await dealer.save();

        return res.json({
          ok: true,
          message: "Free plan activated (10 listings / 3 months)",
          redirect: "/dealer/dashboard",
        });
      }

      // ✅ PAID PLANS (starter / pro / elite)
      dealer.subscription = {
        plan,
        status: "ACTIVE",
        listingLimit: plan === "STARTER" ? 50 : plan === "PRO" ? 300 : Infinity,
        usedListings: dealer.usedListings || 0,
        startedAt: now,
        expiresAt: null, // payment based expiry handled later
      };

      await dealer.save();

      return res.json({
        ok: true,
        message: "Subscription activated",
        redirect: "/dealer/dashboard",
      });
    }

    return res.status(405).json({ ok: false, message: "Method not allowed" });
  } catch (err) {
    console.error("Subscription API error:", err);
    return res.status(500).json({ ok: false });
  }
}
