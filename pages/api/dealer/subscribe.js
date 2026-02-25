// pages/api/dealer/subscribe.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

/*
DEALER SUBSCRIBE API – FINAL (MongoDB)
✔ No Prisma
✔ Referral supported
✔ Commission slab supported
✔ Admin approval flow
*/

export default async function handler(req, res) {
  /* ================= METHOD ================= */
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  /* ================= AUTH ================= */
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const { plan, amount, referralCode } = req.body || {};

  if (!plan || !amount) {
    return res.status(400).json({
      ok: false,
      message: "Plan or amount missing",
    });
  }

  const client = await clientPromise;
  const db = client.db();

  /* ================= BUYER (DEALER) ================= */
  const buyer = await db.collection("users").findOne({
    email: session.user.email,
    role: { $in: ["dealer", "DEALER"] },
    status: "active",
  });

  if (!buyer) {
    return res.status(404).json({
      ok: false,
      message: "Dealer not found",
    });
  }

  /* ================= REFERRER ================= */
  let referrer = null;

  if (referralCode) {
    referrer = await db.collection("users").findOne({
      referralCode,
      role: { $in: ["dealer", "DEALER"] },
    });
  }

  /* ================= COMMISSION LOGIC ================= */
  let commissionPercent = 0;

  if (referrer) {
    const lvl = Number(referrer.level || 1);

    commissionPercent =
      lvl >= 5 ? 20 :
      lvl === 4 ? 19 :
      lvl === 3 ? 17 :
      lvl === 2 ? 15 : 10;
  }

  const commissionAmount = referrer
    ? Math.round((Number(amount) * commissionPercent) / 100)
    : 0;

  /* ================= SAVE REQUEST ================= */
  await db.collection("subscriptionRequests").insertOne({
    buyerEmail: buyer.email,
    buyerId: buyer._id,

    plan,
    amount: Number(amount),

    referralCode: referralCode || null,
    referrerId: referrer ? referrer._id : null,
    commissionPercent,
    commissionAmount,

    status: "PENDING",            // 🔒 admin approval
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return res.json({
    ok: true,
    message:
      "Subscription request sent. Commission will be credited after admin approval.",
  });
}
