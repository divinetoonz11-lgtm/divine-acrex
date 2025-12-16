// pages/api/dealer/subscribe.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ ok: false });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const { plan, amount, referralCode } = req.body;

  if (!plan || !amount) {
    return res.json({ ok: false, message: "Plan or amount missing" });
  }

  // 🔹 Buyer
  const buyer = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!buyer) {
    return res.status(404).json({ ok: false });
  }

  // 🔹 Find referrer (dealer)
  let referrer = null;
  if (referralCode) {
    referrer = await prisma.user.findFirst({
      where: { referralCode },
    });
  }

  // 🔹 Commission calculation (simple)
  let commissionPercent = 0;
  if (referrer) {
    commissionPercent = referrer.level >= 5 ? 20 :
                        referrer.level === 4 ? 19 :
                        referrer.level === 3 ? 17 :
                        referrer.level === 2 ? 15 : 10;
  }

  const commissionAmount = referrer
    ? Math.round((amount * commissionPercent) / 100)
    : 0;

  // 🔹 Save subscription request
  await prisma.subscriptionRequest.create({
    data: {
      userId: buyer.id,
      plan,
      amount,
      referralCode: referralCode || null,
      referrerId: referrer ? referrer.id : null,
      commissionAmount,
      commissionPercent,
      status: "PENDING", // admin approval
    },
  });

  return res.json({
    ok: true,
    message: "Subscription request sent. Commission will be credited after approval.",
  });
}
