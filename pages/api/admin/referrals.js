// pages/api/admin/referrals.js
import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const ADMIN_EMAILS = [
  "inder.ambalika@gmail.com",
  "divinetoonz11@gmail.com",
];

export default async function handler(req, res) {
  // 🔐 ADMIN GUARD
  const session = await getServerSession(req, res, authOptions);
  if (!session || !ADMIN_EMAILS.includes(session.user?.email)) {
    return res.status(403).json({ ok: false, message: "Forbidden" });
  }

  const client = await clientPromise;
  const db = client.db("divine_db");

  // GET → all referral earnings / payouts
  if (req.method === "GET") {
    const data = await db
      .collection("referrals")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({ ok: true, data });
  }

  // POST → approve payout
  if (req.method === "POST") {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ ok: false, message: "Invalid request" });
    }

    await db.collection("referrals").updateOne(
      { _id: id },
      {
        $set: {
          payoutStatus: "APPROVED",
          paidAt: new Date(),
        },
      }
    );

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, message: "Method not allowed" });
}
