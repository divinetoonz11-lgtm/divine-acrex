// pages/api/subscribe.js

import clientPromise from "../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

/*
SUBSCRIPTION API
✔ Package purchase
✔ Referral code linking
✔ Level calculation
✔ Reward amount calculation
✔ Admin approval pending
*/

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  /* ================= AUTH ================= */
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const { plan, amount, referralCode } = req.body;

  if (!plan || !amount) {
    return res.status(400).json({ ok: false, message: "Invalid data" });
  }

  /* ================= DB ================= */
  const client = await clientPromise;
  const db = client.db();

  /* ================= BUYER ================= */
  const buyer = await db.collection("users").findOne({
    $or: [
      { email: session.user.email },
      { phone: session.user.phone },
    ],
  });

  if (!buyer) {
    return res.status(404).json({ ok: false, message: "User not found" });
  }

  /* ================= REFERRAL LOGIC ================= */
  let upline = null;
  let level = 1;
  let rewardPercent = 0;
  let rewardAmount = 0;

  // Commission structure
  const commission = {
    1: 10,
    2: 5,
    3: 2,
    4: 2,
    5: 1,
  };

  if (referralCode) {
    upline = await db.collection("users").findOne({
      referralCode,
    });

    if (upline) {
      // buyer ka level = upline ke level + 1
      level = Math.min((upline.level || 1) + 1, 5);

      rewardPercent = commission[level] || 0;
      rewardAmount = Math.round((amount * rewardPercent) / 100);
    }
  }

  /* ================= SAVE SUBSCRIPTION ================= */
  await db.collection("subscriptions").insertOne({
    buyerId: buyer._id,
    buyerName: buyer.name || "Dealer",
    plan,
    amount,
    referralCode: referralCode || null,
    uplineCode: referralCode || null,
    level,
    rewardAmount,
    approved: false, // 🔒 admin approval required
    createdAt: new Date(),
  });

  return res.status(200).json({
    ok: true,
    message: "Subscription created. Awaiting admin approval.",
  });
}
