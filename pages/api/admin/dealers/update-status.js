// pages/api/admin/dealers/update-status.js
import dbConnect from "../../../../utils/dbConnect";
import Dealer from "../../../../models/Dealer";
import adminGuard from "../../../../utils/adminGuard";

export default async function handler(req, res) {
  // 🔒 SECURITY: adminGuard (origin + adminKey + session)
  if (!(await adminGuard(req, res))) return;

  await dbConnect();

  // ✅ ALIGN WITH FRONTEND (PUT)
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Only PUT allowed" });
  }

  try {
    // ✅ ALIGN FIELD NAME WITH FRONTEND
    const { id, status } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "id missing" });
    }

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "status missing" });
    }

    const dealer = await Dealer.findById(id);
    if (!dealer) {
      return res
        .status(404)
        .json({ success: false, message: "Dealer not found" });
    }

    // ✅ UPDATE STATUS
    dealer.status = status;
    await dealer.save();

    return res.status(200).json({
      success: true,
      message: "Dealer status updated",
      dealer,
    });
  } catch (err) {
    console.error("DEALER UPDATE STATUS ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
}
