// pages/api/admin/dealers/promote.js
import dbConnect from "../../../../utils/dbConnect";
import Dealer from "../../../../models/Dealer";
import adminGuard from "../../../../utils/adminGuard";

export default async function handler(req, res) {
  // 🔒 SECURITY: admin only
  if (!(await adminGuard(req, res))) return;

  await dbConnect();

  // ✅ FRONTEND ALIGNED (PUT)
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Only PUT allowed" });
  }

  try {
    // ✅ FIELD NAMES ALIGNED WITH FRONTEND
    const { id, promoted } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "id missing" });
    }

    const dealer = await Dealer.findById(id);
    if (!dealer) {
      return res
        .status(404)
        .json({ success: false, message: "Dealer not found" });
    }

    // ✅ TOGGLE PROMOTION
    dealer.promoted = Boolean(promoted);
    await dealer.save();

    return res.status(200).json({
      success: true,
      message: promoted ? "Dealer promoted" : "Dealer unpromoted",
      dealer,
    });
  } catch (err) {
    console.error("DEALER PROMOTE ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
}
