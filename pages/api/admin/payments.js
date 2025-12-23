import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../utils/dbConnect";
import Payment from "../../../models/Payment";

/*
ADMIN PAYMENTS LIST API
✔ Admin only
✔ Latest first
*/

export default async function handler(req, res) {
  // ✅ METHOD CHECK
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  // ✅ SESSION CHECK
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user?.role !== "admin") {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  try {
    await dbConnect();

    const payments = await Payment.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, payments });
  } catch (err) {
    console.error("Admin payments error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
