import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import Dealer from "../../../models/Dealer";
import Property from "../../../models/Property";
import adminGuard from "../../../utils/adminGuard";

export default async function handler(req, res) {
  if (!(await adminGuard(req, res))) return;

  await dbConnect();

  try {
    if (req.method !== "GET") {
      return res.status(405).json({ success: false, message: "Only GET allowed" });
    }

    const totalUsers = await User.countDocuments();
    const totalDealers = await Dealer.countDocuments();
    const totalProperties = await Property.countDocuments();

    return res.status(200).json({
      success: true,
      stats: {
        users: totalUsers,
        dealers: totalDealers,
        properties: totalProperties,
      },
    });
  } catch (err) {
    console.error("OVERVIEW API ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
