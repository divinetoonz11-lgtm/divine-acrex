// pages/api/admin/dealers/update-status.js
import dbConnect from "../../../../utils/dbConnect";
import Dealer from "../../../../models/Dealer";
import adminGuard from "../../../../utils/adminGuard";

export default async function handler(req, res) {
  // SECURITY: origin + adminKey + nextauth-session email
  if (!(await adminGuard(req, res))) return;

  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const { dealerId, status } = req.body;
    if (!dealerId) return res.status(400).json({ success: false, message: "dealerId missing" });
    if (typeof status === "undefined") return res.status(400).json({ success: false, message: "status missing" });

    const dealer = await Dealer.findById(dealerId);
    if (!dealer) return res.status(404).json({ success: false, message: "Dealer not found" });

    // update status (example: approved / rejected / blocked)
    dealer.status = status;
    await dealer.save();

    return res.status(200).json({ success: true, message: "Dealer status updated", dealer });
  } catch (err) {
    console.error("DEALER UPDATE STATUS ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
