// pages/api/admin/users/update-status.js
import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST allowed" });
  }

  try {
    const { userId, active } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID missing" });
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { active },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: `User is now ${active ? "ACTIVE" : "BLOCKED"}`,
      user: updated,
    });

  } catch (err) {
    console.error("USER STATUS ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
