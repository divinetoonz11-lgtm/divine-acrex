import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Only GET request allowed" });
  }

  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select("name email phone role active createdAt");

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("ADMIN USERS GET ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
