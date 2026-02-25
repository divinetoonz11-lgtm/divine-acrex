// pages/api/dealer/coupon.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

/*
Coupon Types:
- PERCENT  (e.g. 20%)
- FLAT     (e.g. 2000)
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

  const { code, planPrice } = req.body || {};

  if (!code || !planPrice) {
    return res.status(400).json({
      ok: false,
      message: "Coupon or price missing",
    });
  }

  const client = await clientPromise;
  const db = client.db();

  /* ================= FIND COUPON ================= */
  const coupon = await db.collection("coupons").findOne({
    code: code.toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    return res.json({
      ok: false,
      message: "Invalid or inactive coupon",
    });
  }

  /* ================= EXPIRY CHECK ================= */
  if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
    return res.json({
      ok: false,
      message: "Coupon expired",
    });
  }

  /* ================= DISCOUNT ================= */
  let discount = 0;
  const price = Number(planPrice);

  if (coupon.type === "PERCENT") {
    discount = Math.round((price * Number(coupon.value)) / 100);
  }

  if (coupon.type === "FLAT") {
    discount = Number(coupon.value);
  }

  if (discount > price) discount = price;

  return res.json({
    ok: true,
    code: coupon.code,
    discount,
    finalPrice: price - discount,
    message: "Coupon applied successfully",
  });
}
