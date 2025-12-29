// pages/api/admin/dealers/properties.js
import dbConnect from "../../../../utils/dbConnect";
import Property from "../../../../models/Property";
import Dealer from "../../../../models/Dealer";
import adminGuard from "../../../../utils/adminGuard";

/*
PHASE-2 – DEALER PROPERTIES
✔ Admin only
✔ Dealer-wise properties
✔ Pagination capped
✔ Status filter
✔ 10L+ safe
*/

export default async function handler(req, res) {
  // 🔒 Admin security
  if (!(await adminGuard(req, res))) return;

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Only GET allowed" });
  }

  await dbConnect();

  try {
    const dealerId = req.query.dealerId;
    if (!dealerId) {
      return res.status(400).json({
        success: false,
        message: "dealerId required",
      });
    }

    // optional filters
    const status = req.query.status; // live | pending | rejected
    const page = Math.max(parseInt(req.query.page || "1"), 1);
    const limit = Math.min(parseInt(req.query.limit || "20"), 50);
    const skip = (page - 1) * limit;

    // ensure dealer exists
    const dealer = await Dealer.findById(dealerId).select("_id name");
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    const query = { dealerId };
    if (status) query.status = status;

    // 🔹 lean + projection (fast)
    const properties = await Property.find(query)
      .select(
        "_id title city price status views createdAt"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Property.countDocuments(query);

    return res.json({
      success: true,
      dealer,
      page,
      limit,
      total,
      properties,
    });
  } catch (err) {
    console.error("DEALER PROPERTIES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
