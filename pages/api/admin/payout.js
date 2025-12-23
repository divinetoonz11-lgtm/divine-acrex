import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

/*
ADMIN PAYOUT / SETTLEMENT API
✔ Approve pending rewards
✔ Mark payout processed
✔ Safe admin-only access
*/

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== "admin") {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  try {
    const { subscriptionIds = [] } = req.body;

    if (!Array.isArray(subscriptionIds) || subscriptionIds.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "No subscription IDs provided",
      });
    }

    await dbConnect();
    const db = mongoose.connection.db;

    const ids = subscriptionIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const result = await db.collection("subscriptions").updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          approved: true,
          approvedAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      ok: true,
      message: "Payout approved successfully",
      updatedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      message: "Server error",
    });
  }
}
