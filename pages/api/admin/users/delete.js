// pages/api/admin/users/delete.js
import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "userId missing" });

    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, message: "User deleted", user: deleted });
  } catch (err) {
    console.error("USER DELETE ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
