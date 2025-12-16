// pages/api/dealer/coupon.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
Coupon Types supported:
- PERCENT (ex: 20%)
- FLAT (ex: ₹2000)
*/

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const { code, planPrice } = req.body;

  if (!code || !planPrice) {
    return res.json({ ok: false, message: "Coupon or price missing" });
  }

  // FIND COUPON
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    return res.json({ ok: false, message: "Invalid coupon" });
  }

  // CHECK EXPIRY
  if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
    return res.json({ ok: false, message: "Coupon expired" });
  }

  let discount = 0;

  if (coupon.type === "PERCENT") {
    discount = Math.round((planPrice * coupon.value) / 100);
  }

  if (coupon.type === "FLAT") {
    discount = coupon.value;
  }

  if (discount > planPrice) discount = planPrice;

  return res.json({
    ok: true,
    code: coupon.code,
    discount,
    finalPrice: planPrice - discount,
    message: "Coupon applied successfully",
  });
}
