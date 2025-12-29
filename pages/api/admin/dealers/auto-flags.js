// pages/api/admin/dealers/auto-flags.js
import dbConnect from "../../../../utils/dbConnect";
import Dealer from "../../../../models/Dealer";
import Property from "../../../../models/Property";
import adminGuard from "../../../../utils/adminGuard";

/*
PHASE-3 – DEALER AUTO FLAGS
✔ Low performance detection
✔ Admin only
*/

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  await dbConnect();

  const dealers = await Dealer.find({}).lean();

  for (const d of dealers) {
    const liveCount = await Property.countDocuments({
      dealerId: d._id,
      status: "live",
    });

    if (liveCount < 2) {
      await Dealer.updateOne(
        { _id: d._id },
        { $set: { flagged: true, flagReason: "Low performance" } }
      );
    }
  }

  return res.json({ success: true, message: "Auto flags updated" });
}
