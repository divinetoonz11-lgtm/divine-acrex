import dbConnect from "../../../../utils/dbConnect";
import Dealer from "../../../../models/Dealer";
import adminGuard from "../../../../utils/adminGuard";

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  try {
    await dbConnect();

    if (req.method === "GET") {
      const dealers = await Dealer.find({}).limit(200).lean();
      return res.status(200).json({ success: true, dealers });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (err) {
    console.error("admin/dealers GET error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
