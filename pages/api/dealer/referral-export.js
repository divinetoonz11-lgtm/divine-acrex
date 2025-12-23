import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";
import User from "../../../models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end("Method Not Allowed");
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== "dealer") {
    return res.status(401).end("Unauthorized");
  }

  try {
    await dbConnect();
    const db = mongoose.connection.db;

    const dealer = await User.findOne({ email: session.user.email });
    if (!dealer || !dealer.referralCode) {
      return res.status(200).end("No data");
    }

    const subs = await db
      .collection("subscriptions")
      .find({ uplineCode: dealer.referralCode })
      .sort({ approvedAt: -1, createdAt: -1 })
      .toArray();

    let csv = "Date,Source,Type,Rewards Value,Status\n";

    subs.forEach((s) => {
      if (s.level < 1 || s.level > 5) return;

      const reward = s.rewardAmount || 0;
      const dt = new Date(s.approvedAt || s.createdAt).toDateString();
      const source =
        s.level === 1 ? "Direct Partner" : `Network Level ${s.level}`;
      const type = s.level === 1 ? "Direct Reward" : "Network Reward";
      const status = s.approved ? "Approved" : "Pending";

      csv += `${dt},${source},${type},${reward},${status}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=rewards-statement.csv"
    );

    return res.status(200).send(csv);
  } catch (err) {
    console.error(err);
    return res.status(500).end("Server Error");
  }
}
